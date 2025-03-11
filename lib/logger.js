const fs = require('fs');
const path = require('path');

// Ensure that the logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, 'error.log');

function logError(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n`;
    console.error(logMessage);
    fs.appendFile(logFile, logMessage, (err) => {
        if (err) {
            console.error("Could not write error to log file", err);
        }
    });
}

function logWarning(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARNING: ${message}\n`;
    console.warn(logMessage);
    fs.appendFile(logFile, logMessage, (err) => {
        if (err) {
            console.error("Could not write warning to log file", err);
        }
    });
}

module.exports = { logError, logWarning };
