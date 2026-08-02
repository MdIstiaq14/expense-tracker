const mongoose = require('mongoose');

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

const paymentMethods = [
  'Cash',
  'Card',
  'UPI',
  'Bank Transfer',
  'Net Banking',
  'Others'
];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: categories,
        message: '{VALUE} is not a valid category'
      }
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: paymentMethods,
        message: '{VALUE} is not a valid payment method'
      },
      default: 'Cash'
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
