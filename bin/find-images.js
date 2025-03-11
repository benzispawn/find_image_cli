#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of valid image file extensions
const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

/**
 * Recursively searches the given directory for image files.
 * @param {string} dir - The directory to search.
 * @param {string[]} images - Accumulator for found image file paths.
 * @returns {string[]} - List of found image file paths.
 */
function findImages(dir, images = []) {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        console.error(`Error reading directory: ${dir}`, err);
        return images;
    }

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (err) {
            console.error(`Error getting stats for file: ${fullPath}`, err);
            return;
        }

        if (stat.isDirectory()) {
            findImages(fullPath, images);
        } else if (stat.isFile() && validExtensions.includes(path.extname(file).toLowerCase())) {
            images.push(fullPath);
        }
    });
    return images;
}

// Get target directory from command-line arguments or use current working directory
const targetDir = process.argv[2] || process.cwd();
console.log(`Searching for images in: ${targetDir}`);

const images = findImages(targetDir);
if (images.length > 0) {
    console.log('Found images:');
    images.forEach(image => console.log(image));
} else {
    console.log('No image files found.');
}
