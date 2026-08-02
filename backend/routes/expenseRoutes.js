const express = require('express');
const multer = require('multer');
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpensesCSV,
  importExpensesCSV
} = require('../controllers/expenseController');

const router = express.Router();

// Multer configuration for memory storage (for CSV upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// CSV routes
router.get('/export', exportExpensesCSV);
router.post('/import', upload.single('file'), importExpensesCSV);

// Standard CRUD routes
router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
