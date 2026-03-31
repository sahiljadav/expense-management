const prisma = require('../prismaClient');

const createCategory = async (req, res) => {
  try {
    const { CategoryName, IsExpense, IsIncome, Description } = req.body;
    
    const newCategory = await prisma.category.create({
      data: {
        CategoryName,
        IsExpense,
        IsIncome,
        Description,
        UserID: req.user.id
      }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { IsActive: true },
      orderBy: { Sequence: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

module.exports = { createCategory, getCategories };
