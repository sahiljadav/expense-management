import { User, Project, Category, Transaction } from "@/types";

export const mockUsers: User[] = [
  { id: "1", name: "Arjun Mehta", email: "arjun@company.com", mobile: "9876543210", role: "admin", isActive: true, created: "2024-01-15" },
  { id: "2", name: "Priya Sharma", email: "priya@company.com", mobile: "9876543211", role: "user", isActive: true, created: "2024-02-20" },
  { id: "3", name: "Rahul Verma", email: "rahul@company.com", mobile: "9876543212", role: "user", isActive: true, created: "2024-03-10" },
  { id: "4", name: "Sneha Patel", email: "sneha@company.com", mobile: "9876543213", role: "user", isActive: false, created: "2024-04-05" },
  { id: "5", name: "Vikram Singh", email: "vikram@company.com", mobile: "9876543214", role: "user", isActive: true, created: "2024-05-12" },
];

export const mockProjects: Project[] = [
  { id: "1", name: "Website Redesign", detail: "Complete overhaul of corporate website", budget: 250000, spent: 187500, startDate: "2024-01-01", endDate: "2024-06-30", isActive: true },
  { id: "2", name: "Mobile App v2", detail: "Next generation mobile application", budget: 400000, spent: 120000, startDate: "2024-03-01", endDate: "2024-12-31", isActive: true },
  { id: "3", name: "Cloud Migration", detail: "Move infrastructure to cloud", budget: 180000, spent: 162000, startDate: "2024-02-15", endDate: "2024-08-15", isActive: true },
  { id: "4", name: "ERP Integration", detail: "Integrate third-party ERP system", budget: 320000, spent: 48000, startDate: "2024-06-01", endDate: "2025-03-31", isActive: true },
];

export const mockCategories: Category[] = [
  { id: "1", name: "Travel", isExpense: true, isIncome: false, isActive: true, subcategories: [
    { id: "s1", categoryId: "1", name: "Taxi", isExpense: true, isIncome: false, isActive: true },
    { id: "s2", categoryId: "1", name: "Train", isExpense: true, isIncome: false, isActive: true },
    { id: "s3", categoryId: "1", name: "Flight", isExpense: true, isIncome: false, isActive: true },
    { id: "s4", categoryId: "1", name: "Fuel", isExpense: true, isIncome: false, isActive: true },
  ]},
  { id: "2", name: "Food & Dining", isExpense: true, isIncome: false, isActive: true, subcategories: [
    { id: "s5", categoryId: "2", name: "Team Lunch", isExpense: true, isIncome: false, isActive: true },
    { id: "s6", categoryId: "2", name: "Client Dinner", isExpense: true, isIncome: false, isActive: true },
  ]},
  { id: "3", name: "Office Supplies", isExpense: true, isIncome: false, isActive: true, subcategories: [
    { id: "s7", categoryId: "3", name: "Stationery", isExpense: true, isIncome: false, isActive: true },
    { id: "s8", categoryId: "3", name: "Electronics", isExpense: true, isIncome: false, isActive: true },
  ]},
  { id: "4", name: "Accommodation", isExpense: true, isIncome: false, isActive: true, subcategories: [
    { id: "s9", categoryId: "4", name: "Hotel", isExpense: true, isIncome: false, isActive: true },
    { id: "s10", categoryId: "4", name: "Hostel", isExpense: true, isIncome: false, isActive: true },
  ]},
  { id: "5", name: "Client Payment", isExpense: false, isIncome: true, isActive: true, subcategories: [
    { id: "s11", categoryId: "5", name: "Milestone Payment", isExpense: false, isIncome: true, isActive: true },
    { id: "s12", categoryId: "5", name: "Retainer", isExpense: false, isIncome: true, isActive: true },
  ]},
];

export const mockTransactions: Transaction[] = [
  { id: "1", date: "2024-03-15", type: "expense", categoryId: "1", categoryName: "Travel", subCategoryName: "Taxi", projectName: "Website Redesign", peopleName: "Priya Sharma", amount: 1250, detail: "Client site visit" },
  { id: "2", date: "2024-03-14", type: "expense", categoryId: "2", categoryName: "Food & Dining", subCategoryName: "Team Lunch", projectName: "Mobile App v2", peopleName: "Rahul Verma", amount: 3400, detail: "Sprint retrospective lunch" },
  { id: "3", date: "2024-03-13", type: "income", categoryId: "5", categoryName: "Client Payment", subCategoryName: "Milestone Payment", projectName: "Cloud Migration", peopleName: "Arjun Mehta", amount: 75000, detail: "Phase 2 completion" },
  { id: "4", date: "2024-03-12", type: "expense", categoryId: "3", categoryName: "Office Supplies", subCategoryName: "Electronics", projectName: "ERP Integration", peopleName: "Vikram Singh", amount: 15800, detail: "New keyboard and monitors" },
  { id: "5", date: "2024-03-11", type: "expense", categoryId: "4", categoryName: "Accommodation", subCategoryName: "Hotel", projectName: "Website Redesign", peopleName: "Priya Sharma", amount: 4500, detail: "2-night stay for workshop" },
  { id: "6", date: "2024-03-10", type: "expense", categoryId: "1", categoryName: "Travel", subCategoryName: "Flight", projectName: "Cloud Migration", peopleName: "Arjun Mehta", amount: 8700, detail: "Mumbai to Delhi roundtrip" },
  { id: "7", date: "2024-03-09", type: "income", categoryId: "5", categoryName: "Client Payment", subCategoryName: "Retainer", projectName: "Mobile App v2", peopleName: "Arjun Mehta", amount: 50000, detail: "Monthly retainer" },
  { id: "8", date: "2024-03-08", type: "expense", categoryId: "2", categoryName: "Food & Dining", subCategoryName: "Client Dinner", projectName: "ERP Integration", peopleName: "Sneha Patel", amount: 6200, detail: "Stakeholder dinner meeting" },
  { id: "9", date: "2024-03-07", type: "expense", categoryId: "1", categoryName: "Travel", subCategoryName: "Fuel", projectName: "Website Redesign", peopleName: "Vikram Singh", amount: 2100, detail: "Site survey trip" },
  { id: "10", date: "2024-03-06", type: "income", categoryId: "5", categoryName: "Client Payment", subCategoryName: "Milestone Payment", projectName: "Website Redesign", peopleName: "Arjun Mehta", amount: 120000, detail: "Design phase completion" },
];
