var attributes  =  "Eden;20;20.5;19.5" ;
var pieces = attributes.split(';');
for(let part in pieces) {
    console.log(`${pieces[part]} is type ${typeof part}`);
}
console.log(pieces.join(','))