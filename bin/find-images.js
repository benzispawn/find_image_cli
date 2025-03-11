#!/usr/bin/env node

const { findImages } = require('../lib/findImages');
const path = require('path');
const { logError } = require('../lib/logger');

// Get target directory from command-line arguments or use current working directory
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
console.log(`Searching for images in: ${targetDir}`);

try {
    const images = findImages(targetDir);
    if (images.length > 0) {
        console.log('Found images:');
        images.forEach(image => console.log(image));
    } else {
        console.log('No image files found.');
    }
} catch (err) {
    logError(`Critical error: ${err.message}`);
    process.exit(1);
}
