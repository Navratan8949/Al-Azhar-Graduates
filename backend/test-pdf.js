const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const { generateAndSaveAppointmentLetter } = require("./src/utils/appointmentLetterGenerator");
const Member = require("./src/models/Member");
const User = require("./src/models/User");

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    
    // Find a member
    const member = await Member.findById("6a9a5df2336dc9835b733df4").populate('user');
    if (!member) {
        console.log("No member found, checking any");
        const m = await Member.findOne().populate('user');
        if(!m) {
            console.log("No members at all!");
            process.exit(1);
        }
        member = m;
    }
    
    console.log("Member ID:", member._id.toString());
    
    try {
        const letter = await generateAndSaveAppointmentLetter({
            memberId: member._id,
            designation: "Test",
            department: "Test Dept",
            joiningDate: "2020-12-12",
            protocol: "http",
            host: "localhost:8000"
        });
        console.log("Success!", letter.letterNo);
    } catch(err) {
        console.error("Failed:", err);
    }
    process.exit(0);
}

test();
