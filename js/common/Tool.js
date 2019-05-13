import Communications from 'react-native-communications';

//打电话
const phoneCall = (phone) => {
    Communications.phonecall(phone, true);
}

//发短信
const sendMessage = (phone) => {
    Communications.text(phone);
}

//数字格式化
const numberFormatter = (number) => {
    return number?("" + number).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,"):0;
}

//科学计数法
const kxjsf = (number) => {
    var p = Math.floor(Math.log(num)/Math.LN10);
    var n = num * Math.pow(10, -p);
    return n + 'e' + p;
}

//减少月份
const reduceMonth = (date, num) => {
    num = parseInt(num);
    var sDate = date;

    var sYear = sDate.getFullYear();
    var sMonth = sDate.getMonth() + 1;
    var sDay = sDate.getDate();

    var eYear = sYear;
    var eMonth = sMonth - num;
    var eDay = sDay;
    while (eMonth < 1) {
        eYear--;
        eMonth = 12;
    }

    var eDate = new Date(eYear, eMonth - 1, eDay);

    return eDate;
};

//示字符的长度，汉字为2，字符为1
const len = (s) => {
    var l = 0;
    var a = s.split("");
    for (var i=0;i<a.length;i++) {
        if (a[i].charCodeAt(0)<299) {
            l++;
        } else {
            l+=2;
        }
    }
    return l;
}



export {len,phoneCall,sendMessage,numberFormatter,kxjsf,reduceMonth}