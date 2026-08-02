const Expense = require('../models/Expense');

// @desc    Get dashboard metrics and aggregated chart data
// @route   GET /api/dashboard
// @access  Public
exports.getDashboardData = async (req, res) => {
  try {
    const now = new Date();

    // 1. Total Expenses
    const totalAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpense = totalAgg.length > 0 ? totalAgg[0].total : 0;

    // 2. Monthly Expenses (Current Month)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const monthlyAgg = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyExpense = monthlyAgg.length > 0 ? monthlyAgg[0].total : 0;

    // 3. Weekly Expenses (Current Week - Starting Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyAgg = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const weeklyExpense = weeklyAgg.length > 0 ? weeklyAgg[0].total : 0;

    // 4. Total Transactions count
    const totalTransactions = await Expense.countDocuments();

    // 5. Recent 5 Transactions
    const recentTransactions = await Expense.find()
      .sort({ date: -1 })
      .limit(5);

    // 6. Category Breakdown Aggregation (for Pie Chart)
    const categoryAgg = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      },
      { $project: { name: '$_id', value: { $round: ['$amount', 2] }, _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    // 7. Weekly Expense aggregation by day of week (for Line Chart)
    // We want data for the current week's 7 days: Sun, Mon, Tue, Wed, Thu, Fri, Sat
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyChartData = daysOfWeek.map((day, index) => {
      return { name: day, amount: 0 };
    });

    const weeklyExpensesList = await Expense.find({
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    weeklyExpensesList.forEach(exp => {
      const expDate = new Date(exp.date);
      const dayIndex = expDate.getDay(); // 0 (Sun) to 6 (Sat)
      weeklyChartData[dayIndex].amount += exp.amount;
    });

    // Round the values
    weeklyChartData.forEach(item => {
      item.amount = Math.round(item.amount * 100) / 100;
    });

    // 8. Monthly Expense aggregation (for Bar Chart)
    // Last 6 months of data, including current month
    const monthlyChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const yearLabel = d.getFullYear();
      monthlyChartData.push({
        name: `${monthLabel} ${yearLabel}`,
        amount: 0,
        year: yearLabel,
        monthNum: d.getMonth() // 0-indexed
      });
    }

    // Query for expenses in the 6 month window
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const sixMonthsExpenses = await Expense.find({
      date: { $gte: sixMonthsAgo }
    });

    sixMonthsExpenses.forEach(exp => {
      const expDate = new Date(exp.date);
      const expMonth = expDate.getMonth();
      const expYear = expDate.getFullYear();

      const target = monthlyChartData.find(item => item.monthNum === expMonth && item.year === expYear);
      if (target) {
        target.amount += exp.amount;
      }
    });

    // Round values and remove helpers
    monthlyChartData.forEach(item => {
      item.amount = Math.round(item.amount * 100) / 100;
      delete item.monthNum;
      delete item.year;
    });

    res.status(200).json({
      success: true,
      data: {
        totalExpense: Math.round(totalExpense * 100) / 100,
        monthlyExpense: Math.round(monthlyExpense * 100) / 100,
        weeklyExpense: Math.round(weeklyExpense * 100) / 100,
        totalTransactions,
        recentTransactions,
        charts: {
          categoryData: categoryAgg,
          weeklyData: weeklyChartData,
          monthlyData: monthlyChartData
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
