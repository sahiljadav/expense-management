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
      include: { SubCategories: true },
      orderBy: { Sequence: 'asc' }
    });
    const formattedCategories = categories.map(c => ({
      ...c,
      id: c.CategoryID.toString(),
      name: c.CategoryName,
      subcategories: c.SubCategories?.map(s => ({
        ...s,
        id: s.SubCategoryID.toString(),
        name: s.SubCategoryName,
        categoryId: s.CategoryID.toString()
      })) || []
    }));
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await prisma.category.update({
      where: { CategoryID: parseInt(id) },
      data
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.update({
      where: { CategoryID: parseInt(id) },
      data: { IsActive: false }
    });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
