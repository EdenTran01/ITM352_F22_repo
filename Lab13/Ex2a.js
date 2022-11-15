const fs = require('fs');

var filename = 'user_data.json';

if (fs.existsSync(filename)) {
    var data = fs.readFileSync(filename, 'utf-8');
    var users = JSON.parse(data);
    if (typeof users["dport"] != 'undefined') {
    console.log(users["dport"]["password"]);
    }
} else {
    console.log(`${filename} does not exist!`);
}