const prisma = require('../prismaClient');

const createIncome = async (req, res) => {
  try {
    const { IncomeDate, CategoryID, SubCategoryID, ProjectID, Amount, IncomeDetail, AttachmentPath, Description, PeopleID } = req.body;
    
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

    const newIncome = await prisma.income.create({
      data: {
        IncomeDate: new Date(IncomeDate),
        CategoryID: CategoryID ? parseInt(CategoryID) : null,
        SubCategoryID: SubCategoryID ? parseInt(SubCategoryID) : null,
        PeopleID: assignedPeopleID,
        ProjectID: ProjectID ? parseInt(ProjectID) : null,
        Amount: parseFloat(Amount),
        IncomeDetail,
        AttachmentPath,
        Description,
        UserID: assignedUserID
      }
    });

    res.status(201).json(newIncome);
  } catch (error) {
    console.error("Create Income Error:", error);
    res.status(500).json({ message: "Error creating income", error: error.message });
  }
};

const getIncomes = async (req, res) => {
  try {
    const incomes = await prisma.income.findMany({
      where: req.user.role === 'admin' ? {} : { PeopleID: parseInt(req.user.id) },
      include: {
        Category: true,
        Project: true,
        People: true,
      },
      orderBy: { IncomeDate: 'desc' }
    });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incomes", error: error.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { IncomeDate, CategoryID, SubCategoryID, ProjectID, Amount, IncomeDetail, AttachmentPath, Description, PeopleID } = req.body;
    
    const data = {};
    if (IncomeDate) data.IncomeDate = new Date(IncomeDate);
    if (CategoryID) data.CategoryID = parseInt(CategoryID);
    if (SubCategoryID) data.SubCategoryID = parseInt(SubCategoryID);
    if (ProjectID) data.ProjectID = parseInt(ProjectID);
    if (Amount) data.Amount = parseFloat(Amount);
    if (IncomeDetail) data.IncomeDetail = IncomeDetail;
    if (AttachmentPath) data.AttachmentPath = AttachmentPath;
    if (Description) data.Description = Description;

    if (req.user.role === 'user') {
      // Ensure users can only update their own incomes
      const existing = await prisma.income.findUnique({ where: { IncomeID: parseInt(id) } });
      if (!existing || existing.PeopleID !== parseInt(req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    } else if (PeopleID) {
      data.PeopleID = parseInt(PeopleID);
    }

    const income = await prisma.income.update({
      where: { IncomeID: parseInt(id) },
      data
    });
    res.json(income);
  } catch (error) {
    console.error("Update Income Error:", error);
    res.status(500).json({ message: "Error updating income", error: error.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.income.delete({
      where: { IncomeID: parseInt(id) }
    });
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error: error.message });
  }
};

module.exports = { createIncome, getIncomes, updateIncome, deleteIncome };
