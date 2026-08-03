const Expense = require('../models/Expense');
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const stream = require('stream');

// @desc    Get all expenses for logged in user with search, filter, sort, pagination
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const { search, category, startDate, endDate, month, sortBy, page = 1, limit = 10 } = req.query;

    // Filter strictly by logged-in user ID
    const query = { user: req.user._id };

    // 1. Search by title (case insensitive regex)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // 2. Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // 3. Filter by date range (startDate & endDate)
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // 4. Filter by month (Format: YYYY-MM)
    if (month && !startDate && !endDate) {
      const [year, monthVal] = month.split('-');
      const startOfMonth = new Date(year, monthVal - 1, 1);
      const endOfMonth = new Date(year, monthVal, 0, 23, 59, 59, 999);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Sorting
    let sortObj = { date: -1 }; // default: latest first
    if (sortBy === 'amount_desc') {
      sortObj = { amount: -1 };
    } else if (sortBy === 'amount_asc') {
      sortObj = { amount: 1 };
    } else if (sortBy === 'date_asc') {
      sortObj = { date: 1 };
    } else if (sortBy === 'date_desc') {
      sortObj = { date: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      currentPage: parseInt(page),
      data: expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expense for logged in user
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new expense bound to logged in user
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      paymentMethod,
      date: date ? new Date(date) : undefined,
      notes
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    let expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, paymentMethod, date, notes },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export expenses to CSV for logged in user
// @route   GET /api/expenses/export
// @access  Private
exports.exportExpensesCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

    const fields = [
      { label: 'Title', value: 'title' },
      { label: 'Amount', value: 'amount' },
      { label: 'Category', value: 'category' },
      { label: 'Payment Method', value: 'paymentMethod' },
      { label: 'Date', value: (row) => new Date(row.date).toISOString().split('T')[0] },
      { label: 'Notes', value: 'notes' }
    ];

    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(expenses);

    res.header('Content-Type', 'text/csv');
    res.attachment('my-expenses.csv');
    return res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Import expenses from CSV bound to logged in user
// @route   POST /api/expenses/import
// @access  Private
exports.importExpensesCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
    }

    const expenses = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    let hasErrors = false;
    const errors = [];
    let rowIndex = 0;

    bufferStream
      .pipe(csv())
      .on('data', (row) => {
        rowIndex++;
        const cleanRow = {};
        Object.keys(row).forEach(key => {
          cleanRow[key.trim()] = row[key];
        });

        const title = cleanRow['Title'] || cleanRow['title'];
        const amount = parseFloat(cleanRow['Amount'] || cleanRow['amount']);
        const category = cleanRow['Category'] || cleanRow['category'];
        const paymentMethod = cleanRow['Payment Method'] || cleanRow['paymentMethod'] || 'Cash';
        const dateStr = cleanRow['Date'] || cleanRow['date'];
        const notes = cleanRow['Notes'] || cleanRow['notes'] || '';

        if (!title) {
          hasErrors = true;
          errors.push(`Row ${rowIndex}: Title is required`);
        }
        if (isNaN(amount) || amount <= 0) {
          hasErrors = true;
          errors.push(`Row ${rowIndex}: Amount must be a positive number`);
        }
        if (!category) {
          hasErrors = true;
          errors.push(`Row ${rowIndex}: Category is required`);
        }

        const date = dateStr ? new Date(dateStr) : new Date();

        if (!hasErrors) {
          expenses.push({
            user: req.user._id,
            title,
            amount,
            category,
            paymentMethod,
            date,
            notes
          });
        }
      })
      .on('end', async () => {
        if (hasErrors) {
          return res.status(400).json({ success: false, message: 'CSV Validation Failed', errors });
        }

        if (expenses.length === 0) {
          return res.status(400).json({ success: false, message: 'CSV is empty or could not be parsed' });
        }

        await Expense.insertMany(expenses);
        res.status(200).json({
          success: true,
          message: `Successfully imported ${expenses.length} expenses`
        });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
