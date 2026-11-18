const mongoose = require('mongoose')
const paymentHistorySchema = mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    studentName:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    paymentMethod:{
        type: String,
        required: true
    },
    
}, {timestamps:true})
module.exports = mongoose.model('PaymentHistory', paymentHistorySchema)
