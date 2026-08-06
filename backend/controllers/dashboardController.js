const Expense = require('../models/Expense');

// @desc    Get dashboard metrics and aggregated chart data for logged-in user
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // 1. Today's Expenses for this user
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const todayAgg = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfToday, $lte: endOfToday }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const todayExpense = todayAgg.length > 0 ? todayAgg[0].total : 0;

    // 2. Total Expenses for this user
    const totalAgg = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpense = totalAgg.length > 0 ? totalAgg[0].total : 0;

    // 2. Monthly Expenses (Current Month) for this user
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const monthlyAgg = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyExpense = monthlyAgg.length > 0 ? monthlyAgg[0].total : 0;

    // 3. Weekly Expenses (Current Week - Starting Sunday) for this user
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyAgg = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const weeklyExpense = weeklyAgg.length > 0 ? weeklyAgg[0].total : 0;

    // 4. Total Transactions count for this user
    const totalTransactions = await Expense.countDocuments({ user: userId });

    // 5. Recent 5 Transactions for this user
    const recentTransactions = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    // 6. Category Breakdown Aggregation (for Pie Chart) for this user
    const categoryAgg = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      },
      { $project: { name: '$_id', value: { $round: ['$amount', 2] }, _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    // 7. Weekly Expense aggregation by day of week (for Line Chart) for this user
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyChartData = daysOfWeek.map((day) => {
      return { name: day, amount: 0 };
    });

    const weeklyExpensesList = await Expense.find({
      user: userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    weeklyExpensesList.forEach(exp => {
      const expDate = new Date(exp.date);
      const dayIndex = expDate.getDay();
      weeklyChartData[dayIndex].amount += exp.amount;
    });

    weeklyChartData.forEach(item => {
      item.amount = Math.round(item.amount * 100) / 100;
    });

    // 8. Monthly Expense aggregation (for Bar Chart) for this user
    const monthlyChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const yearLabel = d.getFullYear();
      monthlyChartData.push({
        name: `${monthLabel} ${yearLabel}`,
        amount: 0,
        year: yearLabel,
        monthNum: d.getMonth()
      });
    }

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const sixMonthsExpenses = await Expense.find({
      user: userId,
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

    monthlyChartData.forEach(item => {
      item.amount = Math.round(item.amount * 100) / 100;
      delete item.monthNum;
      delete item.year;
    });

    res.status(200).json({
      success: true,
      data: {
        todayExpense: Math.round(todayExpense * 100) / 100,
        weeklyExpense: Math.round(weeklyExpense * 100) / 100,
        monthlyExpense: Math.round(monthlyExpense * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
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
