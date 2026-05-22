const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addExpense = async (req, res) => {
  try {
    const { label, amount, type, date } = req.body;
    const userId = req.userId;

    const expense = await prisma.expense.create({
      data: {
        label,
        amount,
        type,
        date: new Date(date),
        userId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.userId;

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense || expense.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addExpense, getExpenses, deleteExpense };