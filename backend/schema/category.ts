import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name:String,
    isDeposit:Boolean,
})

export default mongoose.model('Categories', categorySchema);