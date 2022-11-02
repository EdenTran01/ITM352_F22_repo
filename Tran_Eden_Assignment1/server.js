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
var errors = {}; //For Line 52, Look at GITHUB Professor PORT
var q;

for(let i in products){
   let q = request.body["Quantity" + i];
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

// Check if qty is valid
if(NonNegInt(q,false) == false) {
   errors['quantity_error'+i] = NonNegInt(q,true);
}
    
// it's an error not to select any quantities
    if(hasquantities == false) {
      errors['no_selections_error'] = "You need to select some items!";
  }

//if there are no errors, then redirect to invoice with the quantities desired
var qstring = qs.stringify(request.body);
if(Object.keys(errors).length == 0){
   response.redirect("./invoice.html?" + qstring);
}
else{
   response.redirect("./products_display.html?" + qstring + '&' + querystring.stringify({"errors_obj_JSON": JSON.stringify(errors)}))

}
 });



app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback


function NonNegInt(q, returnErrors = false) {
   let errors = []; // assume no errors at first
   if(q == "") {
      q = 0;
   } // empty string = 0
   if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

   return (returnErrors ? errors : (errors.length == 0));
}



