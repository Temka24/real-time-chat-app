import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URL || '';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Модулийн түвшний кэшийн обьект үүсгэх
const mongooseCache: MongooseCache = { conn: null, promise: null };

async function connectToDatabase() {
    if (mongooseCache.conn) {
        console.log('Using cached connection');
        return mongooseCache.conn;
    }

    if (!mongooseCache.promise) {
        console.log('Creating new connection');
        mongooseCache.promise = mongoose.connect(MONGODB_URI);
    }

    try {
        mongooseCache.conn = await mongooseCache.promise;
        console.log('Database connected successfully');
        return mongooseCache.conn;
    } catch (error) {
        console.error('Database connection failed:', error);
        mongooseCache.promise = null; // Холболт амжилтгүй бол promise-ийг дахин тохируулах
        throw error;
    }
}

export default connectToDatabase;

