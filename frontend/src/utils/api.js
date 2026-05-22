import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),
  login: (email, password) =>
    api.post("/auth/login", { email, password }),
};

export const tradeAPI = {
  addTrade: (symbol, tradeType, buyPrice, sellPrice, quantity, date) =>
    api.post("/trades", { symbol, tradeType, buyPrice, sellPrice, quantity, date }),
  getTrades: () => api.get("/trades"),
  deleteTrade: (id) => api.delete(`/trades/${id}`),
};

export const expenseAPI = {
  addExpense: (label, amount, type, date) =>
    api.post("/expenses", { label, amount, type, date }),
  getExpenses: () => api.get("/expenses"),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};