import { executeJob } from "./executor";
import { JobModel } from "@/models/Job";
import { connectDB } from "./db";

interface JobQueueItem{
    jobId: string
    priority: number 
    queuedAt: Date
}

interface PoolStatus{
    maxConcurrent: number
    currentlyRunning: number
    queueLength: number
    activeJobs: string[]
    mode: 'fifo' | 'priority'
}

class WorkerPool{
    private maxConcurrent: number
    private currentlyRunning: number
    private queue: JobQueueItem[]
    private activeJobs: Map<string, {startedAt: Date, pid?: number}>
    private mode: 'fifo' | 'priority'

    constructor(maxConcurrent: number = 3, mode: 'fifo' | 'priority' = 'fifo'){
        this.maxConcurrent = maxConcurrent
        this.currentlyRunning = 0
        this.queue = []
        this.activeJobs = new Map()
        this.mode = mode
    }

    async submit(jobId: string): Promise<void> {
        await connectDB()
        
        const job = await JobModel.findById(jobId);
        if(!job){
            throw new Error(`Job ${jobId} not found`)
        }

        if(this.currentlyRunning < this.maxConcurrent){
            this.currentlyRunning++
            this.run(jobId)
        }
        else{
            this.queue.push({
                jobId: jobId,
                priority: job.priority,
                queuedAt: new Date()
            })

            await this.updateQueuePositions()

            job.status = 'queued'
            job.queuePosition = this.queue.findIndex(item => item.jobId === jobId) + 1
            await job.save();
        }
    }

    private async run(jobId:string): Promise<void> {
        this.activeJobs.set(jobId,{startedAt: new Date()})
        
        try {
            await executeJob(jobId)
        } catch (error) {
            console.error(`Error executing job ${jobId}: `, error)
        }
        finally{
            this.activeJobs.delete(jobId)
            this.currentlyRunning--

            this.processQueue()
        }
    }

    private async processQueue():Promise<void> {
        if(this.queue.length === 0 || this.currentlyRunning >= this.maxConcurrent){
            return
        }

        const nextJob = this.getNextJob()
        if(!nextJob){
            return
        }

        const index = this.queue.findIndex(item => item.jobId === nextJob.jobId)
        if(index !== -1){
            this.queue.splice(index, 1);
        }
        await this.updateQueuePositions()

        this.currentlyRunning++
        this.run(nextJob.jobId)
    }

    private getNextJob(): JobQueueItem | null{
        if(this.queue.length === 0){
            return null
        }

        if(this.mode === 'fifo'){
            return this.queue[0]
        }
        else{
            let highestPriorityJob = this.queue[0]

            for(const job of this.queue){
                if(job.priority > highestPriorityJob.priority){
                    highestPriorityJob = job
                }
                else if(job.priority === highestPriorityJob.priority){
                    if (job.queuedAt < highestPriorityJob.queuedAt) {
                        highestPriorityJob = job
                    }
                }
            }
            return highestPriorityJob;
        }        
    }

    private async updateQueuePositions(): Promise<void> {
        await connectDB()

        for(let i = 0;i < this.queue.length;i++){
            const item = this.queue[i];

            try {
                await JobModel.findByIdAndUpdate(item.jobId, {
                    queuePosition: i + 1
                })
            } catch (error) {
                console.error(`Failed to update queue position for job ${item.jobId}`)
            }
        }
    }
    getStatus(): PoolStatus{
        return{
            maxConcurrent: this.maxConcurrent,
            currentlyRunning: this.currentlyRunning,
            queueLength: this.queue.length,
            activeJobs: Array.from(this.activeJobs.keys()),
            mode: this.mode
        }
    }

    async updateConcurrency(newMax: number): Promise<void> {
        if(newMax < 1) {
            throw new Error('Max concurrency must be at least 1')
        }

        const oldMax = this.maxConcurrent
        this.maxConcurrent = newMax

        if(newMax > oldMax){
            const slotsToFill = newMax - this.currentlyRunning

            for (let i = 0; i < slotsToFill; i++) {
                await this.processQueue()
            } 
        }
    }

    setMode(mode: 'fifo' | 'priority'): void{
        this.mode = mode
    }

    getQueue(): JobQueueItem[]{
        return [...this.queue]
    }

    async clearQueue(): Promise<void>{
        await connectDB()

        for(const item of this.queue){
            try {
                await JobModel.findByIdAndUpdate(item.jobId,{
                    status: 'failed',
                    error: 'Queue cleared by Administrator',
                    completedAt: new Date()
                })
            } catch (error) {
                console.error(`Failed to clear job ${item.jobId}`)
            }
        }
        this.queue = []    
    }

    async recoverOrphanedJobs(): Promise<void> {
        await connectDB()

        const orphanedJobs = await JobModel.find({status: 'running'})

        for(const job of orphanedJobs){
            job.status = 'failed'
            job.error = 'Server restarted during execution'
            job.completedAt = new Date()

            await job.save()
        }

        console.log(`Recovered ${orphanedJobs.length} orphaned jobs`)
    }
};

const workerPool = new WorkerPool(3, 'fifo')

export default workerPool