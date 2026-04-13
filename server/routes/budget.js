const express = require("express");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ==========================
SET CATEGORY BUDGET
========================== */

router.post("/set-budget", authMiddleware, async (req, res) => {
    try {

        const { category, limit } = req.body;

        const budget = await Budget.findOneAndUpdate(
            {
                userId: req.userId,
                category
            },
            {
                limit
            },
            {
                new: true,
                upsert: true
            }
        );

        res.json({
            message: "Budget saved",
            budget
        });

    } catch (err) {

        res.status(500).json({
            error: "Failed to save budget"
        });

    }
});


/* ==========================
CATEGORY BUDGET USAGE
========================== */

router.get("/usage/:category", authMiddleware, async (req, res) => {
    try {

        const category = req.params.category;

        const user = await User.findById(req.userId);

        const budget = await Budget.findOne({
            userId: req.userId,
            category
        });

        if (!budget) {
            return res.json({
                category,
                limit: 0,
                spent: 0,
                percentage: 0
            });
        }

        const data = await Transaction.aggregate([
            {
                $match: {
                    senderMobile: String(user.mobile),
                    type: "debit",
                    category,
                    status: "success"
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const spent = data[0]?.total || 0;

        const percentage = ((spent / budget.limit) * 100).toFixed(2);

        res.json({
            category,
            limit: budget.limit,
            spent,
            percentage
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to calculate category usage"
        });

    }
});

module.exports = router;