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
products.forEach( (prod,i) => {prod.total_sold = 0});

//Taken from Server Side Processing Lab Ex6 Task 2
app.use(express.urlencoded({ extended: true }));
app.post('/process_form', function (request, response) {
   console.log(request.body);
//Check if the quantities are valid
var haserrors = false;
var hasquantities = false;

for(let i in products){
   let q = request.body["quantity" + i];
   //Check if all values are NonNegInt or Quantities
   haserrors = haserrors || (NonNegInt (q) == false);
   //Check if quantites asked for are available
   haserrors = haserrors || (q > products[i].quantity_available);
   //Check if quantity > 0
   hasquantities = hasquantities || (q > 0);
   console.log(hasquantities, haserrors);
}

//Check if any quantities were selected
haserrors = haserrors || (hasquantities == false)




//if there are no errors, then redirect to invoice with the quantities desired
var qstring = qs.stringify(request.body);
if(haserrors == false){
   response.redirect("./invoice.html?" + qstring);
}
else{
   response.redirect("./products_display.html?" + qstring)
}







    });

   
app.get('/test', function (request, response, next) {
    response.send(request.method + ' to paths ' + request.path);
});

app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

function NonNegInt(arrayElement, returnErrors = false) {
   errors = []; // assume no errors at first
   if(arrayElement == "") {
      arrayElement = 0;
   }
   if (Number(arrayElement) != arrayElement) errors.push('Not a number!'); // Check if string is a number value
   if (arrayElement < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(arrayElement) != arrayElement) errors.push('Not an integer!'); // Check that it is an integer

   return (returnErrors ? errors : (errors.length == 0));
}
