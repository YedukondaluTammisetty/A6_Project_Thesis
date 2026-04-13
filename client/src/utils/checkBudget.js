import axios from "axios";
import { speakAlert } from "./voiceAlert";

export const checkBudget = async (category, token) => {

    try {

        const res = await axios.get(
            `/api/budget/usage/${category}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const percentage = Number(res.data.percentage);

        const now = new Date();
        const monthKey = `${now.getFullYear()}_${now.getMonth()}`;

        const alert50Key = `alert50_${category}_${monthKey}`;
        const alert80Key = `alert80_${category}_${monthKey}`;
        const alert100Key = `alert100_${category}_${monthKey}`;
        const alert120Key = `alert120_${category}_${monthKey}`;

        const alert50 = localStorage.getItem(alert50Key);
        const alert80 = localStorage.getItem(alert80Key);
        const alert100 = localStorage.getItem(alert100Key);
        const alert120 = localStorage.getItem(alert120Key);

        /* =========================
           50% BUDGET USED
        ========================== */
        if (percentage >= 50 && percentage < 80 && !alert50) {

            speakAlert(`You used 50 percent of your ${category} budget`);
            localStorage.setItem(alert50Key, "true");

        }

        /* =========================
           80% WARNING
        ========================== */
        else if (percentage >= 80 && percentage < 100 && !alert80) {

            speakAlert(`Warning. You used 80 percent of your ${category} budget`);
            localStorage.setItem(alert80Key, "true");

        }

        /* =========================
           100% LIMIT REACHED
        ========================== */
        else if (percentage >= 100 && percentage < 120 && !alert100) {

            speakAlert(`You reached your ${category} budget limit`);
            localStorage.setItem(alert100Key, "true");

        }

        /* =========================
           120% LIMIT EXCEEDED
        ========================== */
        else if (percentage >= 120 && !alert120) {

            speakAlert(`Alert. You crossed your ${category} spending limit`);
            localStorage.setItem(alert120Key, "true");

        }

    } catch (err) {

        console.log("Budget check failed");

    }

};