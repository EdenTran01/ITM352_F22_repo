require ("./products_data.js");
var num_products = 5;
var prod_num = 0;
while( prod_num++ <= num_products/2) {
    console.log(` ${prod_num}${eval('name' + prod_num )}`);
}
console.log(`That's all we have!`);

// require ("./products_data.js");
// var num_products = 5;
// var prod_num = 1;
// while( prod_num <= num_products) {
    // console.log(` ${prod_num}${eval('name' + prod_num )}`);
    // prod_num++;
// }
// console.log(`That's all we have!`);