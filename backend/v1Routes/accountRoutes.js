const express = require('express');
const z = require('zod');

const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/balance', authMiddleware, (req, res) => {
    const account = Account.findOne({ userId: req.userId });
    return res.status(200).json({
        balance: account.balance
    })
})

const transferSchema = z.object({
    to: String,
    amount: String
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const { success } = transferSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const account = await Account.findOne({ userId: req.userId }).session(session);
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance",
        });
    }

    const toAccount = await Account.findOne({ userId: req.to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Account not found",
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: req.body.to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    return res.status(200).json({
        message: "Transfer successful",
    })
})

module.exports = router;