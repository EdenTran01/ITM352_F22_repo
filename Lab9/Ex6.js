var attributes  =  "Eden;20;20.5;19.5";
var pieces = attributes.split(';');

pieces.forEach(checkIt);

function isStringNonNegInt(q, returnErrors=false) {
    //this function checks if the string is a positive output
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer    


return (returnErrors ? errors:(errors.length ==0));
}

function checkIt(item,index){
    console.log(`part ${index} is ${(isStringNonNegInt(item)?'a':'not a')} quantity`);
}