var express = require('express');
var app = express();
   
app.use(express.urlencoded({ extended: true }));

//respond to any req for any path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});
//products data from json file and stores it
var products = require(__dirname + '/product_data.json');

//to track quantity sold
products.forEach( (prod,i) => {prod.total_sold = 0});

//monitor requests
app.get("/product_data.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});

app.post('/process_form', function (request, response) {
    let brand = products[0]['brand'];
    let brand_price = products[0]['price']

    var q = request.body['quantity_textbox'];
    if (typeof q != 'undefined') {
        if (isNonNegInt(q)) {
            products[0].total_sold += Number(q);
            response.redirect('receipt.html?quantity=' + q);
        }
        else {
            response.redirect(`order_page.html?error=Invalid%20Quantity&quantity_textbox=' + q`);
        }
    }
});

app.get('/test', function (request, response, next) {
    response.send(request.method + ' to paths ' + request.path);
});

app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

function isNonNegInt(q, returnErrors = false) {
    // Checks if a string q is a non-neg integer. If returnErrors is true, the array of errors is returned.
    // Otherwise returns true if q is non-neg int.
    errors = []; // assume no errors at first
    if (q == '') q = 0;
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
        }

    return returnErrors ? errors : (errors.length == 0);
}