require("./products_data.js");
var num_products = 5;
var prod_num = 0;
while(prod_num++ < num_products) {
    
    if( (prod_num > num_products*.75) || (prod_num < num_products*.25) ) {
        console.log(`${eval('name' + prod_num )} is sold out!`);
        continue;
    }
    console.log( prod_num);
}

// require ("./products_data.js");
// var num_products = 5;
// var prod_num = 0;
// while( prod_num++ < num_products) {
//    console.log( prod_num );
//    if(prod_num > num_products/2)
//        console.log( `That's Enough`);
//        break
// }
