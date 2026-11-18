const mongoose = require('mongoose');

const feeStructureSchema = mongoose.Schema({
    className: {
        type: String,
        required: true,
        trim: true
    },
    items: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            amount: {
                type: Number,
            }
        }
    ],
    session:{
        type: String,
    },

}, {timestamps: true});

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
module.exports = FeeStructure;  