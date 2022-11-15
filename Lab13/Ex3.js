var express = require('express');
var app = express();
const fs = require('fs');

var filename = 'user_data.json';

if (fs.existsSync(filename)) {
    var data = fs.readFileSync(filename, 'utf-8');
    var users = JSON.parse(data);

    var file_stats = fs.statSync(filename);

} else {
    console.log(`${filename} doesn't exist :(`);
}

app.use(express.urlencoded({ extended: true })); // we want to decode the body of a POST

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST"> 
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 }); //the blank ("") action means that it is self-processing. Therefore, if you change the path from login to process_login, the POST will still work

app.post("/login", function (request, response) {
    console.log(request.body);
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    login_username = request.body.username;
    login_password = request.body.password;

    if (typeof users[login_username] != 'undefined') {
        //username exists so get stored password and check if it is correct
        if (users[login_username].password == login_password) {
            response.send(`${login_username} is logged in`);
            return;
        } else {
        response.send(`Incorrect password for ${login_username}</br>${str}`)
        } 
    }
    else {
        response.send(`${login_username} does not exist</br>${str}`);
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));
