import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDiagnosticData } from './utils/diagnosticSeedData.js';

// Load environment variables
dotenv.config();

const quickSeed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🌱 Starting data seeding...');
    const result = await seedDiagnosticData();
    
    console.log('✅ Seeding completed successfully!');
    console.log(`📊 Created ${result.tests.length} tests and ${result.packages.length} packages`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

quickSeed(); 