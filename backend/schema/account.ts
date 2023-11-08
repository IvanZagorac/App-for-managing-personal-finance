import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
    },
    totalAmount:Number
})

accountSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Accounts', accountSchema);