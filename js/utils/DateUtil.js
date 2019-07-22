import moment from "moment";

//一天的毫秒数
var millisecond=1000*60*60*24;

//当前日期
var now = new Date();
//今天本周的第几天
var nowDayOfWeek = now.getDay();
//当前日
var nowDay = now.getDate();
//当前月
var nowMonth = now.getMonth();
//当前年
var nowYear = now.getYear();
nowYear += (nowYear < 2000) ? 1900 : 0;

//上月日期
var lastMonthDate = new Date();
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

/**
 * 日期格式
 * format
 */
export const formatDate = (date,format) => {
    return moment(date).format(format);
}

//获得某月的天数
function getMonthDays(myMonth){
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    return days;
}

//获得本季度的开始月份
function getQuarterStartMonth(){
    var quarterStartMonth = 0;
    if(nowMonth<=2){
        quarterStartMonth = 0;
    }
    if(2<nowMonth && nowMonth<=5){
        quarterStartMonth = 3;
    }
    if(5<nowMonth && nowMonth<=8){
        quarterStartMonth = 6;
    }
    if(nowMonth>8){
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}

//获得今天的开始时间
export const getTodayStartDate = () => {
    return formatDate(now,'YYYY-MM-DD')+' 00:00:00';
}

//获得今天的结束时间
export const getTodayEndDate = () => {
    return formatDate(now,'YYYY-MM-DD')+' 23:59:59';
}

//获得昨天的开始时间
export const getYesterdayStartDate = () => {
    return formatDate(new Date(now.getTime()-millisecond),'YYYY-MM-DD')+' 00:00:00';
}

//获得昨天的结束时间
export const getYesterdayEndDate = () => {
    return formatDate(new Date(now.getTime()-millisecond),'YYYY-MM-DD')+' 23:59:59';
}

//获得本周的开始时间
export const getCurrentWeekStartDate = () => {
    //减去的天数
    var minusDay=nowDayOfWeek!=0?nowDayOfWeek-1:6;
    //获得当前周的第一天
    var startDate=new Date(now.getTime()-(millisecond*minusDay));
    return formatDate(startDate,'YYYY-MM-DD')+' 00:00:00';
}

//获得本周的结束时间
export const getCurrentWeekEndDate = () => {
    //减去的天数
    var minusDay=nowDayOfWeek!=0?7-nowDayOfWeek:6;
    //获得当前周的第一天
    var endDay=new Date(now.getTime()+(millisecond*(7-nowDayOfWeek)));
    return formatDate(endDay,'YYYY-MM-DD')+' 23:59:59';
}

//获得上周的开始时间
export const getLastWeekStartDate = () => {
    //减去的天数
    var minusDay=nowDayOfWeek!=0?nowDayOfWeek-1:6;
    //获得当前周的第一天
    var currentWeekDayOne=new Date(now.getTime()-(millisecond*minusDay));
    //上周最后一天即本周开始的前一天
    var lastWeekEndDay=new Date(currentWeekDayOne.getTime()-millisecond);
    //上周的第一天
    var lastWeekStartDay=new Date(lastWeekEndDay.getTime()-(millisecond*6));

    return formatDate(lastWeekStartDay,'YYYY-MM-DD')+' 00:00:00';
}

//获得上周的结束时间
export const getLastWeekEndDate = () => {
    //减去的天数
    var minusDay=nowDayOfWeek!=0?nowDayOfWeek-1:6;
    //获得当前周的第一天
    var currentWeekDayOne=new Date(now.getTime()-(millisecond*minusDay));
    //上周最后一天即本周开始的前一天
    var lastWeekEndDay=new Date(currentWeekDayOne.getTime()-millisecond);

    return formatDate(lastWeekEndDay,'YYYY-MM-DD')+' 23:59:59';
}

//获得本月的开始时间
export const getCurrentMonthStartDate = () => {
    var startDate = new Date(nowYear, nowMonth, 1);
    return formatDate(startDate,'YYYY-MM-DD')+' 00:00:00';
}

//获得本月的结束时间
export const getCurrentMonthEndDate = () => {
    var endDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(endDate,'YYYY-MM-DD')+' 23:59:59';
}

//获得上月开始时间
export const getLastMonthStartDate = () =>{
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate,'YYYY-MM-DD')+' 00:00:00';
}

//获得上月结束时间
export const getLastMonthEndDate = () =>{
    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate,'YYYY-MM-DD')+' 23:59:59';
}

//获得本季度的开始时间
export const getCurrentQuarterStartDate = () =>{
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    return formatDate(quarterStartDate,'YYYY-MM-DD')+' 00:00:00';
}

//获得本季度的结束时间
export const getCurrentQuarterEndDate = () =>{
    var quarterEndMonth = getQuarterStartMonth() + 2;
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return formatDate(quarterStartDate,'YYYY-MM-DD')+' 23:59:59';
}

//获得上季度的开始时间
export const getLastQuarterStartDate = () =>{
    //var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    //return formatDate(quarterStartDate,'YYYY-MM-DD');
    return null;
}

//获得上季度的结束时间
export const getLastQuarterEndDate = () =>{
    // var quarterEndMonth = getQuarterStartMonth() + 2;
    // var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    // return formatDate(quarterStartDate,'YYYY-MM-DD');
    return null;
}

//获得本年的开始时间
export const getCurrentYearStartDate = () =>{
    return nowYear+'-01-01 00:00:00';
}

//获得本年的结束时间
export const getCurrentYearEndDate = () =>{
    var quarterEndMonth = getQuarterStartMonth() + 2;
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return nowYear+'-12-31 23:59:59';
}

