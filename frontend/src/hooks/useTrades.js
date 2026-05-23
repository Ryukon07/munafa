import { useState, useEffect } from "react";
import { tradeAPI } from "../utils/api";

export const useTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tradeAPI.getTrades();
      setTrades(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch trades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const addTrade = async (symbol, tradeType, buyPrice, sellPrice, quantity, date) => {
    try {
      const response = await tradeAPI.addTrade(symbol, tradeType, buyPrice, sellPrice, quantity, date);
      setTrades((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add trade");
      throw err;
    }
  };

  const deleteTrade = async (id) => {
    try {
      await tradeAPI.deleteTrade(id);
      setTrades((prev) => prev.filter((trade) => trade.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete trade");
      throw err;
    }
  };

  return { trades, loading, error, addTrade, deleteTrade, fetchTrades };
};