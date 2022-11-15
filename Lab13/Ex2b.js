const fs = require('fs');

var filename = 'user_data.json';

if (fs.existsSync(filename)) {
    var data = fs.readFileSync(filename, 'utf-8');
    var user_data_obj = JSON.parse(data);
    var file_stats = fs.statSync(filename);

    console.log(`${filename} has ${file_stats.size} characters`);
} else {
    console.log(`${filename} doesn't exist`);
}