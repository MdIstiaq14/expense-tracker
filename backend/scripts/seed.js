const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const Expense = require('../models/Expense');

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

// Generate dummy expenses
const generateSeedData = () => {
  const expenses = [];
  const now = new Date();
  
  // Titles for each category to look realistic
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

  // Helper to get random date in current week
  const getRandomDateThisWeek = () => {
    const d = new Date(now);
    const day = d.getDay(); // 0-6
    const diff = Math.floor(Math.random() * (day + 1)); // random days ago back to Sunday
    d.setDate(d.getDate() - diff);
    d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0);
    return d;
  };

  // Helper to get random date in current month (but before this week)
  const getRandomDateThisMonthBeforeThisWeek = () => {
    const d = new Date(now);
    // Go back to at least Sunday
    d.setDate(d.getDate() - d.getDay() - 1);
    
    // Random day in this month before Sunday
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const timeDiff = d.getTime() - startOfMonth.getTime();
    if (timeDiff <= 0) return startOfMonth;
    
    const randomTime = startOfMonth.getTime() + Math.random() * timeDiff;
    return new Date(randomTime);
  };

  // Helper to get random date in past months
  const getRandomDatePastMonth = (monthsAgo) => {
    const year = now.getFullYear();
    const month = now.getMonth() - monthsAgo;
    
    const d = new Date(year, month, Math.floor(Math.random() * 28) + 1);
    d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0);
    return d;
  };

  // 1. Generate items for this week (6-8 items)
  const itemsThisWeekCount = 8;
  for (let i = 0; i < itemsThisWeekCount; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titleList = titles[category] || titles['Others'];
    const title = titleList[Math.floor(Math.random() * titleList.length)];
    
    let amount = 0;
    if (category === 'Bills') amount = parseFloat((Math.random() * 80 + 30).toFixed(2));
    else if (category === 'Travel') amount = parseFloat((Math.random() * 300 + 100).toFixed(2));
    else if (category === 'Shopping') amount = parseFloat((Math.random() * 100 + 15).toFixed(2));
    else amount = parseFloat((Math.random() * 45 + 5).toFixed(2));

    expenses.push({
      title,
      amount,
      category,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: getRandomDateThisWeek(),
      notes: Math.random() > 0.5 ? `Weekly expenditure for ${category.toLowerCase()}` : ''
    });
  }

  // 2. Generate items for this month but before this week (8-10 items)
  const itemsThisMonthBeforeWeekCount = 10;
  for (let i = 0; i < itemsThisMonthBeforeWeekCount; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titleList = titles[category] || titles['Others'];
    const title = titleList[Math.floor(Math.random() * titleList.length)];
    
    let amount = 0;
    if (category === 'Bills') amount = parseFloat((Math.random() * 120 + 40).toFixed(2));
    else if (category === 'Travel') amount = parseFloat((Math.random() * 200 + 50).toFixed(2));
    else amount = parseFloat((Math.random() * 60 + 8).toFixed(2));

    expenses.push({
      title,
      amount,
      category,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: getRandomDateThisMonthBeforeThisWeek(),
      notes: Math.random() > 0.7 ? `Monthly check on ${category.toLowerCase()}` : ''
    });
  }

  // 3. Generate items for previous 5 months (approx 4-6 items per month)
  for (let m = 1; m <= 5; m++) {
    const monthlyItemsCount = 5;
    for (let i = 0; i < monthlyItemsCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const titleList = titles[category] || titles['Others'];
      const title = titleList[Math.floor(Math.random() * titleList.length)];
      
      let amount = 0;
      if (category === 'Bills') amount = parseFloat((Math.random() * 150 + 50).toFixed(2));
      else if (category === 'Shopping') amount = parseFloat((Math.random() * 120 + 20).toFixed(2));
      else amount = parseFloat((Math.random() * 50 + 5).toFixed(2));

      expenses.push({
        title,
        amount,
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

    console.log('Clearing existing expenses...');
    await Expense.deleteMany();
    console.log('Existing expenses cleared.');

    console.log('Generating seed data...');
    const seedExpenses = generateSeedData();

    console.log(`Seeding ${seedExpenses.length} expenses...`);
    await Expense.insertMany(seedExpenses);
    console.log('Database successfully seeded!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
