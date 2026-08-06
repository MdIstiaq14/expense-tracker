const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const Expense = require('../models/Expense');
const User = require('../models/User');

// Force public DNS resolution for MongoDB Atlas SRV lookup on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Medical',
  'Education',
  'Travel',
  'Others'
];

const paymentMethods = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Net Banking'];

// Generate dummy expenses bound to userId
const generateSeedData = (userId) => {
  const expenses = [];
  const now = new Date();
  
  const titles = {
    Food: ['Groceries at Supermarket', 'Dinner with Friends', 'Lunch Combo', 'Coffee & Croissant', 'Pizza Delivery', 'Sushi Night'],
    Transport: ['Uber Ride', 'Monthly Metro Pass', 'Gas Station Fill-up', 'Toll Fees', 'Parking Ticket'],
    Shopping: ['Summer Jacket', 'Wireless Earbuds', 'Running Shoes', 'Home Decor Item', 'Books from Amazon'],
    Bills: ['Electricity Bill', 'Water Bill', 'Internet Subscription', 'Mobile Phone Plan', 'Gym Membership'],
    Entertainment: ['Netflix Subscription', 'Movie Tickets', 'Board Game', 'Concert Pass', 'Bowling night'],
    Medical: ['Pharmacy Prescription', 'Dental Checkup', 'Multivitamins', 'Doctor Consultation'],
    Education: ['Udemy React Course', 'Technical Books', 'Coding Bootcamp Monthly Fee', 'Notebooks & Pens'],
    Travel: ['Flight Ticket to NY', 'Hotel Booking', 'Travel Insurance', 'Souvenir Shopping'],
    Others: ['Gift for Mom', 'Dry Cleaning', 'Charity Donation', 'Lost Item Replacement']
  };

  const getRandomDateThisWeek = () => {
    const d = new Date(now);
    const day = d.getDay();
    const diff = Math.floor(Math.random() * (day + 1));
    d.setDate(d.getDate() - diff);
    d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0);
    return d;
  };

  const getRandomDateThisMonthBeforeThisWeek = () => {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay() - 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const timeDiff = d.getTime() - startOfMonth.getTime();
    if (timeDiff <= 0) return startOfMonth;
    const randomTime = startOfMonth.getTime() + Math.random() * timeDiff;
    return new Date(randomTime);
  };

  const getRandomDatePastMonth = (monthsAgo) => {
    const year = now.getFullYear();
    const month = now.getMonth() - monthsAgo;
    const d = new Date(year, month, Math.floor(Math.random() * 28) + 1);
    d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0);
    return d;
  };

  for (let i = 0; i < 8; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titleList = titles[category] || titles['Others'];
    const title = titleList[Math.floor(Math.random() * titleList.length)];
    let amount = category === 'Bills' ? (Math.random() * 80 + 30) : (Math.random() * 45 + 5);

    expenses.push({
      user: userId,
      title,
      amount: parseFloat(amount.toFixed(2)),
      category,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: getRandomDateThisWeek(),
      notes: Math.random() > 0.5 ? `Weekly expenditure for ${category.toLowerCase()}` : ''
    });
  }

  for (let i = 0; i < 10; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titleList = titles[category] || titles['Others'];
    const title = titleList[Math.floor(Math.random() * titleList.length)];
    let amount = category === 'Bills' ? (Math.random() * 120 + 40) : (Math.random() * 60 + 8);

    expenses.push({
      user: userId,
      title,
      amount: parseFloat(amount.toFixed(2)),
      category,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: getRandomDateThisMonthBeforeThisWeek(),
      notes: ''
    });
  }

  for (let m = 1; m <= 5; m++) {
    for (let i = 0; i < 5; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const titleList = titles[category] || titles['Others'];
      const title = titleList[Math.floor(Math.random() * titleList.length)];
      let amount = category === 'Bills' ? (Math.random() * 150 + 50) : (Math.random() * 50 + 5);

      expenses.push({
        user: userId,
        title,
        amount: parseFloat(amount.toFixed(2)),
        category,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        date: getRandomDatePastMonth(m),
        notes: ''
      });
    }
  }

  return expenses;
};

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');

    console.log('Clearing existing records...');
    await Expense.deleteMany();
    await User.deleteMany();

    console.log('Creating demo user account (admin@expense.com / password123)...');
    const demoUser = await User.create({
      name: 'Md Istiaq (Admin & Owner)',
      email: 'admin@expense.com',
      password: 'password123',
      isAdmin: true
    });

    console.log('Generating seed data bound to demo user...');
    const seedExpenses = generateSeedData(demoUser._id);

    console.log(`Seeding ${seedExpenses.length} expenses...`);
    await Expense.insertMany(seedExpenses);
    console.log('Database successfully seeded with demo user and transactions!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
