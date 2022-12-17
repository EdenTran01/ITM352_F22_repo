//Author: Eden Tran
//Taken from Eden Tran Github Spring 2022 info_server_Ex5.js
var express = require('express');
var app = express();
var qs = require("querystring");

var session = require('express-session');
app.use(session({ secret: "MySecretKey", resave: true, saveUninitialized: true }));

app.use(express.urlencoded({ extended: true }));

// Stores user information, Code taken from Port's examples
var fs = require('fs');
var filename = __dirname + '/user_data.json';

//used to store quantity data from products disiplay page
//assume empty at first
var current_users = {};

// Create an object to keep count of how many users are logged in
var status = [];

if (fs.existsSync(filename)) {
   // Code taken from Lab13 Exercise 3a
   var user_info = fs.readFileSync(filename, 'utf-8');
   //parse user_data
   var user_data = JSON.parse(user_info);


} else {
   console.log(filename + ' does not exist.');
   user_data = {};
}

//respond to any req for any path
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   //Taken from Assignment 3 Code Class Example
   if (typeof request.session.cart == 'undefined') {
      request.session.cart = {};
      for (let pkey in allproducts) {
         request.session.cart[pkey] = Array(allproducts[pkey].length).fill(0);
      }

   }
   console.log(request.session.cart);
   next();
});
//products data from json file and stores it
var allproducts = require(__dirname + '/products.json');

//monitor requests
app.get("/products_data.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var allproducts = ${JSON.stringify(allproducts)}`;
   response.send(products_str);
});


//Cart Add
//Taken from Assignment 3 Eden Tran Spring Github
app.post("/get_cart", function (request, response) {
   response.json(request.session.cart);
}
);

//monitor requests
//IR5 Assignment 2
app.get("/current_users", function (request, response, next) {
   response.type('.js');
   var current_users_str = `var current_users = ${JSON.stringify(current_users)};`;
   response.send(current_users_str);
});

//monitors requests and sends user data to check if the user has logged in successfully
//if successful, stores the user data into query string and displays it on invocie page
app.get("/invoice.html", function (request, response, next) {
   if (typeof request.query['email'] != 'undefined') {
      if (user_data[request.query['email']].loggedin == true) {
         next();
         return;
      }


   }
   //redirects to login if login information is not valid/true
   response.redirect("./login.html?" + qs.stringify(request.query));
});



//Taken from Server Side Processing Lab Ex6 Task 2
app.use(express.urlencoded({ extended: true }));
app.post('/addtocart', function (request, response) {
   console.log(request.body);
   //Check if the quantities are valid
   var haserrors = false;
   var hasquantities = false;
   var prod_key = request.body.prod_key

   for (let i in allproducts[prod_key]) {
      let q = request.body["Quantity" + i];

      //Check if quantity > 0
      hasquantities = hasquantities || (q > 0);

      //Check if q is a NonNegInt
      haserrors = haserrors || (NonNegInt(q) == false);

      //Check if quantites asked for are available inlcuding what is avialable in their cart
      haserrors = haserrors || (Number(q) + request.session.cart[prod_key][i] > allproducts[prod_key][i].quantity_available);
   }

   //Code taken from Lab 12 Ex5
   if (!haserrors) {
      if (hasquantities == true) {
         //Will direct user to login if quantity input is valid 
         //Referenced from Lab 12
         //Remove item sold from inventory

         //add selected items to cart in session
         for (let i in allproducts[prod_key]) {
            request.session.cart[prod_key][i] += Number(request.body["Quantity" + i]);
         }
         response.redirect("./cart.html?" + qs.stringify(request.body));
      } else {
         //User will be kept on the page if the input is invalid
         response.redirect("./products_display.html?" + qs.stringify(request.body) + `&error=Please select some items`);

      }
   }
   else {
      //User will be kept on the page if the input is invalid
      response.redirect("./products_display.html?" + qs.stringify(request.body) + `&error=Please enter a proper quantity`);
   }

});

app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback


function NonNegInt(q, returnErrors = false) {
   let errors = []; // assume no errors at first
   if (q == "") {
      q = 0;
   } // empty string = 0
   if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

   return (returnErrors ? errors : (errors.length == 0));
}



//---------------------Log-in---------------------//

//Taken from Assignment 2 code examples and from Eden Tran's Spring 2022 Github
app.post("/login", function (request, response) {

   //Process login form POST and redirect to logged in page if ok, back to login page if not
   //Make it so capitalization is irrelevant for email
   let login_email = request.body['email'].toLowerCase();
   let login_password = request.body['password'];

   //Check if email exists
   if (typeof user_data[login_email] != 'undefined') {
      //Checks password entered matches stored password
      if (user_data[login_email].password == login_password) {

         //stores under info with in temp_info and sends to the invoice
         request.query['email'] = login_email;

         // If the user's current status is "loggedout", change it to "loggedin" and pushed to status array
         current_users[login_email] = true;
         request.query['name'] = user_data[login_email].name;

         user_data[login_email].loggedin = true;

         // Send to invoice page if login successful
         response.redirect('/products_display.html?' + qs.stringify(request.query));
         // ends process
         return;
         // if the password does not match the password entered then error message for wrong password
      } else {

         //Redirects to the invoice page and displays items purchased
         request.query['email'] = login_email;
         request.query.LoginError = 'Invalid password!';
      }
   } else {
      // Error message for user that doesn't exist
      request.query.LoginError = 'Invalid username!';
   }

   //If there are errors, send back to login page with errors
   request.query['email'] = login_email;
   response.redirect(`./login.html?` + qs.stringify(request.query));
});

//---------------------Registration---------------------//

