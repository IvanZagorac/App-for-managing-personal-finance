import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
        unique: true 
    },
    totalAmount:Number
})

export default mongoose.model('Accounts', accountSchema);