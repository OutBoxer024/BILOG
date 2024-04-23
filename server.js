require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/airhandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require("./config/CorsOptions");
const PORT = process.env.PORT || 4000

console.log(process.env.NODE_ENV)

const fs = require('fs');

const errorLogFile = './logs/errLog.log';

// Create the logs folder if it doesn't exist
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

// Create the error log file if it doesn't exist
if (!fs.existsSync(errorLogFile)) {
  fs.openSync(errorLogFile, 'w');
}

// Log an error message to the error log file
const errorMessage = 'An error occurred';
fs.appendFileSync(errorLogFile, `${errorMessage}\n`);

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))