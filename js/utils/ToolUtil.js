import Communications from 'react-native-communications';
import forge from 'node-forge';
import moment from "moment";

//md5加密
export const md5 = (str:string) => {
    let md =forge.md.md5.create();
    md.update(str);
    return md.digest().toHex();
}

//打电话
export const phoneCall = (phone) => {
    Communications.phonecall(phone, true);
}

//发短信
export const sendMessage = (phone) => {
    Communications.text(phone);
}

//数字格式化
export const numberFormatter = (number) => {
    return number?("" + number).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,"):0;
}

//科学计数法
export const kxjsf = (number) => {
    var p = Math.floor(Math.log(num)/Math.LN10);
    var n = num * Math.pow(10, -p);
    return n + 'e' + p;
}

//减少月份
export const reduceMonth = (date, num) => {
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
export const len = (s) => {
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

//计算两日期相差的天数
export const daysReduce = (date1,date2) => {
    let days = (new Date(date1)).getTime() - (new Date(date2)).getTime();
    let day = parseInt(days / (1000 * 60 * 60 * 24));
    return day;
}

/**
 * 日期格式
 * format
 */
export const formatDate = (date,format) => {
    return moment(date).format(format);
}

//格式当前周几的日期成星期几
export const formatDateToWeek = (date) => {
    let nowDate = new Date();
    let w = (new Date(nowDate)).getDay();

    let result = date;
    let count = daysReduce(nowDate,date);
    switch (w) {
        case 0:
            if(count <= 7){
                if(count < 3){
                    result = getRecentThree(daysReduce(nowDate,date));
                }else {
                    result = getWeekName(date);
                }
            }
            break;
        case 1:
            if(count <= 6){
                if(count < 3){
                    result = getRecentThree(daysReduce(nowDate,date));
                }else {
                    result = getWeekName(date);
                }
            }
            break;
        case 2:
            if(count <= 5){
                if(count < 3){
                    result = getRecentThree(daysReduce(nowDate,date));
                }else {
                    result = getWeekName(date);
                }
            }
            break;
        case 3:
            if(count <= 4){
                if(count < 3){
                    result = getRecentThree(daysReduce(nowDate,date));
                }else {
                    result = getWeekName(date);
                }
            }
            break;
        case 4:
            if(count <= 3){
                result = getRecentThree(daysReduce(nowDate,date));
            }
            break;
        case 5:
            if(count <= 2){
                result = getRecentThree(daysReduce(nowDate,date));
            }
            break;
        case 6:
            if(count <= 1){
                result = getRecentThree(daysReduce(nowDate,date));
            }
            break;
    }

    return result;
}

export const getRecentThree = (count) => {
    if(count === 0){
        return '今天';
    }else if(count === 1){
        return '昨天';
    }else if(count === 2){
        return '前天';
    }
}

export const getWeekName = (date) => {
    let w = new Date(date).getDay();
    let name = '';
    switch (w) {
        case 0:name = '星期天';break;
        case 1:name = '星期一';break;
        case 2:name = '星期二';break;
        case 3:name = '星期三';break;
        case 4:name = '星期四';break;
        case 5:name = '星期五';break;
        case 6:name = '星期六';break;
    }
    return name;
}