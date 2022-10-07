var year = 2001
var day = 01
var month = "Nov"

step1 = 1; //2001 - 2000 = 1
step2 = parseInt(step1/4); //parseInt(step1/4)
step3 = step1 + step2; // 1 + 0 = 1
step4 = 3;
step6 = step3 + step4 // 3 + 1 = 4
step7 = day + step6 // 1 + 4 = 5
step8 = step7; // 5
step9 = step8 - 1 // 5 - 1 = 4

console.log(step9);

