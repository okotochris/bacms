const mongoose = require('mongoose')

const subjectSchema = mongoose.Schema({
    subjectName:{
        type:String,
        required:true,
    },
    code:{
        type:String,
    },
    classes:[{
        type:String,
    }],
    teacher:{
        type:String,
    },
}, {timeStamps:true})

const subject = mongoose.model("subject", subjectSchema)

module.exports = subject;