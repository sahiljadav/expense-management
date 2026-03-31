const prisma = require('../prismaClient');

const createExpense = async (req, res) => {
  try {
    const { ExpenseDate, CategoryID, SubCategoryID, ProjectID, Amount, ExpenseDetail, AttachmentPath, Description, PeopleID } = req.body;
    
    let assignedPeopleID;
    let assignedUserID;

    if (req.user.role === 'admin') {
      assignedPeopleID = PeopleID ? parseInt(PeopleID) : null;
      assignedUserID = parseInt(req.user.id);
    } else {
      // Regular user — req.user.id is PeopleID (integer stored in JWT as string)
      const peopleId = parseInt(req.user.id);
      assignedPeopleID = peopleId;
      // Fetch the admin UserID associated with this person
      const person = await prisma.people.findUnique({
        where: { PeopleID: peopleId },
        select: { UserID: true }
      });
      if (!person) return res.status(404).json({ message: "User profile not found" });
      assignedUserID = person.UserID;
    }

    const newExpense = await prisma.expense.create({
      data: {
        ExpenseDate: new Date(ExpenseDate),
        CategoryID: CategoryID ? parseInt(CategoryID) : null,
        SubCategoryID: SubCategoryID ? parseInt(SubCategoryID) : null,
        PeopleID: assignedPeopleID,
        ProjectID: ProjectID ? parseInt(ProjectID) : null,
        Amount: parseFloat(Amount),
        ExpenseDetail,
        AttachmentPath,
        Description,
        UserID: assignedUserID
      }
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Create Expense Error:", error);
    res.status(500).json({ message: "Error creating expense", error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: req.user.role === 'admin' ? {} : { PeopleID: parseInt(req.user.id) },
      include: {
        Category: true,
        Project: true,
        People: true,
        SubCategory: true
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
    const whereClause = req.user.role === 'admin' ? {} : { PeopleID: parseInt(req.user.id) };
    
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

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { ExpenseDate, CategoryID, SubCategoryID, ProjectID, Amount, ExpenseDetail, AttachmentPath, Description, PeopleID } = req.body;
    
    const data = {};
    if (ExpenseDate) data.ExpenseDate = new Date(ExpenseDate);
    if (CategoryID) data.CategoryID = parseInt(CategoryID);
    if (SubCategoryID) data.SubCategoryID = parseInt(SubCategoryID);
    if (ProjectID) data.ProjectID = parseInt(ProjectID);
    if (Amount) data.Amount = parseFloat(Amount);
    if (ExpenseDetail) data.ExpenseDetail = ExpenseDetail;
    if (AttachmentPath) data.AttachmentPath = AttachmentPath;
    if (Description) data.Description = Description;

    if (req.user.role === 'user') {
      // Ensure users can only update their own expenses
      const existing = await prisma.expense.findUnique({ where: { ExpenseID: parseInt(id) } });
      if (!existing || existing.PeopleID !== parseInt(req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    } else if (PeopleID) {
      data.PeopleID = parseInt(PeopleID);
    }

    const updatedExpense = await prisma.expense.update({
      where: { ExpenseID: parseInt(id) },
      data
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ message: "Error updating expense", error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.expense.delete({
      where: { ExpenseID: parseInt(id) }
    });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const whereClause = req.user.role === 'admin' ? {} : { PeopleID: parseInt(req.user.id) };
    
    const [expenses, incomes] = await Promise.all([
      prisma.expense.findMany({
        where: whereClause,
        include: { Category: true, Project: true, People: true, SubCategory: true },
        orderBy: { ExpenseDate: 'desc' }
      }),
      prisma.income.findMany({
        where: whereClause,
        include: { Category: true, Project: true, People: true, SubCategory: true },
        orderBy: { IncomeDate: 'desc' }
      })
    ]);

    const formattedExpenses = expenses.map(e => ({
      ...e,
      id: `e-${e.ExpenseID}`,
      type: 'expense',
      date: e.ExpenseDate,
      amount: parseFloat(e.Amount),
      categoryName: e.Category?.CategoryName || 'Uncategorized',
      categoryId: e.CategoryID,
      subCategoryName: e.SubCategory?.SubCategoryName || null,
      subCategoryId: e.SubCategoryID,
      projectName: e.Project?.ProjectName || 'No Project',
      projectId: e.ProjectID,
      peopleName: e.People?.PeopleName || 'Unknown',
      peopleId: e.PeopleID,
      detail: e.ExpenseDetail,
      remarks: e.Description
    }));

    const formattedIncomes = incomes.map(i => ({
      ...i,
      id: `i-${i.IncomeID}`,
      type: 'income',
      date: i.IncomeDate,
      amount: parseFloat(i.Amount),
      categoryName: i.Category?.CategoryName || 'Uncategorized',
      categoryId: i.CategoryID,
      subCategoryName: i.SubCategory?.SubCategoryName || null,
      subCategoryId: i.SubCategoryID,
      projectName: i.Project?.ProjectName || 'No Project',
      projectId: i.ProjectID,
      peopleName: i.People?.PeopleName || 'Unknown',
      peopleId: i.PeopleID,
      detail: i.IncomeDetail,
      remarks: i.Description
    }));

    const allTransactions = [...formattedExpenses, ...formattedIncomes].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.json(allTransactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

module.exports = { createExpense, getExpenses, getDashboardSummary, updateExpense, deleteExpense, getAllTransactions };
