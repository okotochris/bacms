const express = require('express');
const Student = require('../database/student')
const upload = require('../middleware/upload')
const cloudinary = require('../utilities/cloudinary')
const Teacher = require('../database/teacher')
const Subject = require('../database/subject')
const PaymentHistory = require('../database/paymentHistory')
const Result = require('../database/result')
const bcrypt = require('bcrypt')
const FeeStructure = require('../database/feeStructure')
const fs = require('fs/promises');


const router = express.Router()

router.get('/dashboard', async(req, res)=>{
    try{
        const students = await Student.find()
        const results = await Result.countDocuments()
        const payments = await PaymentHistory.find().limit(5).sort({createdAt:-1})
        res.status(200).json({students, payments, results, message:'successfull'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'server error'})
    }
})

router.get('/student', async(req, res)=>{
    try{
       const data = await Student.find().sort({createdAt:-1})
        res.status(200).json({data, message:'successfull'})
    }catch(err){
        console.log(err)
        res.status(500).json({message:'server error'})
    }
})

router.post('/student', upload.single('profileImage'), async (req, res) => {
  let uploadedImage = null;

  try {
    let image = {
      profileImage: '',
      public_id: ''
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bacms/students',
        resource_type: 'image'
      });

      uploadedImage = result;

      image = {
        profileImage: result.secure_url,
        public_id: result.public_id
      };

      // Remove temporary uploaded file
      await fs.unlink(req.file.path);
    }

    const student = await Student.create({
      ...req.body,
      image
    });

    return res.status(201).json({
      message: 'Student created successfully',
      student
    });

  } catch (err) {
    console.error(err);

    // Clean up temporary file if it still exists
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    // Remove Cloudinary image if database creation failed
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id)
        .catch(console.error);
    }

    return res.status(500).json({
      message: 'Server error unable to save student'
    });
  }
});
router.delete('/student/:_id', async(req, res)=>{
     try{
        const {_id} = req.params
        const student = await Student.findOne({_id})
        if(student){
            await cloudinary.destroy(student.image.public_id)
        }
        await Student.findOneAndDelete({_id})
        res.status(200).json({message:"successful"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
})
router.get('/student/:className', async(req, res)=>{
     try{
        const {className} = req.params
        const student = await Student.find({className})
        const subject = await Subject.find({
            classes:{
                $in:[className]
            }
        })

        res.status(200).json({student, subject, message:"successful"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
})
router.get('/teacher', async(req, res)=>{
    try{
        const teacher = await Teacher.find().sort({createdAt:-1})
        res.status(200).json({teacher, message:'successful'})
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Server error'})
    }
})

router.post('/teacher', async(req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const teacher = await Teacher.create({...req.body, password: hashedPassword})
        res.status(200).json({teacher, message:"successful"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
})

router.delete('/teacher/:_id', async(req, res)=>{
     try{
        const {_id} = req.params
        await Teacher.findOneAndDelete({_id})
        res.status(200).json({message:"deleted"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
})

router.get('/subject', async(req, res)=>{
    try{
        const subject = await Subject.find()
        const result = await Result.find()
        res.status(200).json({subject, result})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
})
router.post('/subject', async(req, res)=>{
    try{
        const subject = await Subject.create(req.body)
        res.status(200).json({subject})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
})
router.delete('/subject/:_id', async(req, res)=>{
    try{
        const {_id} = req.params
        const subject = await Subject.findOneAndDelete({_id})
        res.status(200).json({subject})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
})

router.get('/result_subject', async(req, res)=>{
    try{
        const result = await Result.find().sort({createdAt:-1})
        const subject = await Subject.find()
        res.status(200).json({result, subject, message:'successfull'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'server error'})
    }
})

//FEE STRUCTURE
router.get('/fee_structure', async(req, res)=>{
    try{
        const feeStructure = await FeeStructure.find().sort({createdAt:-1})
        res.status(200).json({feeStructure, message:'successfull'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'server error'})
    }
})
router.post('/fee_structure', async(req, res)=>{
    try{
        const feeStructure = await FeeStructure.create(req.body)
        res.status(200).json({feeStructure, message:'successfull'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'server error'})
    }
})

module.exports = router