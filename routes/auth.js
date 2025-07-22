// authRoutes.js
const express = require("express");
const router = express.Router();
const {
  addGatePassEntry,
  getLatestSerialNumber,
  getHistory,
} = require("../database");

router.use(express.json()); // Middleware to parse JSON bodies
const dayjs = require("dayjs");

// Show history (GET /history)
router.get("/history", async (req, res) => {
  try {
    const entries = await getHistory();
    res.render("history", { entries: entries });
  } catch (error) {
    console.error("Error fetching history", error);
    res.status(500).send("Error fetching history");
  }
});

// Handle form submission (POST /add)
router.post("/add", (req, res) => {
  const { item } = req.body;
  // Add to DB or memory (you’ll replace this)
  console.log("New item added:", item);
  res.redirect("/history");
});

// Show add form (GET /add-new)
router.get("/add", (req, res) => {
  const formattedDate = dayjs().format("D MMMM YYYY"); // e.g., "21 July 2025"
  res.render("add", { today: formattedDate });
});

router.post("/api/add-entry", async (req, res) => {
  try {
    const entryData = req.body;
    entryData.personName = entryData.personName.toUpperCase();
    entryData.source = entryData.source.toUpperCase();
    entryData.destination = entryData.destination.toUpperCase();
    entryData.reason = entryData.reason.toUpperCase();

    await addGatePassEntry(entryData);
    res.status(200).json({ message: "Entry added successfully" });
  } catch (error) {
    console.error("Error in /api/add-entry", error);
    res.status(500).json({ message: "Failed to add entry" });
  }
});

router.get("/api/latest-serial-number", async (req, res) => {
  try {
    const latestSerialNumber = await getLatestSerialNumber();
    res.status(200).json({ serialNumber: latestSerialNumber });
  } catch (error) {
    console.error("Error in /api/latest-serial-number", error);
    res.status(500).json({ message: "Failed to get latest serial number" });
  }
});

module.exports = router;
