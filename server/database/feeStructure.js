const mongoose = require('mongoose');

const feeStructureSchema = mongoose.Schema({
    className: {
        type: String,
        required: true,
        trim: true
    },
    tuitionFee: {
        type: Number,
        required: true
    },
    examFee: {
        type: Number,
        required: true
    },
    session:{
        type: String,
    },
    items:[
        {
            itemName:{
                type:String,
                required:true
            },
            itemAmount:{
                type:Number,
                required:true
            },

        }
    ]
}, {timestamps: true});

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
module.exports = FeeStructure;  