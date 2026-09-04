const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const path = require("path");
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/users", require("./routes/user.routes"));
app.use("/api/v1/members", require("./routes/member.routes"));
app.use("/api/v1/donations", require("./routes/donation.routes"));
app.use("/api/v1/events", require("./routes/event.routes"));
app.use("/api/v1/projects", require("./routes/project.routes"));
app.use("/api/v1/news", require("./routes/news.routes"));
app.use("/api/v1/gallery", require("./routes/gallery.routes"));
app.use("/api/v1/certificates", require("./routes/certificate.routes"));
app.use("/api/v1/dashboard", require("./routes/dashboard.routes"));
app.use("/api/v1/crowdfunding", require("./routes/crowdfunding.routes"));
app.use(
  "/api/v1/event-registration",
  require("./routes/eventregistration.routes"),
);
app.use("/api/v1/appointments", require("./routes/appointment.routes"));
app.use("/api/v1/complaints", require("./routes/complaint.routes"));
app.use("/api/v1/reports", require("./routes/report.routes"));
app.use("/api/v1/testimonials", require("./routes/testimonial.routes"));
app.use("/api/v1/contact", require("./routes/contact.routes"));
app.use("/api/v1/downloads", require("./routes/download.routes"));
app.use("/api/v1/team", require("./routes/team.routes"));
app.use("/api/v1/awards", require("./routes/award.routes"));
app.use("/api/v1/site-content", require("./routes/siteContent.routes"));
app.use("/api/v1/newsletter", require("./routes/newsletter.routes"));
// Admin — Backup
const isAuthenticated = require("./middleware/auth");
const authorizeRoles = require("./middleware/role");
const { getDatabaseBackup } = require("./controllers/backup.controller");
app.get(
  "/api/v1/admin/backup",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getDatabaseBackup,
);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
