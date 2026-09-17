const mongoose = require('mongoose');
const seedDatabase = require('./seed');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      console.log('Connecting to provided MongoDB URI...');
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully!');
    } else {
      console.log('MONGODB_URI not found. Starting embedded MongoDB Memory Server for zero-config operation...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      console.log(`Embedded MongoDB Memory Server started at: ${uri}`);
      await mongoose.connect(uri);
      console.log('Connected to embedded MongoMemoryServer!');
    }

    // Seed database with initial accounts, users, and transactions
    await seedDatabase();

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // If external DB connection fails, attempt MongoMemoryServer fallback
    try {
      console.log('Attempting fallback to embedded MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log('Fallback connected to embedded MongoMemoryServer!');
      await seedDatabase();
    } catch (fallbackError) {
      console.error('Fatal: Failed to connect to any MongoDB server:', fallbackError);
    }
  }
};

module.exports = connectDB;
