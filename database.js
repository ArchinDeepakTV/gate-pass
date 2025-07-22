const { MongoClient } = require("mongodb");
const { Pool } = require("pg");
require("dotenv").config();

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error(
    "MONGO_URI environment variable not set. Please create a .env file with the connection string."
  );
  process.exit(1);
}
const mongoClient = new MongoClient(mongoUri);

async function connectToMongo() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Could not connect to MongoDB", e);
    process.exit(1);
  }
}

// PostgreSQL connection
/*
const pgPool = new Pool({
    connectionString: process.env.POSTGRES_URI,
});

pgPool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pgPool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
*/

async function addGatePassEntry(data) {
  // Add to MongoDB
  try {
    const db = mongoClient.db("gate_pass_db");
    const collection = db.collection("entries");
    await collection.insertOne(data);
    console.log("Data inserted into MongoDB");
  } catch (e) {
    console.error("Error inserting into MongoDB", e);
  }

  // Add to PostgreSQL
  /*
    const pgClient = await pgPool.connect();
    try {
        await pgClient.query('BEGIN');
        const queryText = 'INSERT INTO gate_pass_entries(serial_number, person_name, source, destination, reason, entry_date, items) VALUES($1, $2, $3, $4, $5, $6, $7)';
        const itemsJson = JSON.stringify(data.items);
        await pgClient.query(queryText, [data.serialNumber, data.personName, data.source, data.destination, data.reason, data.date, itemsJson]);
        await pgClient.query('COMMIT');
        console.log('Data inserted into PostgreSQL');
    } catch (e) {
        await pgClient.query('ROLLBACK');
        console.error('Error inserting into PostgreSQL', e);
    } finally {
        pgClient.release();
    }
    */
}

async function getLatestSerialNumber() {
  try {
    const db = mongoClient.db("gate_pass_db");
    const collection = db.collection("entries");
    const latestEntry = await collection
      .find()
      .sort({ serialNumber: -1 })
      .limit(1)
      .toArray();
    if (latestEntry.length > 0) {
      return latestEntry[0].serialNumber;
    } else {
      return 0; // No entries yet, start from 1 (0+1)
    }
  } catch (e) {
    console.error("Error fetching latest serial number from MongoDB", e);
    return 0; // Default to 0 on error
  }
}

async function getHistory() {
  try {
    const db = mongoClient.db("gate_pass_db");
    const collection = db.collection("entries");
    const entries = await collection
      .find()
      .sort({ serialNumber: -1 })
      .toArray();
    return entries;
  } catch (e) {
    console.error("Error fetching history from MongoDB", e);
    return []; // Return empty array on error
  }
}

module.exports = {
  connectToMongo,
  addGatePassEntry,
  getLatestSerialNumber,
  getHistory,
  // pgPool
};
