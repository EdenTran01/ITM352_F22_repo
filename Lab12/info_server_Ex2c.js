var express = require('express');
var app = express();
const querystring = require('node:querystring');
var products = require("./product_data.json");

app.use(express.urlencoded({ extended: true }));

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.get("/product_data.js", function (request, response, next) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

app.post('/process_form', function (request, response, next) {
    console.log(request.body);
    var q;
    var has_quantities = false;
    var errors = {};
    for (let i in products) {
        q = request.body['quantity' + i];
        if (typeof q != 'undefined') {
            console.log(q);
            // check if there are quanties selected
            if(q>0) {
                has_quantities = true;
            }
            // check if valid qty
            if(isNonNegInt(q,false) == false) {
                errors['quantity_error'+i] = isNonNegInt(q,true);
            }

            // response.send(`Thank you for purchasing ${q} things!`);
        }
    }
    // it's an error not to select any quantities
    if(has_quantities == false) {
        errors['no_selections_error'] = "You need to select some items!";
    }
    // if no errors, go to invoice, o/w go back to products_display
    if (Object.keys(errors).length == 0) {
        response.redirect("./invoice.html?" + querystring.stringify(request.body));
    } else {
        response.redirect("./products_display.html?" + querystring.stringify(request.body) + '&' + querystring.stringify({"errors_obj_JSON": JSON.stringify(errors)}));
    }
});

app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

function isNonNegInt(q, returnErrors = false) {
    let errors = []; // assume no errors at first
    if(q == '') {q = 0}
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    }
    return returnErrors ? errors : (errors.length == 0);
} 