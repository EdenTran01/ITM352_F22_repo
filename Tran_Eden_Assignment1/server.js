//Author: Eden Tran
//Taken from Eden Tran Github Spring 2022 info_server_Ex5.js
var express = require('express');
var app = express();
   
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
app.use(myParser.urlencoded({ extended: true }));
app.post('/process_form', function (request, response) {
   receipt = '';
    let qtys = request.body[`quantity_textbox`];
    for (i in qtys) {
        q = qtys[i];
        let brand = products[i]['model'];
        let brand_price = products[i]['price'];
        if (NonNegInt(q)) {
            products[i]['total_sold'] += Number(q);
            receipt += `<h3>Thank you for purchasing: ${q} ${model}. Your total is \$${q * model_price}!</h3>`; // render template string
        } else {
            receipt += `<h3><font color="red">${q} is not a valid quantity for ${model}!</font></h3>`;
        }
    }});
    response.send(receipt);
    response.end();
   
app.get('/test', function (request, response, next) {
    response.send(request.method + ' to paths ' + request.path);
});

app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

