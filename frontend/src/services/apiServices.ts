import api from '../lib/api';

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const subCategoryService = {
  getAll: async (categoryId?: number | string) => {
    const response = await api.get('/subcategories', { params: { categoryId } });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/subcategories', data);
    return response.data;
  },
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/subcategories/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/subcategories/${id}`);
    return response.data;
  },
};

export const peopleService = {
  getAll: async () => {
    const response = await api.get('/people');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/people', data);
    return response.data;
  },
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/people/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/people/${id}`);
    return response.data;
  },
};

export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export const expenseService = {
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
  getSummary: async () => {
    const response = await api.get('/expenses/summary');
    return response.data;
  },
  getAllTransactions: async () => {
    const response = await api.get('/expenses/all');
    return response.data;
  },
};

export const incomeService = {
  getAll: async () => {
    const response = await api.get('/incomes');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/incomes', data);
    return response.data;
  },
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/incomes/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/incomes/${id}`);
    return response.data;
  },
};
export const adminService = {
  getSummary: async () => {
    const response = await api.get('/admin/summary');
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  },
  // Add other admin specific methods if needed
};

export const userService = {
  getSummary: async () => {
    const response = await api.get('/user/summary');
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/user/transactions');
    return response.data;
  },
  createExpense: async (data: any) => {
    const response = await api.post('/user/expenses', data);
    return response.data;
  },
  updateExpense: async (id: string | number, data: any) => {
    const response = await api.put(`/user/expenses/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id: string | number) => {
    const response = await api.delete(`/user/expenses/${id}`);
    return response.data;
  },
  createIncome: async (data: any) => {
    const response = await api.post('/user/incomes', data);
    return response.data;
  },
  updateIncome: async (id: string | number, data: any) => {
    const response = await api.put(`/user/incomes/${id}`, data);
    return response.data;
  },
  deleteIncome: async (id: string | number) => {
    const response = await api.delete(`/user/incomes/${id}`);
    return response.data;
  },
};
