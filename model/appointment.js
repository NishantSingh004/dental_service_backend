import mongose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const appointmentSchema = new mongose.Schema({
    name: {type: String, required: true},
    phone : {type: String, required: true},
    email: {type: String, required: true},
    dob: {type: Date, required: true},
    date: {type: Date, required: true},
    message: {type: String, required: true},
    appointmentid: {type: String,
          default: uuidv4, // Automatically generate UUID when a new user is created
          unique: true, // Ensure UUID is unique for each user
          required: true
        },
})

export const Appointment = mongose.model('Appointment', appointmentSchema);