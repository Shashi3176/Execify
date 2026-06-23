import {spawn, ChildProcess} from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import pidusage from 'pidusage';
import { JobModel } from '@/models/Job';
import { connectDB } from './db';

interface ExecutionResult{
    output: string
    error: string
    exitCode: number | null
    signal: string | null
    executionTime: number
    memoryUsed: number
    timedOut: boolean
}

export async function executeJob(jobId: string): Promise<void> {
    await connectDB();

    const job = await JobModel.findById(jobId);
    if(!job){
        throw new Error(`Job ${jobId} not found`)
    }

    job.status = 'running';
    job.startedAt = new Date();
    await job.save();

    try {
        const result = await runProcess(job);

        job.output = result.output;
        job.error = result.error;
        job.executionTime = result.executionTime;
        job.memoryUsed = result.memoryUsed;
        job.status = result.timedOut || result.exitCode !== 0 ? 'failed' : 'completed';
        job.completedAt = new Date();

        await job.save();
    } catch (error: any) {
        job.status = 'failed';
        job.error = error.message;
        job.completedAt = new Date();
        
        await job.save();
    }
}

function writeTempFile(jobId: string,code: string,language: string): string{
    const tmpDir = os.tmpdir();
    const extension = language === 'javascript' ? 'js' : 'py';
    const filename = `execify-${jobId}.${extension}`;
    const filePath = path.join(tmpDir, filename);

    fs.writeFileSync(filePath, code);

    return filePath;
}

function cleanupTempFile(filePath: string): void{
    try {
        fs.unlinkSync(filePath);        
    } catch (error) {
        
    }
}

async function runProcess(job: any): Promise<ExecutionResult>{
    const filePath = writeTempFile(job._id.toString(), job.code, job.language);

    const command = job.language === 'javascript' ? 'node' : 'python3';
    const args = [filePath];

    const child: ChildProcess = spawn(command, args);

    if(child.pid){
        job.pid = child.pid;
        await job.save().catch(() => {});
    }

    let outputData = '';
    let errorData = '';

    child.stdout?.on('data', (data: Buffer) => {
        outputData += data.toString();
    })

    child.stderr?.on('data', (data: Buffer) => {
        errorData += data.toString();
    })

    let timedOut = false;
    let memoryUsed = 0;
    const TIME_LIMIT = 10000;

    let forceKillTimer: NodeJS.Timeout;

    const killTimer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');

        forceKillTimer = setTimeout(() => {
            if(child.exitCode === null){
                child.kill('SIGKILL');
            }
        },2000);

    }, TIME_LIMIT)

    setTimeout(async() => {
        if(child.pid && child.exitCode === null){
            try{
                const stats = await pidusage(child.pid);
                memoryUsed = stats.memory;
            }
            catch(error){

            }
        }
    }, 500);

    const startTime = Date.now();

    return new Promise((resolve) => {
        child.on('exit', (exitCode, signal) => {
            clearTimeout(killTimer);
            clearTimeout(forceKillTimer);
            
            
            const executionTime = Date.now() - startTime;

            cleanupTempFile(filePath);

            resolve({
                output: outputData,
                error: timedOut ? 'Time Limit Exceeded (10s)' : errorData,
                exitCode,
                signal,
                executionTime,
                memoryUsed,
                timedOut
            })
        })

        child.on('error', (err) => {
            clearTimeout(killTimer);
            clearTimeout(forceKillTimer);
            cleanupTempFile(filePath);

            resolve({
                output: '',
                error: err.message,
                exitCode: null,
                signal: null,
                executionTime: Date.now() - startTime,
                memoryUsed: 0,
                timedOut: false
            })
        })
    })
}