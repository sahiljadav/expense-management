const prisma = require('../prismaClient');

const createSubCategory = async (req, res) => {
  try {
    const { CategoryID, SubCategoryName, LogoPath, IsExpense, IsIncome, Description, Sequence } = req.body;
    const subCategory = await prisma.subCategory.create({
      data: {
        CategoryID: parseInt(CategoryID),
        SubCategoryName,
        LogoPath,
        IsExpense,
        IsIncome,
        Description,
        Sequence: Sequence ? parseFloat(Sequence) : null,
        UserID: req.user.id
      }
    });
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating subcategory", error: error.message });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const where = { IsActive: true };
    if (categoryId) where.CategoryID = parseInt(categoryId);

    const subCategories = await prisma.subCategory.findMany({
      where,
      orderBy: { Sequence: 'asc' }
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const subCategory = await prisma.subCategory.update({
      where: { SubCategoryID: parseInt(id) },
      data
    });
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating subcategory", error: error.message });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.subCategory.update({
      where: { SubCategoryID: parseInt(id) },
      data: { IsActive: false }
    });
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subcategory", error: error.message });
  }
};

module.exports = { createSubCategory, getSubCategories, updateSubCategory, deleteSubCategory };
