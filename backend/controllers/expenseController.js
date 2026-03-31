const prisma = require('../prismaClient');

const createExpense = async (req, res) => {
  try {
    const { ExpenseDate, CategoryID, SubCategoryID, ProjectID, Amount, ExpenseDetail, AttachmentPath, Description } = req.body;
    
    const newExpense = await prisma.expense.create({
      data: {
        ExpenseDate: new Date(ExpenseDate),
        CategoryID: CategoryID ? parseInt(CategoryID) : null,
        SubCategoryID: SubCategoryID ? parseInt(SubCategoryID) : null,
        PeopleID: req.user.id, // from token
        ProjectID: ProjectID ? parseInt(ProjectID) : null,
        Amount: parseFloat(Amount),
        ExpenseDetail,
        AttachmentPath,
        Description,
        UserID: req.user.id // keeping UserID as whoever created it
      }
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: req.user.role === 'admin' ? {} : { PeopleID: req.user.id },
      include: {
        Category: true,
        Project: true,
        People: true,
      },
      orderBy: { ExpenseDate: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error: error.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const whereClause = req.user.role === 'admin' ? {} : { PeopleID: req.user.id };
    
    const totalExpenses = await prisma.expense.aggregate({
      where: whereClause,
      _sum: { Amount: true }
    });
    
    const totalIncomes = await prisma.income.aggregate({
      where: whereClause,
      _sum: { Amount: true }
    });

    res.json({
      totalExpenses: totalExpenses._sum.Amount || 0,
      totalIncomes: totalIncomes._sum.Amount || 0,
      balance: (totalIncomes._sum.Amount || 0) - (totalExpenses._sum.Amount || 0)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary", error: error.message });
  }
};

module.exports = { createExpense, getExpenses, getDashboardSummary };
