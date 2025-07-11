import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

//To avoid recreating a connection on each call
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongoDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectMongoDB;
