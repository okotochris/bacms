const mongoose = require('mongoose');

const gradingSchema = mongoose.Schema({
    grade:{
        type:String,
        require:true,
        unique:true
    },
    min:{
        type:Number,
        require:true,
        unique:true
    },
    max:{
        type:Number,
        require:true,
        unique:true
    },
    remark:{
        type:String,
        require:true,
       unique:true
    },
}, {createdAt:true})

module.exports = mongoose.model("Grading", gradingSchema)