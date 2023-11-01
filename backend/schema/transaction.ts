import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accounts'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    time: { type: Date, default: Date.now },
    description:String,
    transactionPrize:Number,
    isDeposit:Boolean,
})

export default mongoose.model('Transactions', transactionSchema);