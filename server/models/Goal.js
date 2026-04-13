const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    targetAmount: {
        type: Number,
        default: 10000
    },

    savedAmount: {
        type: Number,
        default: 0
    },

    /* ⭐ TRACK MONTHLY TRANSFER */
    lastTransferMonth: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model("Goal", goalSchema);