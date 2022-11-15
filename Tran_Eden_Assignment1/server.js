//Author: Eden Tran
//Taken from Eden Tran Github Spring 2022 info_server_Ex5.js
var express = require('express');
var app = express();
var qs = require("querystring")

app.use(express.urlencoded({ extended: true }));

//respond to any req for any path
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});
//products data from json file and stores it
var products = require(__dirname + '/products.json');

//monitor requests
app.get("/product_data.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});



//to track quantity sold
products.forEach((prod, i) => { prod.total_sold = 0 });

//Taken from Server Side Processing Lab Ex6 Task 2
app.use(express.urlencoded({ extended: true }));
app.post('/process_form', function (request, response) {
   console.log(request.body);
   //Check if the quantities are valid
   var haserrors = false;
   var hasquantities = false;
   var errors = [];


   for (let i in products) {
      let q = request.body["Quantity" + i];
      if (typeof request.body != 'undefined') {
         //Check if quantity > 0
         var hasquantities = hasquantities || (q > 0);
      }
      //Check if all values are NonNegInt or Quantities
      haserrors = haserrors || (NonNegInt(q) == false);
      //Pushes errors into errors array
      errors = NonNegInt(q, true)
      //Check if quantites asked for are available
      haserrors = haserrors || (q > products[i].quantity_available);

      //# of Products that get inputed into textbox get removed from the quantity avaialable
      if (hasquantities == true) {
         if (errors.length == 0) {
            products[i].total_sold = Number(q);
            var remainder = products[i].quantity_available;
            products[i].quantity_available = remainder - Number(q);
         }
      }
   }

   //Check if any quantities were selected
   haserrors = haserrors || (hasquantities == false)

   //Code taken from Lab 12 Ex5
   if (errors.length == 0) {
      if (hasquantities == true) {
         //Will direct user to invoice if quantity input is valid 
         //Referenced from Lab 12
         response.redirect("./invoice.html?" + qs.stringify(request.body));
      } else {
         //User will be kept on the page if the input is invalid
         response.redirect("./products_display.html?" + `&textError=Please enter a valid quantity`);

      }
   }
   else {
      //User will be kept on the page if the input is invalid
      response.redirect("./products_display.html?" + `&error=Please enter a proper quantity`);
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



