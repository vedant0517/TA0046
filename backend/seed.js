const mongoose = require('mongoose');
require('dotenv').config();
const NeedyPerson = require('./models/NeedyPerson');

// Initial needy people data
const needyPeopleData = [
  { needyId: 'N001', name: 'Ramesh Patil', area: 'Nagpur', category: 'Food', phone: '' },
  { needyId: 'N002', name: 'Sunita Kale', area: 'Pune', category: 'Clothes', phone: '' },
  { needyId: 'N003', name: 'Mohan Deshmukh', area: 'Mumbai', category: 'Education', phone: '' },
  { needyId: 'N004', name: 'Asha Jadhav', area: 'Nashik', category: 'Medical', phone: '' },
  { needyId: 'N005', name: 'Ravi More', area: 'Aurangabad', category: 'Daily Essentials', phone: '' },
  { needyId: 'N006', name: 'Pooja Shinde', area: 'Kolhapur', category: 'Food', phone: '' },
  { needyId: 'N007', name: 'Suresh Pawar', area: 'Solapur', category: 'Clothes', phone: '' },
  { needyId: 'N008', name: 'Kavita Thakur', area: 'Thane', category: 'Education', phone: '' },
  { needyId: 'N009', name: 'Anil Pawar', area: 'Amravati', category: 'Medical', phone: '' },
  { needyId: 'N010', name: 'Neha Kulkarni', area: 'Satara', category: 'Daily Essentials', phone: '' }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careconnect');

    console.log('✅ Connected to MongoDB');

    // Check if needy people already exist
    const count = await NeedyPerson.countDocuments();
    
    if (count > 0) {
      console.log(`ℹ️  Database already has ${count} needy people records`);
      console.log('   Run this with --force flag to reset: node seed.js --force');
      
      if (!process.argv.includes('--force')) {
        await mongoose.connection.close();
        process.exit(0);
      }
      
      // Clear existing data
      await NeedyPerson.deleteMany({});
      console.log('🗑️  Cleared existing needy people data');
    }

    // Insert needy people data
    await NeedyPerson.insertMany(needyPeopleData);
    console.log(`✅ Successfully seeded ${needyPeopleData.length} needy people records`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
