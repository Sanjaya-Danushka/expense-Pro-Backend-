const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    transaction_type: {
        type: String,
        required: true,
        enum: ["income", "expense"]
    }

}, { timestamps: true });

const transactionmodel = mongoose.model("transaction", transactionSchema);

module.exports = transactionmodel;
