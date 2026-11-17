# CMPSC431W_NittanyRide
Repo for the NittanyRide project

# NittanyRide

## Project Description
NittanyRide is a ride-sharing application developed using JavaScript, Express.js, and SQLite.

## Prerequisites
Before running the project, make sure the following is installed:

- [Node.js] (Node.js 24 LTS recommended)
- npm (included in Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:MrBrunoRod/CMPSC431W_NittanyRide.git
   ```

2. Navigate to the project directory:

   ```bash
   cd CMPSC431W_NittanyRide
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Database Setup

1. Create the SQLite database and tables:

   ```bash
   node database/createTables.js
   ```

2. Import the provided CSV data into the database:

   ```bash
   node database/populateDatabase.js
   ```

   Make sure the CSV files are in the expected data directory before running this command.

## Running the Application

Start the application:

```bash
node server.js
```

Open the application in your browser at:

```text
http://localhost:3000
```

## Project Structure

```text
CMPSC431W_NittanyRide/
├── database/
│   ├── nittanyDatabase.js
│   ├── createTables.js
│   ├── populateData.js
│   └── database.sqlite
├── public/
│   ├── css/
│   ├── javascript/
│   └── html/
├── data/
│   └── CSV files
├── server.js
├── package.json
└── README.md
```

## Notes

- Run the database setup and data population commands before starting the application.
- The application runs locally on port 3000.
- Do not manually edit the generated SQLite database unless necessary.
