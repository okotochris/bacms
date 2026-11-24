const mongoose = require('mongoose')

const accademicSchema = mongoose.Schema({
    session : {
        type: String,
        require:true,
        unique:true
    },
    term : {
        type: String,
        require:true,
    },
    startDate : {
        type: String,
       
    },
    endDate : {
        type: String,
        require:true,
    },
    nextTermDate : {
        type: String,
        require:true,
    },
}, {createdAt:true})

const Accademic = mongoose.model("Accademic", accademicSchema)
module.exports = Accademic