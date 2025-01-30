import { User } from "../model/users.js";
import bcrypt from "bcrypt";


export const addUser = async (req, res) => {
  const {email, password, role } = req.body;  

  if(!email || !password || !role){
    return res.status(400).json({message: "All fields are required"});
  }
  
  try {

    const hashpassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password:hashpassword,
      role,
      isActive: true,
      createdAt: new Date(),
    })
  
    await user.save();
    res.status(201).json({message: "User created successfully"});
  
 
}catch (err) {
  res.status(500).json({ message: 'Server error' });
}
}