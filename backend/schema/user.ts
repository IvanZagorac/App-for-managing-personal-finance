import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true 
    },
    fullName:String,
    password:String
})

export default mongoose.model('Users', userSchema);