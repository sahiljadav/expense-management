const prisma = require('../prismaClient.js');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Start seeding...');

  try {
    // Clean existing data (Optional, handle with care in production)
    await prisma.expense.deleteMany();
    await prisma.income.deleteMany();
    await prisma.subCategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.project.deleteMany();
    await prisma.people.deleteMany();
    await prisma.user.deleteMany(); 

    console.log('Cleared existing data.');

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        UserName: 'Admin User',
        EmailAddress: 'admin@expensemanager.com',
        Password: hashedPassword,
        MobileNo: '1234567890',
      },
    });
    console.log(`Created admin user: ${adminUser.EmailAddress}`);

    // 2. Create People
    const employeePassword = await bcrypt.hash('password123', 10);
    const person1 = await prisma.people.create({
      data: {
        PeopleCode: 'EMP001',
        Password: employeePassword,
        PeopleName: 'John Doe',
        Email: 'john.doe@expensemanager.com',
        MobileNo: '9876543210',
        Description: 'Software Engineer',
        UserID: adminUser.UserID,
      },
    });
    const person2 = await prisma.people.create({
      data: {
        PeopleCode: 'EMP002',
        Password: employeePassword,
        PeopleName: 'Jane Smith',
        Email: 'jane.smith@expensemanager.com',
        MobileNo: '9876543211',
        Description: 'Marketing Manager',
        UserID: adminUser.UserID,
      },
    });
    console.log(`Created people: ${person1.PeopleName}, ${person2.PeopleName}`);

    // 3. Create Categories
    const catExpense = await prisma.category.create({
      data: {
        CategoryName: 'Office Supplies',
        IsExpense: true,
        IsIncome: false,
        Description: 'General office supplies and stationery',
        UserID: adminUser.UserID,
      },
    });
    const catTravel = await prisma.category.create({
      data: {
        CategoryName: 'Travel',
        IsExpense: true,
        IsIncome: false,
        Description: 'Business travel and accommodations',
        UserID: adminUser.UserID,
      },
    });
    const catIncome = await prisma.category.create({
      data: {
        CategoryName: 'Client Services',
        IsExpense: false,
        IsIncome: true,
        Description: 'Revenue from consulting and services',
        UserID: adminUser.UserID,
      },
    });
    console.log('Created categories.');

    // 4. Create SubCategories
    const subCatStationery = await prisma.subCategory.create({
      data: {
        CategoryID: catExpense.CategoryID,
        SubCategoryName: 'Stationery',
        IsExpense: true,
        IsIncome: false,
        UserID: adminUser.UserID,
      },
    });
    const subCatFlights = await prisma.subCategory.create({
      data: {
        CategoryID: catTravel.CategoryID,
        SubCategoryName: 'Flights',
        IsExpense: true,
        IsIncome: false,
        UserID: adminUser.UserID,
      },
    });
    console.log('Created subcategories.');

    // 5. Create Projects
    const project1 = await prisma.project.create({
      data: {
        ProjectName: 'Website Redesign 2026',
        ProjectDetail: 'Overhaul of company main website',
        UserID: adminUser.UserID,
        ProjectStartDate: new Date('2026-01-01'),
        ProjectEndDate: new Date('2026-06-30'),
      },
    });
    console.log(`Created project: ${project1.ProjectName}`);

    // 6. Create Expenses
    await prisma.expense.create({
      data: {
        ExpenseDate: new Date(),
        CategoryID: catExpense.CategoryID,
        SubCategoryID: subCatStationery.SubCategoryID,
        PeopleID: person1.PeopleID,
        ProjectID: project1.ProjectID,
        Amount: 1500.50,
        ExpenseDetail: 'Purchased notebooks and pens',
        UserID: adminUser.UserID,
      },
    });
    await prisma.expense.create({
      data: {
        ExpenseDate: new Date(),
        CategoryID: catTravel.CategoryID,
        SubCategoryID: subCatFlights.SubCategoryID,
        PeopleID: person2.PeopleID,
        Amount: 25000.00,
        ExpenseDetail: 'Flight to tech conference',
        UserID: adminUser.UserID,
      },
    });
    console.log('Created sample expenses.');

    // 7. Create Incomes
    await prisma.income.create({
      data: {
        IncomeDate: new Date(),
        CategoryID: catIncome.CategoryID,
        PeopleID: person2.PeopleID,
        ProjectID: project1.ProjectID,
        Amount: 50000.00,
        IncomeDetail: 'Payment milestone 1 received',
        UserID: adminUser.UserID,
      },
    });
    console.log('Created sample incomes.');

    console.log('Seeding finished successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
