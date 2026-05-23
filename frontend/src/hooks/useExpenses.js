import { useState, useEffect } from "react";
import { expenseAPI } from "../utils/api";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseAPI.getExpenses();
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (label, amount, type, date) => {
    try {
      const response = await expenseAPI.addExpense(label, amount, type, date);
      setExpenses((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add expense");
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseAPI.deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete expense");
      throw err;
    }
  };

  return { expenses, loading, error, addExpense, deleteExpense, fetchExpenses };
};