import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
    },
    totalAmount:{
        type: mongoose.Types.Decimal128,
        get:getTotalAmount
    },
},{toJSON:{getters:true}})

function getTotalAmount(value) 
{
    if (typeof value !== 'undefined') 
    {
        return parseFloat(value.toString());
    }
    return value;
};

accountSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Accounts', accountSchema);