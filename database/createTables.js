const db = require("./nittanyDatabase");

try {
  db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    email           VARCHAR(100)      PRIMARY KEY,
    userPassword    VARCHAR(100)      NOT NULL,
    fullName        VARCHAR(100)      NOT NULL,
    phone           VARCHAR(15)       NOT NULL,
    userRole        VARCHAR(10)       NOT NULL,
    UNIQUE (email, userRole)
  );

  CREATE TABLE IF NOT EXISTS Zipcode (
    zipCode         VARCHAR(10)       PRIMARY KEY,
    city            VARCHAR(50)       NOT NULL,
    state           VARCHAR(2)        NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Address (
    street          VARCHAR(100)      NOT NULL,
    zipCode         VARCHAR(10)       NOT NULL,
    PRIMARY KEY (street, zipCode),
    FOREIGN KEY (zipCode)
      REFERENCES Zipcode (zipCode)
  );

  CREATE TABLE IF NOT EXISTS Rider (
    email           VARCHAR(100)      PRIMARY KEY,
    userRole        VARCHAR(10)       NOT NULL DEFAULT 'rider',
    streetAddress   VARCHAR(100)      NOT NULL,
    streetZip       VARCHAR(10)       NOT NULL,
    FOREIGN KEY (email, userRole)
        REFERENCES Users (email, userRole),
    FOREIGN KEY (streetAddress, streetZip)
      REFERENCES Address (street, zipCode)
  );

  CREATE TABLE IF NOT EXISTS Driver (
    email           VARCHAR(100)      PRIMARY KEY,
    userRole        VARCHAR(10)       NOT NULL DEFAULT 'driver',
    licenseNumber   VARCHAR(20)       NOT NULL UNIQUE,
    balance         DECIMAL(10,2)     NOT NULL DEFAULT 0,
    FOREIGN KEY (email, userRole)
      REFERENCES Users (email, userRole)
  );

  CREATE TABLE IF NOT EXISTS Payment (
    email           VARCHAR(100)      NOT NULL,
    cardNumber      VARCHAR(20)       NOT NULL,
    cardType        VARCHAR(20)       NOT NULL,
    expirationDate  DATE NOT NULL,
    PRIMARY KEY (email, cardNumber),
    FOREIGN KEY (email)
      REFERENCES Users (email)
  );

  CREATE TABLE IF NOT EXISTS Vehicle (
    plateNumber     VARCHAR(10)       PRIMARY KEY,
    driverEmail     VARCHAR(100)      NOT NULL,
    make            VARCHAR(30)       NOT NULL,
    model           VARCHAR(30)       NOT NULL,
    vehicleYear     INTEGER           NOT NULL,
    color           VARCHAR(20)       NOT NULL,
    seatCapacity    INTEGER           NOT NULL DEFAULT 4,
    FOREIGN KEY (driverEmail)
      REFERENCES Driver (email)
  );

  CREATE TABLE IF NOT EXISTS Category (
    categoryID      INTEGER           PRIMARY KEY AUTOINCREMENT,
    categoryName    VARCHAR(50)       NOT NULL,
    parentID        INTEGER,
    UNIQUE (parentID, categoryName),
    FOREIGN KEY (parentID)
      REFERENCES Category (categoryID)
  );

  CREATE TABLE IF NOT EXISTS Offering (
    offeringID      INTEGER           PRIMARY KEY AUTOINCREMENT,
    vehiclePlate    VARCHAR(10)       NOT NULL,
    categoryID      INTEGER           NOT NULL,
    fareRate        DECIMAL(8,2)      NOT NULL,
    offerStatus     VARCHAR(10)       NOT NULL DEFAULT 'open',
    FOREIGN KEY (vehiclePlate)
      REFERENCES Vehicle (plateNumber),
    FOREIGN KEY (categoryID)
      REFERENCES Category (categoryID)
  );

  CREATE TABLE IF NOT EXISTS RiderOrder (
    orderID         INTEGER           PRIMARY KEY AUTOINCREMENT,
    riderEmail      VARCHAR(100)      NOT NULL,
    offeringID      INTEGER           NOT NULL,
    cardNumber      VARCHAR(19)       NOT NULL,
    totalAmount     DECIMAL(8,2)      NOT NULL,
    orderStatus     VARCHAR(10)       NOT NULL DEFAULT 'pending',
    FOREIGN KEY (riderEmail)
      REFERENCES Users (email),
    FOREIGN KEY (offeringID)
      REFERENCES Offering (offeringID),
    FOREIGN KEY (riderEmail, cardNumber)
      REFERENCES Payment (email, cardNumber)
  );

  CREATE TABLE IF NOT EXISTS Review (
    reviewID        INTEGER           PRIMARY KEY AUTOINCREMENT,
    orderID         INTEGER           NOT NULL UNIQUE,
    rating          INTEGER           NOT NULL,
    reviewComment   TEXT,
    FOREIGN KEY (orderID)
      REFERENCES RiderOrder (orderID)
  );

  CREATE TABLE IF NOT EXISTS Question (
    questionID      INTEGER           PRIMARY KEY AUTOINCREMENT,
    riderEmail      VARCHAR(100)      NOT NULL,
    offeringID      INTEGER           NOT NULL,
    questionText    TEXT              NOT NULL,
    FOREIGN KEY (riderEmail)
      REFERENCES Users (email),
    FOREIGN KEY (offeringID)
      REFERENCES Offering (offeringID)
  );

  CREATE TABLE IF NOT EXISTS SupportRequest (
    requestID       INTEGER           PRIMARY KEY AUTOINCREMENT,
    orderID         INTEGER           NOT NULL,
    requestStatus   VARCHAR(10)       NOT NULL DEFAULT 'unassigned',
    requestDescription TEXT,
    FOREIGN KEY (orderID)
      REFERENCES RiderOrder (orderID)
  );

  CREATE TABLE IF NOT EXISTS Lost_Item_Report (
    reportID        INTEGER           PRIMARY KEY AUTOINCREMENT,
    orderID         INTEGER           NOT NULL,
    itemDescription TEXT              NOT NULL,
    driverResponse  TEXT,
    reportStatus    VARCHAR(10)       NOT NULL DEFAULT 'open',
    fee             DECIMAL(5,2)      NOT NULL DEFAULT 20,
    FOREIGN KEY (orderID)
      REFERENCES RiderOrder (orderID)
  );
`)

console.log("Successfully created tables!");
} catch (error) {
  console.error("Error creating tables: ", error);
}
