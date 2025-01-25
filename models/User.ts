import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'viewer' | 'editor' | 'administrator';
    isActive: boolean;
}

const UserSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['viewer', 'editor', 'administrator'], default: 'viewer' },
}, { timestamps: true });

// Before saving the user, hash the password
UserSchema.pre<IUser>('save', async function (next) {
   try {
       if(this.isModified('password')) {
           const salt = await bcrypt.genSalt(10);
           this.password = await bcrypt.hash(this.password, salt);
           next();
       }
       else next();
   } catch(e) {
       next(e);
   }
});

export default mongoose.model<IUser>('User', UserSchema);
