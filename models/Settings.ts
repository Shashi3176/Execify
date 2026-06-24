import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  maxConcurrent: { type: Number, required: true, default: 3, min: 1 },
  mode: { type: String, required: true, default: 'fifo', enum: ['fifo', 'priority'] },
});

export const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
