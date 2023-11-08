import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name:String,
    isDeposit:Boolean,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date and time
    }
})

export default mongoose.model('Categories', categorySchema);