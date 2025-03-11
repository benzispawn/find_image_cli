const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { logError, logWarning } = require('../lib/logger');

describe('Logger Module', () => {
    const logFile = path.join(__dirname, '../logs/error.log');

    // Before each test, clear the log file if it exists
    beforeEach(() => {
        if (fs.existsSync(logFile)) {
            fs.unlinkSync(logFile);
        }
    });

    it('should log a warning message to the log file', (done) => {
        const warningMsg = "Test warning message";
        logWarning(warningMsg);

        // Wait briefly for the asynchronous file write to complete
        setTimeout(() => {
            const content = fs.readFileSync(logFile, 'utf8');
            expect(content).to.include(`WARNING: ${warningMsg}`);
            done();
        }, 100);
    });

    it('should log an error message to the log file', (done) => {
        const errorMsg = "Test error message";
        logError(errorMsg);

        // Wait briefly for the asynchronous file write to complete
        setTimeout(() => {
            const content = fs.readFileSync(logFile, 'utf8');
            expect(content).to.include(`ERROR: ${errorMsg}`);
            done();
        }, 100);
    });
});
