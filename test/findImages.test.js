const fs = require('fs');
const path = require('path');
const os = require('os');
const { expect } = require('chai');
const { findImages, validExtensions } = require('../lib/findImages');

describe('findImages', () => {
    const tmpDir = path.join(os.tmpdir(), 'find-images-test');

    // Before tests, create a temporary directory structure
    before(() => {
        // Create temporary directory
        fs.mkdirSync(tmpDir, { recursive: true });

        // Create some dummy image files
        validExtensions.forEach((ext, index) => {
            fs.writeFileSync(path.join(tmpDir, `image${index + 1}${ext}`), 'dummy content');
        });

        // Create a non-image file
        fs.writeFileSync(path.join(tmpDir, 'document.txt'), 'dummy text');

        // Create a subdirectory with an image
        const subDir = path.join(tmpDir, 'subdir');
        fs.mkdirSync(subDir, { recursive: true });
        fs.writeFileSync(path.join(subDir, 'photo.png'), 'dummy image content');
    });

    // After tests, clean up temporary directory
    after(() => {
        function deleteFolderRecursive(directory) {
            if (fs.existsSync(directory)) {
                fs.readdirSync(directory).forEach((file) => {
                    const curPath = path.join(directory, file);
                    if (fs.lstatSync(curPath).isDirectory()) {
                        deleteFolderRecursive(curPath);
                    } else {
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(directory);
            }
        }
        deleteFolderRecursive(tmpDir);
    });

    it('should find all image files in the directory recursively', () => {
        const results = findImages(tmpDir);
        // We expect to find the number of dummy image files we created (including the one in the subdirectory)
        // validExtensions.length image files in the root plus 1 in subdirectory
        expect(results).to.have.length(validExtensions.length + 1);

        // Check that a non-image file is not included
        results.forEach(filePath => {
            expect(path.extname(filePath)).to.satisfy(ext => validExtensions.includes(ext));
        });
    });
});
