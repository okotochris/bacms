const express = require('express')
const Student = require('../database/student')

const router = express.Router()

router.post('/student/login', async (req, res) => {
    try {
        const { studentName, studentId } = req.body;

        if (!studentName || !studentId) {
            return res.status(400).json({
                message: 'Student name and ID are required'
            });
        }

        const nameParts = studentName.trim().split(/\s+/);

        const student = await Student.findOne({
            studentId: studentId.trim(),
            fullname: {
                $regex: nameParts.join('|'),
                $options: 'i'
            }
        });

        if (!student) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({ student });
        console.log(student)

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: 'Server error'
        });
    }
});
module.exports = router