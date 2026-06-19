import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/execify';

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

const globalCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = globalCache;
}

export async function connectDB(): Promise<mongoose.Connection> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    globalCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    const mongooseInstance = await globalCache.promise;
    globalCache.conn = mongooseInstance.connection;
    return globalCache.conn;
  } catch (error) {
    globalCache.promise = null;
    throw error;
  }
}