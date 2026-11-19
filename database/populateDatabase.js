const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const bcrypt = require("bcrypt");

const db = require("./nittanyDatabase");

const dataPath = path.join(__dirname, "..", "data");

const tableOrder = [
  "Users",
  "Zipcode",
  "Address",
  "Rider",
  "Driver",
  "Payment",
  "Vehicle",
  "Category",
  "Offering",
  "RiderOrder",
  "Review",
  "Question",
  "SupportRequest",
  "Lost_Item_Report"
];

const csvReader = (tableName) => {
  return new Promise((resolve, reject) => {
    const records = [];
    const filePath = path.join(dataPath, `${tableName}.csv`);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        records.push(row);
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", reject);
  });
}

const insertRecords = (tableName, records) => {
  if (records.length === 0) {
    console.log(`No records found in ${tableName}.`);
    return;
  }

  const cols = Object.keys(records[0]);

  const databaseColumns = db.prepare(`PRAGMA table_info("${tableName}")`).all().map(cols => cols.name);
  
  for (const col of cols) {
    if (!databaseColumns.includes(col)) {
      throw new Error(`Column "${col}" does not exist in ${tableName}.`);
    }
  }

  const colNames = cols.map(col => `"${col}"`).join(", ");
  const placeholders = cols.map(() => "?").join(", ");

  const insert = db.prepare(`INSERT INTO "${tableName}" (${colNames}) VALUES (${placeholders})`);

  for (const record of records) {
    if (tableName === "Users") {
      record.userPassword = bcrypt.hashSync(record.userPassword, 10);
    }

    const values = cols.map(col => {
      const value = record[col];

      return value === "" ? null : value;
    });

    insert.run(...values);
  }

  console.log(`${tableName}: Inserted ${records.length} records.`);
}

const populateDatabase = async () => {
  try {
    const tableData = [];

    for (const tableName of tableOrder) {
      const records = await csvReader(tableName);
      tableData.push({ tableName, records });
    }

    const insertAll = db.transaction(() => {
      for (const { tableName } of tableData) {
        const count = db.prepare(`SELECT COUNT(*) AS count FROM "${tableName}"`).get().count;

        if (count > 0) {
          throw new Error(`${tableName} already contains data.`);
        }
      }

      for (const { tableName, records } of tableData) {
        insertRecords(tableName, records);
      }

      const violations = db.prepare("PRAGMA foreign_key_check").all();

      if (violations.length > 0) {
        throw new Error(`Found ${violations.length} foreign key violation.`);
      }
    });

    insertAll();
    console.log("Database populated!");
  } catch (error) {
    console.error("Error populating database: ", error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

populateDatabase();