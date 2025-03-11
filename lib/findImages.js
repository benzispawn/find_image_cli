const fs = require('fs');
const path = require('path');
const { logError, logWarning } = require('./logger');

const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

/**
 * Recursively searches the given directory for image files.
 * @param {string} dir - The directory to search.
 * @param {string[]} images - Accumulator for found image file paths.
 * @returns {string[]} - List of found image file paths.
 * @throws {Error} If the directory does not exist or cannot be read.
 */
function findImages(dir, images = []) {
    // Check if the directory exists
    if (!fs.existsSync(dir)) {
        throw new Error(`Directory does not exist: ${dir}`);
    }

    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        throw new Error(`Error reading directory "${dir}": ${err.message}`);
    }

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (err) {
            logWarning(`Cannot get stats for file "${fullPath}". Skipping. (${err.message})`);
            return;
        }

        if (stat.isDirectory()) {
            try {
                findImages(fullPath, images);
            } catch (err) {
                logWarning(`Error reading subdirectory "${fullPath}". Skipping. (${err.message})`);
            }
        } else if (stat.isFile() && validExtensions.includes(path.extname(file).toLowerCase())) {
            images.push(fullPath);
        }
    });

    return images;
}

module.exports = { findImages, validExtensions };
