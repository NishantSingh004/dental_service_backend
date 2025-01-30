import mongose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const contactSchema = new mongose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone : {type: String, required: true},
    subject: {type: String, required: true},
    message: {type: String, required: true},
    contactid: {type: String,
          default: uuidv4, // Automatically generate UUID when a new user is created
          unique: true, // Ensure UUID is unique for each user
          required: true
        },
})

export const Contact = mongose.model('contact', contactSchema);