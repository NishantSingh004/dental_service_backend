import {User} from '../model/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).json({message: "All fields are required"});
  }

  try {

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);  
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }

    const token = jwt.sign({userId: user.userId, role: user.role,email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});


    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "Development" ? "lax": "none",
      secure: process.env.NODE_ENV === "Development" ? false :true, 
  });

  res.json({ message: 'Login successful', token: token  });
  }catch (err) {
    res.status(500).json({ message: 'Server error' });
}
}