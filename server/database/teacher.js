const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    employeeNo:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    phone:{
        type:String,
        trim:true
    },
    department:{
        type:String,

    },
    assignedClass:{
        type:String,
    },
    status:{
        type:String,
        defalt:'active'
    },
    role:{
        type:String,
        default:'teacher'
    }
}, {timeStamps:true})

const teacher = mongoose.model("Teacher", teacherSchema)
module.exports = teacher