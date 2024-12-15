import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('user already connected');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);

        // Graceful exit in case of a connection error
        process.exit(1);
    }
}
