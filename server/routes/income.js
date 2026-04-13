const express = require("express");
const Income = require("../models/Income");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
SET MONTHLY INCOME
========================= */

router.post("/set", authMiddleware, async (req, res) => {

    try {

        const { amount } = req.body;

        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        let income = await Income.findOne({
            userId: req.userId,
            month,
            year
        });

        if (income) {

            income.amount = amount;

        } else {

            income = new Income({
                userId: req.userId,
                amount,
                month,
                year
            });

        }

        await income.save();

        res.json({
            message: "Income saved",
            amount
        });

    } catch (err) {

        res.status(500).json({
            error: "Failed to save income"
        });

    }

});

/* =========================
GET CURRENT MONTH INCOME
========================= */

router.get("/current-month", authMiddleware, async (req, res) => {

    try {

        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const income = await Income.findOne({
            userId: req.userId,
            month,
            year
        });

        res.json({
            amount: income?.amount || 0
        });

    } catch (err) {

        res.status(500).json({
            error: "Failed to load income"
        });

    }

});

/* =========================
LAST 4 MONTHS SAVINGS
========================= */

router.get("/monthly-savings", authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.userId);
        const mobile = String(user.mobile);

        const now = new Date();
        const results = [];

        for (let i = 3; i >= 0; i--) {

            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

            const month = d.getMonth() + 1;
            const year = d.getFullYear();

            const income = await Income.findOne({
                userId: req.userId,
                month,
                year
            });

            const expense = await Transaction.aggregate([
                {
                    $match: {
                        senderMobile: mobile,   // ⭐ IMPORTANT FIX
                        type: "debit",
                        status: "success",
                        createdAt: {
                            $gte: new Date(year, month - 1, 1),
                            $lt: new Date(year, month, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const incomeAmount = income?.amount || 0;
            const expenseAmount = expense[0]?.total || 0;

            const savings = incomeAmount - expenseAmount;

            results.push(savings > 0 ? savings : 0);

        }

        res.json(results);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to load savings"
        });

    }

});

module.exports = router;