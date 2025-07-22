// authRoutes.js
const express = require("express");
const router = express.Router();
const { addGatePassEntry, getLatestSerialNumber } = require('../database');

router.use(express.json()); // Middleware to parse JSON bodies
const dayjs = require("dayjs");

// Show history (GET /history)
router.get("/history", (req, res) => {
  // Replace with real data fetching logic
  const dummyHistory = [
    { id: 1, item: "Entry 1", date: "2025-07-20" },
    { id: 2, item: "Entry 2", date: "2025-07-21" },
  ];
  res.render("history", { entries: dummyHistory });
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

router.post('/api/add-entry', async (req, res) => {
    try {
        await addGatePassEntry(req.body);
        res.status(200).json({ message: 'Entry added successfully' });
    } catch (error) {
        console.error('Error in /api/add-entry', error);
        res.status(500).json({ message: 'Failed to add entry' });
    }
});

router.get('/api/latest-serial-number', async (req, res) => {
    try {
        const latestSerialNumber = await getLatestSerialNumber();
        res.status(200).json({ serialNumber: latestSerialNumber });
    } catch (error) {
        console.error('Error in /api/latest-serial-number', error);
        res.status(500).json({ message: 'Failed to get latest serial number' });
    }
});

module.exports = router;
