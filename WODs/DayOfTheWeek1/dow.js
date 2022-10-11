day = 01
month = 'November'
year = 2001

monthKey = {
    'January' : 0,
    'February' : 3,
    'March'	:2,
    'April':	5,
    'May'	:0,
    'June'	:3,
    'July'	:5,
    'August'	:1,
    'September'	:4,
    'October'	:6,
    'November'	:2,
    'December'	:4
}

var days = {'Sunday' : 0,'Monday' : 1,'Tuesday' : 2,'Wednesday' : 3,'Thursday' : 4,'Friday' : 5,'Saturday' : 6}

step1 = (month == 'January' || month == 'February') ? (year-1):year;
step2 = parseInt(step1/4) + step1;
step3 = parseInt(step1/100) - step2;
step4 = parseInt(step1/400) + step3;
step5 = step4 + day;
step6 = step5 + monthKey[month];
step7 = step6%7
step8 = days[step7]

console.log(step8)


