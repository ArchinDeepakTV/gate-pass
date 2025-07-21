const { Client } = require("pg");

const dbConfig = {
  user: "archin",
  password: "HLLhcs@987!",
  host: "localhost",
  port: 5432,
};

const dbName = "gate_pass_db";

const createDbAndTable = async () => {
  let client = new Client(dbConfig);

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    if (res.rowCount === 0) {
      console.log(`Database '${dbName}' not found. Creating it...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.error("Error checking or creating database:", err);
  } finally {
    await client.end();
  }

  const dbConnectionConfig = { ...dbConfig, database: dbName };
  client = new Client(dbConnectionConfig);

  try {
    await client.connect();
    console.log("Connected to the database to create the table.");

    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS entries (
                id SERIAL PRIMARY KEY,
                body TEXT NOT NULL,
                entry_time TIMESTAMPTZ NOT NULL,
                person_name VARCHAR(255) NOT NULL,
                from_location VARCHAR(255) NOT NULL,
                to_location VARCHAR(255) NOT NULL,
                serial_number INT UNIQUE NOT NULL
            );
        `;

    await client.query(createTableQuery);
    console.log('Table "entries" created or already exists.');
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await client.end();
  }
};

createDbAndTable();
