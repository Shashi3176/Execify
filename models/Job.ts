import mongoose, { Schema, model, models, Document } from 'mongoose';

interface JobDocument extends Document {
  code: string;
  language: 'javascript' | 'python';
  status: 'queued' | 'running' | 'completed' | 'failed';
  output: string;
  error: string;
  pid?: number;
  executionTime?: number;
  memoryUsed?: number;
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority: number;
  queuePosition?: number;
  schedulingMode: 'fifo' | 'priority';
  queueMode: { type: String, enum: ['fifo', 'priority'], default: 'fifo', index: true };
}

const jobSchema = new Schema<JobDocument>(
  {
    code: { type: String, required: true },
    language: { type: String, enum: ['javascript', 'python'], default: 'javascript' },
    status: { type: String, enum: ['queued', 'running', 'completed', 'failed'], default: 'queued' },
    output: { type: String, default: '' },
    error: { type: String, default: '' },
    pid: { type: Number },
    executionTime: { type: Number },
    memoryUsed: { type: Number },
    queuedAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    completedAt: { type: Date },
    priority: { type: Number, default: 3, validate: {
      validator: (v: number) => v >= 1 && v <= 5,
      message: (props) => `${props.value} is not a valid priority! Must be between 1 and 5.`
    } },
    queuePosition: { type: Number },
    schedulingMode: { type: String, enum: ['fifo', 'priority'], default: 'fifo' },
  },
  { timestamps: true }
);

export const JobModel = models.Job || model<JobDocument>('Job', jobSchema);