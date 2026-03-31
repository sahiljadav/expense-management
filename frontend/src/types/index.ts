export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  isActive: boolean;
  profileImage?: string;
  created: string;
}

export interface Project {
  id: string;
  name: string;
  detail: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  isExpense: boolean;
  isIncome: boolean;
  isActive: boolean;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  isExpense: boolean;
  isIncome: boolean;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  type: "expense" | "income";
  categoryId: string | number;
  categoryName: string;
  subCategoryId?: string | number | null;
  subCategoryName?: string | null;
  projectId?: string | number | null;
  projectName: string;
  peopleId?: string | number | null;
  peopleName: string;
  amount: number;
  detail: string;
  remarks?: string;
  attachment?: string;
}
