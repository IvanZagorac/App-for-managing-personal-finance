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
    transactionPrize:{
        type: mongoose.Types.Decimal128,
        get:getTrPrize
    },
    isDeposit:Boolean,
},{toJSON:{getters:true}})

function getTrPrize(value) 
{
    if (typeof value !== 'undefined') 
    {
        return parseFloat(value.toString());
    }
    return value;
};


export default mongoose.model('Transactions', transactionSchema);