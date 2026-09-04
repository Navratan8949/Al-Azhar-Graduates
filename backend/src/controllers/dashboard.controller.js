const Member = require("../models/Member");
const Donation = require("../models/Donation");
const Project = require("../models/Project");
const Event = require("../models/Event");
const Complaint = require("../models/Complaint");
const Crowdfunding = require("../models/Crowdfunding");

exports.getDashboardStats = async (req, res) => {
    try {
        // --- 1. Basic Counts ---
        const totalMembers = await Member.countDocuments();
        const approvedMembers = await Member.countDocuments({ membershipStatus: "approved" });

        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: "active" });
        const completedProjects = await Project.countDocuments({ status: "completed" });

        const totalEvents = await Event.countDocuments();
        const upcomingEvents = await Event.countDocuments({ status: "upcoming" });

        const donations = await Donation.find({ paymentStatus: { $in: ["success", "verified"] } });
        const totalDonationAmount = donations.reduce((sum, d) => sum + d.amount, 0);
        const totalDonationCount = donations.length;

        // --- 2. Actionable Alerts (Pending Items for Admin) ---
        const pendingMembersList = await Member.find({ membershipStatus: "pending" })
            .populate("user", "fullName email")
            .sort("-createdAt")
            .limit(5);
        const pendingMembersCount = await Member.countDocuments({ membershipStatus: "pending" });

        const pendingDonationsList = await Donation.find({ paymentStatus: "pending", paymentId: "manual" })
            .populate({ path: "member", populate: { path: "user", select: "fullName" } })
            .sort("-createdAt")
            .limit(5);
        const pendingDonationsCount = await Donation.countDocuments({ paymentStatus: "pending", paymentId: "manual" });

        const openComplaintsList = await Complaint.find({ status: "pending" })
            .populate({ path: "member", populate: { path: "user", select: "fullName" } })
            .sort("-createdAt")
            .limit(5);
        const openComplaintsCount = await Complaint.countDocuments({ status: "pending" });

        // --- 3. Crowdfunding Progress ---
        const activeCrowdfundings = await Crowdfunding.find({ status: "active" }).select("title targetAmount raisedAmount endDate");
        
        // --- 4. Guaranteed 6-Month Donation Trends ---
        const monthlyTrends = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            
            // Calculate sum for this month
            const monthSum = donations.filter(don => {
                const donDate = new Date(don.createdAt);
                return donDate.getMonth() === d.getMonth() && donDate.getFullYear() === d.getFullYear();
            }).reduce((sum, don) => sum + don.amount, 0);

            monthlyTrends.push({ month: label, amount: monthSum });
        }

        // --- 5. Donations by Purpose ---
        const donationsByPurposeMap = {};
        donations.forEach(d => {
            const purpose = d.purpose || "General";
            if (!donationsByPurposeMap[purpose]) {
                donationsByPurposeMap[purpose] = 0;
            }
            donationsByPurposeMap[purpose] += d.amount;
        });
        const donationsByPurpose = Object.keys(donationsByPurposeMap).map(key => ({
            name: key,
            value: donationsByPurposeMap[key]
        }));

        // --- 6. Status Breakdown Analytics ---
        const memberDistribution = [
            { name: "Approved", value: approvedMembers },
            { name: "Pending", value: pendingMembersCount }
        ].filter(m => m.value > 0);

        const projectDistribution = [
            { name: "Active", value: activeProjects },
            { name: "Completed", value: completedProjects },
            { name: "Upcoming/Other", value: Math.max(0, totalProjects - activeProjects - completedProjects) }
        ].filter(p => p.value > 0);

        // --- 7. Recent Activity Timeline ---
        const recentMembers = await Member.find().populate("user", "fullName").sort("-createdAt").limit(3);
        const recentDonationsFeed = await Donation.find().sort("-createdAt").limit(3);
        const recentComplaints = await Complaint.find().sort("-createdAt").limit(3);

        const activityFeed = [];

        recentMembers.forEach(m => {
            activityFeed.push({
                type: "member",
                title: `New member registered: ${m.user?.fullName || "Member"}`,
                time: m.createdAt,
                status: m.membershipStatus
            });
        });

        recentDonationsFeed.forEach(d => {
            activityFeed.push({
                type: "donation",
                title: `Donation of ₹${d.amount?.toLocaleString("en-IN") || 0} received`,
                time: d.createdAt,
                status: d.paymentStatus
            });
        });

        recentComplaints.forEach(c => {
            activityFeed.push({
                type: "complaint",
                title: `Complaint submitted: ${c.subject || "Issue"}`,
                time: c.createdAt,
                status: c.status
            });
        });

        activityFeed.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json({
            success: true,
            stats: {
                overview: {
                    members: { total: totalMembers, approved: approvedMembers },
                    projects: { total: totalProjects, active: activeProjects },
                    events: { total: totalEvents, upcoming: upcomingEvents },
                    donations: { totalAmount: totalDonationAmount, count: totalDonationCount }
                },
                actionableAlerts: {
                    pendingMembers: { count: pendingMembersCount, list: pendingMembersList },
                    pendingDonations: { count: pendingDonationsCount, list: pendingDonationsList },
                    openComplaints: { count: openComplaintsCount, list: openComplaintsList }
                },
                crowdfunding: activeCrowdfundings,
                monthlyTrends: monthlyTrends,
                activityFeed: activityFeed.slice(0, 5),
                analytics: {
                    donationsByPurpose,
                    memberDistribution,
                    projectDistribution
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
