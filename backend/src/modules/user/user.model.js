// user.model.js: Modèle Mongoose pour l'entité User
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);