app.post("/register", function (request, response) {
   var errors = [];
   let email = request.body['email'].toLowerCase();
   let name = request.body['name'];

   //Process a simple register form
   //capitalization becomes irrelevant for email
   var new_email = request.body['email'].toLowerCase();

   //Require a specific email format
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email) == false) {
      errors.push('Please enter a valid email address');
   } else if (request.body.email.length == 0) {
      errors.push('Please enter an email');
   }

   //if a user's email is not undefined meanning that it is already declared, this error will display
   if (typeof user_data[new_email] != 'undefined') {
      errors.push('Email is already taken.');
   }

   //Name Check
   if (typeof request.body.name != 'undefined') {
      if (/^[A-Za-z ]+$/.test(request.body.name) == false) {
         errors.push('Please enter a valid name.');
      }
   } else if (request.body.name.length == 0) {
      errors.push('Please enter a name.');
   }

   //if a user's password does not have at least 10 characters, this error will display
   if (request.body.new_password.length < 10) {
      errors.push('Password must have a minimum of 10 characters.');
   }

   //if a user's password and repeat password do not match, this error will display
   if (request.body.new_password !== request.body.repeat_password) {
      errors.push('Passwords must match');
   }

   let params = new URLSearchParams(request.query);

   //If errors is empty
   if (JSON.stringify(errors) == '[]') {
      //Write data and send to invoice.html
      user_data[new_email] = {};
      user_data[new_email].name = request.body.name;
      user_data[new_email].password = request.body.new_password;
      user_data[new_email]['status'] = "loggedin"

      //Writes user information into file
      fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");

      //Add email to query
      params.append('email', request.body.email);
      response.redirect('./login.html?' + params.toString());
      return;
   }
   else {
      //If there are errors, send back to register page with errors
      request.query['email'] = email;
      request.query['name'] = name;
      request.query['errors'] = JSON.stringify(errors);
      response.redirect(`./registration.html?` + qs.stringify(request.query));
   }
});

//--------------------Password Change--------------------//
app.post("/updatepwd", function (request, response) {
   var errors = [];

   //Process login form POST and redirect to logged in page if ok, back to login page if not
   //Make it so capitalization is irrelevant for email
   var login_email = request.body['email'].toLowerCase();
   var login_password = request.body['password'];

   //Check if email exists
   if (typeof user_data[login_email] != 'undefined') {
      //Then checks password entered matches stored password
      if (user_data[login_email].password == login_password) {

         //Require a minimum of 8 characters
         if (request.body.new_password.length < 10) {
            errors.push('Password must have a minimum of 8 characters.');
         }

         //Confirm that both passwords were entered correctly
         if (request.body.new_password !== request.body.repeat_new_password) {
            errors.push('Passwords must match');
         }
         if (request.body.new_password == login_password) {
            errors.push('New password cannot be the same as old password');
         }

         if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email) == false) {
            errors.push('Please enter a valid email address');
         } else if (request.body.email.length == 0) {
            errors.push('Please enter an email');
         }

         let params = new URLSearchParams(request.query);

         //If errors is empty
         if (JSON.stringify(errors) == '[]') {
            //Write data and send to invoice.html
            user_data[login_email].password = request.body.new_password;

            //Writes user information into file
            fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");

            //Add email to query
            params.append('email', request.body.email);
            response.redirect('./login.html?' + params.toString());
            return;
         }
      }
      else {
         //If password is incorrect
         errors.push('Incorrect password');
      }
   }
   else {
      //If email has not been created
      errors.push(`${login_email} does not exist`);
   }

   //If there are errors, send back to new password page with errors
   request.query['email'] = login_email;
   request.query['errors'] = JSON.stringify(errors);
   response.redirect(`./updatepwd.html?` + qs.stringify(request.query));
});

//Trashing login in email
app.post('/process_logout', function (request, response) {
   // Get the user's email from the hidden textbox


   /* Deletes all of the info that have been stored in temp_info due to it no longer needed if the user is logged out of the system*/
   delete current_users[request.body['email']];
   //Delete email in the object
   delete status.email
   // Log Out Status
   user_data[request.body['email']].loggedin = false;
   // redirect the user to index if they choose to log out
   response.redirect('/index.html?');


});

//--------------------Cart--------------------//

   app.get("/checkout", function (request, response) {

      for (let i in allproducts) {
         let q = request.body["Quantity" + i];
         var remainder = allproducts[i].quantity_available;
         allproducts[i].quantity_available = remainder - Number(q);             
      }

      //Taken from Assignment 3 Code Examples
      // Generate HTML invoice string
        var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
        var shopping_cart = request.session.cart;
        for(products_key in products_data) {
          for(i=0; i<products_data[products_key].length; i++) {
              if(typeof shopping_cart[producs_key] == 'undefined') continue;
              qty = shopping_cart[products_key][i];
              if(cart[products_key][i] > 0) {
                invoice_str += `<tr><td>${cart[products_key][i]}</td><td>${products_data[products_key][i].model}</td><tr>`;
              }
          }
      }
        invoice_str += '</table>';
      // Set up mail server. Only will work on UH Network due to security restrictions
        var transporter = nodemailer.createTransport({
          host: "mail.hawaii.edu",
          port: 25,
          secure: false, // use TLS
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
          }
        });
      
        var user_email = 'edent@hawaii.edu';
        var mailOptions = {
          from: 'phoney_store@bogus.com',
          to: user_email,
          subject: 'Your phoney invoice',
          html: invoice_str
        };
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            invoice_str += '<br>There was an error and your invoice could not be emailed :(';
          } else {
            invoice_str += `<br>Your invoice was mailed to ${user_email}`;
          }
          response.send(invoice_str);
          // Send to invoice page 
         response.redirect('/invoice.html?' + qs.stringify(request.query));
        });
       
      });
 