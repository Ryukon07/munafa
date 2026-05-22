const express = require("express");
const { addTrade, getTrades, deleteTrade } = require("../controllers/tradeController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addTrade);
router.get("/", verifyToken, getTrades);
router.delete("/:id", verifyToken, deleteTrade);

module.exports = router;