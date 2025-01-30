import express from 'express'
import {assignDoctors} from '../model/assignDoctor.js'
const router = express.Router()



router.post('/', async(req, res) => {
  const { patientId, doctorId } = req.body;
 if(!patientId || !doctorId){
  res.status(400).json({message:"faield"})
 }
try {
  const doctor = new assignDoctors({
    patientId, doctorId
  })

  await doctor.save()
  res.status(201).json({message: 'sucessfull'})
} catch (error) {
  res.status(500).json({ message: 'Server error' });
}

});



export default router;
