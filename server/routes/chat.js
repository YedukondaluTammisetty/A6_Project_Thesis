const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

/* ============================
   MONTH HELPER
============================ */
function getMonthIndex(text) {
    const months = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
    ];

    for (let i = 0; i < months.length; i++) {
        if (
            text.includes(months[i]) ||
            text.includes(months[i].slice(0, 3))
        ) {
            return i;
        }
    }
    return null;
}

/* ============================
   INTENT DETECTOR (FIXED ORDER)
============================ */
function detectIntent(message) {
    const text = message.toLowerCase().trim();
    const monthIndex = getMonthIndex(text);

    // 🔥 IMPORTANT: If month name exists, always month specific
    if (monthIndex !== null) {
        return "MONTH_SPECIFIC";
    }

    if (text.includes("hi") || text.includes("hello"))
        return "GREETING";

    if (text.includes("compare") || text.includes("last month"))
        return "MONTHLY_COMPARISON";

    if (text.includes("ratio"))
        return "INCOME_EXPENSE_RATIO";

    if (text.includes("reduce") || text.includes("high"))
        return "REDUCE_SPENDING";

    if (text.includes("save") || text.includes("improve"))
        return "SAVINGS_ADVICE";

    if (text.includes("food"))
        return "FOOD_EXPENSE";

    if (text.includes("travel"))
        return "TRAVEL_EXPENSE";

    if (text.includes("total") || text.includes("spending"))
        return "THIS_MONTH_TOTAL";

    return "UNKNOWN";
}

/* ============================
   ROUTE
============================ */
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        const text = message.toLowerCase();

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({ error: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id || decoded.userId || decoded._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const userMobile = user.mobile;

        const allTransactions = await Transaction.find({
            senderMobile: userMobile,
            status: "success"
        });

        const expenses = allTransactions.filter(t => t.type === "debit");
        const income = allTransactions.filter(t => t.type === "credit");

        const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
        const totalIncome = income.reduce((s, t) => s + t.amount, 0);

        const intent = detectIntent(message);

        let responseText =
            "I didn’t fully understand that 🤔\nTry asking about spending, savings, or monthly insights.";

        /* ================= GREETING ================= */
        if (intent === "GREETING") {
            responseText =
                "Hey 👋 I’m your Smart Financial Assistant!\n\n" +
                "Try asking:\n" +
                "• This month spending\n" +
                "• February spending\n" +
                "• March month expense\n" +
                "• Compare last month\n" +
                "• How to improve savings";
        }

        /* ================= THIS MONTH TOTAL ================= */
        else if (intent === "THIS_MONTH_TOTAL") {

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const thisMonthExpense = expenses
                .filter(t => t.createdAt >= startOfMonth)
                .reduce((s, t) => s + t.amount, 0);

            responseText = `You have spent ₹${thisMonthExpense} so far this month 💸`;
        }

        /* ================= MONTH SPECIFIC ================= */
        else if (intent === "MONTH_SPECIFIC") {

            const monthIndex = getMonthIndex(text);

            if (monthIndex === null) {
                responseText = "Please mention a valid month like January, Feb, March etc.";
            } else {

                const year = new Date().getFullYear();
                const start = new Date(year, monthIndex, 1);
                const end = new Date(year, monthIndex + 1, 1);

                const monthExpense = expenses
                    .filter(t => t.createdAt >= start && t.createdAt < end)
                    .reduce((s, t) => s + t.amount, 0);

                const monthName = start.toLocaleString("default", { month: "long" });

                responseText =
                    `Your spending in ${monthName} is ₹${monthExpense} 💸`;
            }
        }

        /* ================= MONTHLY COMPARISON ================= */
        else if (intent === "MONTHLY_COMPARISON") {

            const now = new Date();
            const startThis = new Date(now.getFullYear(), now.getMonth(), 1);
            const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);

            const thisMonth = expenses
                .filter(t => t.createdAt >= startThis)
                .reduce((s, t) => s + t.amount, 0);

            const lastMonth = expenses
                .filter(t => t.createdAt >= startLast && t.createdAt < startThis)
                .reduce((s, t) => s + t.amount, 0);

            if (lastMonth === 0) {
                responseText = "No spending data from last month 📊";
            } else {
                const diff = thisMonth - lastMonth;
                const percent = ((diff / lastMonth) * 100).toFixed(1);

                responseText =
                    `This Month: ₹${thisMonth}\n` +
                    `Last Month: ₹${lastMonth}\n\n` +
                    `Spending changed by ${percent}% 📊`;
            }
        }

        /* ================= RATIO ================= */
        else if (intent === "INCOME_EXPENSE_RATIO") {

            if (totalIncome === 0) {
                responseText = "No income recorded yet.";
            } else {
                const ratio = ((totalExpense / totalIncome) * 100).toFixed(1);

                responseText =
                    `Expense to Income Ratio: ${ratio}%\n\n` +
                    (ratio > 70
                        ? "⚠ You're spending a large portion of income."
                        : "👍 Your spending ratio looks healthy.");
            }
        }

        /* ================= REDUCE SPENDING ================= */
        else if (intent === "REDUCE_SPENDING") {

            if (expenses.length === 0) {
                responseText = "No expense data available.";
            } else {

                const categoryTotals = {};

                expenses.forEach(tx => {
                    categoryTotals[tx.category] =
                        (categoryTotals[tx.category] || 0) + tx.amount;
                });

                const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
                    categoryTotals[a] > categoryTotals[b] ? a : b
                );

                responseText =
                    `Your highest spending is on ${topCategory}.\n\n` +
                    `💡 Try reducing it by 10-20%.\n` +
                    `📊 Set weekly limits.\n` +
                    `📅 Track daily expenses.\n\n` +
                    `Small changes = Big savings 💰`;
            }
        }

        /* ================= SAVINGS ================= */
        else if (intent === "SAVINGS_ADVICE") {

            const suggestedSavings = Math.round(totalIncome * 0.2);

            responseText =
                `To improve your savings:\n\n` +
                `💰 Aim to save at least ₹${suggestedSavings} per month.\n\n` +
                `Follow 50-30-20 rule:\n` +
                `50% Needs\n30% Wants\n20% Savings\n\n` +
                `Automate your savings 👍`;
        }

        res.json({ reply: responseText });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Chatbot server error" });
    }
});

module.exports = router;