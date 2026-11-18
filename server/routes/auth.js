const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../database/teacher')


router.post('/auth/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message:'Invalid email or password'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid email or password'})
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            status: user.status,
            role: user.role,
        }
        res.status(200).json({ token, user: userData });
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Server error'})
    }
})

module.exports = router;