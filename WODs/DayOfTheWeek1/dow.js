var month = 'November';
var day = 1;
var year = 2001;

var monthKey= {
    'January'	: 0,
'February'	 : 3,
'March'	: 2,
'April'	 : 5,
'May'	 : 0,
'June'	: 3,
'July'	: 5,
'August'	: 1,
'September' : 4,
'October'	: 6,
'November'	: 2,
'December' : 4
}

var dayKey = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

//Step1
if (month == 'January' || month == 'February') {
    step = year - 1
} else {
    step1 = year
}

step2 = step1 + parseInt(step1/4);
step3 = step2 - parseInt(step1/100);
step4 = step3 + parseInt(step1/400);
step5 = step4 + day;
step6 =step5 + monthKey[month]
step7 = step6 % 7
step8 = dayKey[step7]

console.log(step8)

