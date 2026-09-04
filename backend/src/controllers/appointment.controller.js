const AppointmentLetter = require("../models/AppointmentLetter");
const Member = require("../models/Member");
const {
  generateAndSaveAppointmentLetter,
} = require("../utils/appointmentLetterGenerator");

exports.createAppointmentLetter = async (req, res) => {
  try {
    const { memberId, designation, department, joiningDate } = req.body;

    console.log("req.body", req.body);

    const populatedLetter = await generateAndSaveAppointmentLetter({
      memberId,
      designation,
      department,
      joiningDate,
      protocol: req.protocol,
      host: req.get("host"),
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Appointment letter generated successfully",
        appointmentLetter: populatedLetter,
      });
  } catch (error) {
    if (error.message === "Member not found") {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAppointmentLetters = async (req, res) => {
  try {
    const letters = await AppointmentLetter.find()
      .populate({
        path: "member",
        populate: { path: "user", select: "fullName email" },
      })
      .sort("-createdAt");

    res.status(200).json({ success: true, count: letters.length, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAppointmentLetters = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user.id });
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member profile not found" });
    }

    const letters = await AppointmentLetter.find({ member: member._id }).sort(
      "-createdAt",
    );
    res.status(200).json({ success: true, count: letters.length, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
