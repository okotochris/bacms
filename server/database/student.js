const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
      trim: true,
    },
    studentId:{
        type:String,
        trim:true,
        require:true
    },
    admissionNo: {
      type: String,
      require: true,
      trim: true,
    },
    className: {
      type: String,
      require: true,
      trim: true,
    },
    gender: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    schoolFees: {
      type: Boolean,
      default: false,
    },
    image: {
      profileImage: String,
      public_id: String,
    },
    guardianName: String,
    guardianContact: String,
    guardianRelationshipStatus: String,
    address:String,

  },
  { timestamps: true },
);

const student = mongoose.model('student', studentSchema)

module.exports = student
