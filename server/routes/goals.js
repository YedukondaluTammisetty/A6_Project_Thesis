const express = require("express");
const Goal = require("../models/Goal");
const Income = require("../models/Income");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
GET GOAL
===================================================== */

router.get("/", authMiddleware, async (req, res) => {

    let goal = await Goal.findOne({ userId: req.userId });

    if (!goal) {

        goal = new Goal({
            userId: req.userId,
            targetAmount: 10000,
            savedAmount: 0,
            lastTransferMonth: 0
        });

        await goal.save();

    }

    res.json(goal);

});


/* =====================================================
SET GOAL TARGET
===================================================== */

router.post("/set", authMiddleware, async (req, res) => {

    try {

        const { targetAmount } = req.body;

        let goal = await Goal.findOne({ userId: req.userId });

        if (!goal) {

            goal = new Goal({
                userId: req.userId
            });

        }

        goal.targetAmount = targetAmount;

        await goal.save();

        res.json({ message: "Goal updated", goal });

    } catch (err) {

        res.status(500).json({
            error: "Failed to update goal"
        });

    }

});


/* =====================================================
AUTO TRANSFER MONTHLY SAVINGS → GOAL
===================================================== */

router.post("/auto-transfer", authMiddleware, async (req, res) => {

    try {

        const now = new Date();

        const currentMonth = now.getMonth() + 1;
        const year = now.getFullYear();

        let goal = await Goal.findOne({ userId: req.userId });

        if (!goal) {

            goal = new Goal({
                userId: req.userId
            });

            await goal.save();

        }

        /* ALREADY TRANSFERRED THIS MONTH */

        if (goal.lastTransferMonth === currentMonth) {

            return res.json({
                message: "Already transferred"
            });

        }

        /* LAST MONTH CALCULATION */

        const lastMonthDate = new Date(year, currentMonth - 2, 1);

        const month = lastMonthDate.getMonth() + 1;

        const income = await Income.findOne({
            userId: req.userId,
            month,
            year
        });

        const expense = await Transaction.aggregate([
            {
                $match: {
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

        if (savings > 0) {

            goal.savedAmount += savings;

        }

        goal.lastTransferMonth = currentMonth;

        await goal.save();

        res.json({
            message: "Savings transferred",
            savings
        });

    } catch (err) {

        res.status(500).json({
            error: "Auto transfer failed"
        });

    }

});

module.exports = router;