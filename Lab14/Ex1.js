var fs = require('fs');
var express = require('express');
var app = express();
const CookieParser = require('cookie-parser');

var filename = __dirname + '/user_data.json';
// var users_reg_data = require(filename);
if(fs.existsSync(filename)) {
    var file_stats = fs.statSync(filename);
    console.log(`user_data.json has ${file_stats.size} characters`);
    var data =  fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(data);
    
    console.log(users_reg_data["kazman"]['password']);
} else {
    console.log(`${filename} does not exist!`);
}

app.all("*", function (request, response, next) {
    console.log(request.method, request.path);
    next();
 });
 

app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());

app.get("/set_cookie", function (request, response) {
    // Give a cookie 
    var myName = "Dan";
    response.cookie('username', myName,  {"maxAge": 5000});
    response.send('The cokkie has been set');
 });

 app.get("/use_cookie", function (request, response) {
    console.log(request.cookies);
    // Get the username cookie 
    // if(typeof requ)
    response.send(`Welcome to the Use Cookie page ${request.cookies['username']}`);

 });


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
 });

app.post("/login", function (request, response) {
    console.log(request.body);
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    // check if udername exists
    var username_entered = request.body['username'];
    var password_entered = request.body['password'];
    var resp_msg = "";
    var error = false;
    if(typeof users_reg_data[username_entered] != 'undefined') {
            // check if password entered matched saved password
            if(password_entered == users_reg_data[username_entered].password) {
                resp_msg = `${username_entered} is logged in.`;
            } else {
                resp_msg = `Incorrect password!`;
                error = true;
            }

    } else {
        resp_msg = `${username_entered} does not exist!`;
        error = true;
    }
    if(!error) {
       response.send(resp_msg); 
    } else {
        response.redirect(`./Login?error=${resp_msg}`);
    }
    

});

app.listen(8080, () => console.log(`listening on port 8080`));