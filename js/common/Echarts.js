import {Component} from 'react';
import {ScreenWidth,ScreenHeight} from "./ScreenUtil";

const options = {
    // /饼图基本配置
    pie: {
        title: {text: ''},
        tooltip: {},
        legend: {
            //orient: 'vertical',
            x: 'right',
            y:'top',
            width:5,
            itemGap:20,
            itemWidth:8,
            itemHeight:8,
            formatter:function(name){
                // let array = name.split('/',2);
                // if(array.length > 1 )return array[0]+'\n'+array[1];
                // else return array[0];
                // // let result = name+"\n456";
                return name;
            },
            data:[],
            textStyle:{
                color:'#999999',
                fontSize:11
            }
        },
        // calculable : false,
        series: [{
            //name: '销量',
            type: 'pie',
            hoverAnimation:false,//点击item是否突出
            radius:['35%',50],//设置环形图展示半径空心圆形
            avoidLabelOverlap:true,
            center:[60,'50%'],//圆心坐标
            label:{
                normal:{
                    show:false,
                    position:'center'
                },
                emphasis: {  //设置点击展示环形图内部文本样式
                    show: true,
                    textStyle: {
                        color:'#848484',
                        fontSize: 22,
                        //fontWeight: 'bold'
                    }
                }
            },
            labelLine:{
                normal:{
                    show:true
                }
            },
            data: [],
        }],
        color:['#21c3ff','#ff8518','#f7cf53','#59d278']
    },
    // 柱形图基本配置
    bar:{
        //title:{text:''},//图表标题
        //点击某一点数据的时候，显示出悬浮窗
        tooltip:{
            trigger:'axis',
            showDelay : 1000, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
        //手动选择实现几个图标
        legend:{
            //show:false,
            x: 'right',
            y:'top',
            width:175,
            itemWidth:8,
            data:[],
            textStyle:{
                color:'#333333',
                fontSize:12,
            }
        },
        grid:{
            bottom: 30,
            width:270,
        },
        xAxis:[
            {
                show:true,
                //position:'top',
                //offset:'0',
                boundaryGap:true,
                type:'category',
                name:'',
                data:[],
                axisLine:{
                    show:true,
                    lineStyle:{
                        color:'#dcdcdc',
                    }
                    //onZero:false,
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    show:true,
                    textStyle: {
                        color:'#999999',
                        fontSize: 12,
                        //fontWeight: 'bold'
                    }
                }
            }
        ],
        yAxis:[
            {
                type:'value',
                name:'',//坐标轴名称
                //nameLocation:'end',//坐标轴名称位置(start middle center end)
                nameTextStyle:{
                    color:'#999',
                    fontSize:12
                },
                axisLine:{
                    show:false,
                    lineStyle:{
                        color:'#dcdcdc'
                    }
                },
                axisTick:{
                    show:false
                },
                min:0,
                splitLine:{
                    show:true,//是否显示分隔线
                },
                // max:150,
                splitNumber:3,
                axisLabel:{
                    show:true,
                    textStyle: {
                        color:'#999999',
                        fontSize: 12,
                    }
                }
            }
        ],
        series:[],
        color:['#21c2fd','#ff8518','#f7cf53','#59d278'],
    },
    // 折线图基本配置
    line:{
        //title:{text:''},//图表标题
        //点击某一点数据的时候，显示出悬浮窗

        tooltip:{
            trigger:'axis',
            position: ['40%', '40%'],
            formatter:function(data){
                var obj=eval(data[0]);
                var str = data[0].name ;

                str += "</br><font color="+data[0].color+">权益</font>("+ obj.value+")"  ;
                str += "</br><font color="+data[1].color+"   >盈亏</font>("+ data[1].value+")"  ;
                return str;
            },
            // showDelay : 1000, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
        //可以手动选择实现几个图标
        legend:{
            //show:false,
            x: 'center',
            y:'top',
            left:245,
            width:150,
            itemWidth:8,
            data:[],
            formatter:function(name) {
                return name;
            },//格式显示的字条
            textStyle:{
                color:'#333333',
                fontSize:12,
            }
        },
        grid:{
            x:50,
            y:35,
            borderWidth:0
        },
        xAxis:[
            {
                //position:'top',
                //offset:'0',
                boundaryGap:false,
                type:'category',
                name:'',
                data:[],

                axisLine:{
                    show:true,
                    lineStyle:{
                        color:'#dcdcdc'
                    },
                },
                axisTick:{
                    show:false,
                },
                axisLabel:{
                    show:true,
                    textStyle: {
                        color:'#999999',
                        fontSize: 11
                    },
                }
            }
        ],
        yAxis:[
            {
                type:'value',
                name:'',
                nameTextStyle:{
                    color:'#999'
                },
                axisLine:{
                    show:true,
                    lineStyle:{
                        color:'#dcdcdc'
                    }
                },
                splitNumber:1,
                splitLine: {     //网格线
                    show: false
                },
                axisTick:{       //y轴刻度线
                    show:false
                },
                axisLabel:{
                    show:true,
                    textStyle: {
                        color:'#999999',
                        fontSize: 11
                    },
                }
            }
        ],
        series:[],
        color:['#21c3ff','#ff8518','#f7cf53','#59d278' ],
    },
}

//显示列表
const legendData = (data) => {
    return data.map((item,i)=>{
        return {name:item.name,icon:'circle'};
    })
}

//对饼图进行封装
const getPieOption = (pieData) => {
    let option =  options.pie;
    option.series[0].data = pieData;
    option.legend.data = legendData(pieData);
    return option;
}

//对柱形图进行封装
const getBarOption = (barData) => {
    let option = options.bar;
    option.legend.data = legendData(barData.values);
    option.xAxis[0].data = barData.x;//设置x轴坐标
    // option.yAxis[0].max = barData.y.max;//设置y轴最大刻度
    option.series = barData.values.map((item,i)=>{
        return {
            name:item.name,
            type:'bar',
            data:item.datas,
            barWidth:10,//柱图宽度
            barCateGoryGap:10,//条间距离
            itemStyle:{normal:{barBorderRadius:[5,5,0,0],},}
        };
    })

    return option;
}

//对折线图进行封装
const getLineOption = (lineData) => {
    let option =options.line;
    option.legend.data = legendData(lineData.values);
    option.xAxis[0].data = lineData.x;//设置x轴坐标
    option.yAxis[0].min=lineData.ymin,
        option.yAxis[0].max=lineData.ymax,
        option.yAxis[0].name=lineData.yname,
        option.series = lineData.values.map((item,i)=>{
            return {
                name:item.name,
                type:'line',
                stack:'',
                data:item.datas,
                symbol:"none",
                itemStyle: {
                    normal: {
                        lineStyle: {            // 系列级个性化折线样式，横向渐变描边
                            width: 2,

                            shadowColor : 'rgba(0,0,0,0.5)',
                            shadowBlur: 10,
                            shadowOffsetX: 5,
                            shadowOffsetY: 5
                        }
                    }

                },


            };
        })

    return option;
}

export {getPieOption,getBarOption,getLineOption};