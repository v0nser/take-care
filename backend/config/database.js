import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Try connecting to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Try connecting without authentication
    try {
      console.log('🔄 Trying to connect without authentication...');
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/takecare?authSource=admin');
      console.log(`🍃 MongoDB Connected (no auth): ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
    } catch (fallbackError) {
      console.error('❌ MongoDB fallback connection also failed:', fallbackError.message);
      console.log('💡 Please ensure MongoDB is running or use MongoDB Atlas.');
      console.log('💡 You can also use a cloud MongoDB instance by updating MONGODB_URI in .env');
      process.exit(1);
    }
  }
};

export default connectDB;
