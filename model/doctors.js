import mongose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const doctorSchema = new mongose.Schema({
    name: {type: String, required: true},
    phone : {type: String, required: true},
    email: {type: String, required: true, unique: true},
    doctorid: {type: String,
          default: uuidv4, // Automatically generate UUID when a new user is created
          unique: true, // Ensure UUID is unique for each user
          required: true
        },
        role: {
          type: String,
          required: true,
          enum: ['general Dentist', 'orthodontist', 'periodontist', 'endodontist','Oral and Maxillofacial Surgeon','prosthodontist','pediatric Dentist','oralPathologist','oralRadiologist','public Health Dentist','cosmetic Dentist']
      },
})

export const Doctor = mongose.model('Doctor', doctorSchema);