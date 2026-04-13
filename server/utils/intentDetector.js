/**
 * Rule-based Transaction Intent Detector
 * -------------------------------------
 * Input  : Natural language description
 * Output : { intent, confidence }
 * 
 * Design goals:
 * - Explainable
 * - Deterministic
 * - Safe fallback
 * - Easy to extend
 */

/* ======================
   INTENT RULE DEFINITIONS
====================== */
const INTENT_RULES = {
  food: {
    keywords: [
      "food",
      "dinner",
      "lunch",
      "breakfast",
      "snack",
      "restaurant",
      "hotel",
      "service",
      "zomato",
      "swiggy",
      "meal"
    ],
    baseConfidence: 0.75
  },

  rent: {
    keywords: [
      "rent",
      "room",
      "hostel",
      "lease",
      "pg"
    ],
    baseConfidence: 0.8
  },

  loan: {
    keywords: [
      "loan",
      "emi",
      "borrow",
      "repayment",
      "interest"
    ],
    baseConfidence: 0.85
  },

  shopping: {
    keywords: [
      "shopping",
      "order",
      "amazon",
      "flipkart",
      "mall",
      "purchase"
    ],
    baseConfidence: 0.7
  },

  bills: {
    keywords: [
      "electricity",
      "water",
      "gas",
      "wifi",
      "internet",
      "bill",
      "recharge"
    ],
    baseConfidence: 0.8
  },

  travel: {
    keywords: [
      "uber",
      "ola",
      "taxi",
      "bus",
      "train",
      "flight",
      "travel"
    ],
    baseConfidence: 0.75
  },

  refund: {
    keywords: [
      "refund",
      "returned",
      "reversal",
      "cashback"
    ],
    baseConfidence: 0.9
  }
};

/* ======================
   TEXT NORMALIZATION
====================== */
const normalize = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

/* ======================
   INTENT DETECTION LOGIC
====================== */
const detectIntent = (description = "") => {
  const text = normalize(description);

  // Safe fallback
  let bestMatch = {
    intent: "other",
    confidence: 0.3
  };

  if (!text) return bestMatch;

  for (const intent in INTENT_RULES) {
    const { keywords, baseConfidence } = INTENT_RULES[intent];

    let matchCount = 0;

    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        matchCount++;
      }
    });

    if (matchCount > 0) {
      // Confidence grows with number of matches
      const confidence = Math.min(
        baseConfidence + matchCount * 0.08,
        0.95
      );

      if (confidence > bestMatch.confidence) {
        bestMatch = { intent, confidence };
      }
    }
  }

  return bestMatch;
};

/* ======================
   EXPORT
====================== */
module.exports = detectIntent;
