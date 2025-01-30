import mongoose from 'mongoose';

const assignDoctorsSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  });
  
  export const assignDoctors = mongoose.model('assignDoctors', assignDoctorsSchema);
  