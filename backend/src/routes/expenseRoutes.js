const express = require("express");
const { addExpense, getExpenses, deleteExpense } = require("../controllers/expenseController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addExpense);
router.get("/", verifyToken, getExpenses);
router.delete("/:id", verifyToken, deleteExpense);

module.exports = router;