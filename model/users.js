import mongose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


  const UserSchema = new mongose.Schema({
    userId: {
      type: String,
      default: uuidv4, // Automatically generate UUID when a new user is created
      unique: true, // Ensure UUID is unique for each user
      required: true
      },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'doctor'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongose.model('User', UserSchema);