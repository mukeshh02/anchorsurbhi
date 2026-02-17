const Jimp = require('jimp');
const img = process.argv[2];
if (!img) process.exit(1);

Jimp.read(img)
    .then(image => {
        console.log(`Resizing ${img}...`);
        return image.resize(1200, Jimp.AUTO).quality(75).writeAsync(img);
    })
    .then(() => {
        console.log(`DONE: ${img}`);
        process.exit(0);
    })
    .catch(err => {
        console.error(`ERROR: ${img} - ${err.message}`);
        process.exit(1);
    });
