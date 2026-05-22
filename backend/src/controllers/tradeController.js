const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addTrade = async (req, res) => {
  try {
    const { symbol, tradeType, buyPrice, sellPrice, quantity, date } = req.body;
    const userId = req.userId;

    const pnl = (sellPrice - buyPrice) * quantity;

    const trade = await prisma.trade.create({
      data: {
        symbol,
        tradeType,
        buyPrice,
        sellPrice,
        quantity,
        pnl,
        date: new Date(date),
        userId,
      },
    });

    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTrades = async (req, res) => {
  try {
    const userId = req.userId;

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTrade = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const trade = await prisma.trade.findUnique({
      where: { id: parseInt(id) },
    });

    if (!trade || trade.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.trade.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Trade deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addTrade, getTrades, deleteTrade };