import {Component} from 'react';
import {pxTodpWidth,pxTodpHeight,ScreenWidth,ScreenHeight} from "./ScreenUtil";

const options = {
  // /饼图基本配置
  pie: {
    title: {text: ''},
    tooltip: {},
    legend: {
      //orient: 'vertical',
      x: 'right',
      y:'top',
      //right:50,
      width:pxTodpWidth(10),
      //height:pxTodpHeight(100),
      itemGap:pxTodpHeight(40),
      itemWidth:pxTodpWidth(15),
      itemHeight:pxTodpHeight(15),
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
        fontSize:pxTodpWidth(22)
      }
    },
    // calculable : false,
    series: [{
      //name: '销量',
      type: 'pie',
      hoverAnimation:false,//点击item是否突出
      radius:['35%',pxTodpWidth(100)],//设置环形图展示半径空心圆形
      avoidLabelOverlap:true,
      center:[pxTodpWidth(120),'50%'],//圆心坐标
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
    //大饼图显示标签设置
  pie_1: {
        title: {text: ''},


        // calculable : false,
        series: [{
            //name: '销量',
            type: 'pie',
            hoverAnimation:false,//点击item是否突出
            radius:['40%',pxTodpHeight(130)],//设置环形图展示半径空心圆形
            avoidLabelOverlap:true,
            center: ['50%', '50%'],

            labelLine:{
                normal:{
                    show:true,
                    length:pxTodpHeight(10),
                    length2:pxTodpHeight(40),
                    lineStyle:{

                        color:'#999999'



                    }
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
      width:pxTodpWidth(350),
      // itemHeight:pxTodpWidth(90),
      itemWidth:pxTodpHeight(15),
      data:[],
      // formatter:function(name) {
      //   return name+"(100)";
      // },//格式显示的字条
      //borderRadius:pxTodpWidth(16),
      textStyle:{
        color:'#333333',
        fontSize:pxTodpWidth(24),
      }
    },
    grid:{
      //top:pxTodpHeight(60),
      //left:40,
      bottom: pxTodpHeight(60),
      width:pxTodpWidth(540),
      // height:pxTodpHeight(100),
      // containLabel:true,
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
            fontSize: pxTodpWidth(24),
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
          fontSize:pxTodpWidth(24)
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
            fontSize: pxTodpWidth(24),
          }
        }
      }
    ],
    series:[],
    color:['#21c2fd','#ff8518','#f7cf53','#59d278'],
  },
    // 柱形图基本配置
  bar_1:{
      //title:{text:''},//图表标题
      //点击某一点数据的时候，显示出悬浮窗
      tooltip:{
          trigger:'axis',
          showDelay : 1000, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      },
      //可以手动选择实现几个图标
      legend:{
          //show:false,
          x: 'right',
          y:'top',
          orient:'vertical',
          align:'left',
          width:pxTodpWidth(300),
          // itemHeight:pxTodpWidth(90),
          itemWidth:pxTodpHeight(15),
          data:[],
          formatter:function(name) {
              return name;
          },//格式显示的字条
          //borderRadius:pxTodpWidth(16),
          textStyle:{
              color:'#333333',
              fontSize:pxTodpWidth(24),
          }
      },
      grid:{
          //top:pxTodpHeight(60),
          left:pxTodpWidth(90),
          bottom: pxTodpHeight(60),
          width:pxTodpWidth(580),
          // height:pxTodpHeight(100),
          // containLabel:true,
      },
      xAxis:[
          {
              //position:'top',
              //offset:'0',
              boundaryGap:true,
              type:'category',
              name:'',
              data:[],
              axisLine:{
                  show:false,
                  //onZero:false,
              },
              axisTick:{
                  show:false,
              },
              axisLabel:{
                  show:true,
                  textStyle: {
                      color:'#999999',
                      fontSize: pxTodpWidth(24),
                      //fontWeight: 'bold'
                  }
              }
          }
      ],
      yAxis:[
          {
              type:'value',
              name:'',
              axisTick:{
                  show:false,
              },
              axisLine:{show:false,},
              min:0,
              max:150,
              splitNumber:3,
              axisLabel:{show:true, textStyle: {color:'#999999', fontSize: pxTodpWidth(24),}}
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
        left:pxTodpWidth(490),
        width:pxTodpWidth(300),
        // itemHeight:pxTodpWidth(90),
        itemWidth:pxTodpHeight(15),
        data:[],
        formatter:function(name) {
            return name;
        },//格式显示的字条
        //borderRadius:pxTodpWidth(16),
        textStyle:{
          color:'#333333',
          fontSize:pxTodpWidth(24),
        }
    },
    grid:{
      x:pxTodpWidth(100),
      y:pxTodpHeight(70),
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
            fontSize: pxTodpWidth(22)
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
            fontSize: pxTodpWidth(22)
          },
        }
      }
    ],
    series:[],
    color:['#21c3ff','#ff8518','#f7cf53','#59d278' ],
  },
  // 折线图基本配置
  line_1:{
    //title:{text:''},//图表标题
    //点击某一点数据的时候，显示出悬浮窗
    tooltip:{
      trigger:'axis',
      position: ['40%', '40%'],
      formatter:function(data){
        console.log('----------->'+JSON.stringify(data));
        var obj=eval(data[0]);
        var str = data[0].name ;

        //forEach(myData:data){
          //str += "</br><font color="+myData.color+"   >盈亏</font>("+ myData.value+")"  ;
        //}
        return str;
      },
      // showDelay : 1000, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
    },
    //可以手动选择实现几个图标
    legend:{
      x: 'right',
      y:'top',
      itemWidth:pxTodpHeight(15),
    },
    grid:{
      x:pxTodpWidth(150),
      y:pxTodpHeight(70),
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
            fontSize: pxTodpWidth(22)
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
            fontSize: pxTodpWidth(22)
          },
        }
      }
    ],
    series:[],
    color:['#21c3ff','#ff8518','#f7cf53','#59d278' ],
  }
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

//对饼图进行封装
const getPieOption_1 = (pieData) => {
    let option =  options.pie_1;
    option.series[0].data = pieData;

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
      barWidth:pxTodpWidth(20),//柱图宽度
      barCateGoryGap:pxTodpWidth(20),//条间距离
      itemStyle:{normal:{barBorderRadius:[5,5,0,0],},}
    };
  })

  return option;
}

//对柱形图进行封装
const getBarOption_1 = (barData) => {
    let option =options.bar_1;
    option.legend.data = legendData(barData.values);
    option.xAxis[0].data = barData.x;//设置x轴坐标
    option.yAxis[0].max = barData.y.max;//设置y轴最大刻度
    option.series = barData.values.map((item,i)=>{
        return {
            name:item.name,
            type:'bar',
            data:item.datas,
            barWidth:pxTodpWidth(20),//柱图宽度
            barCateGoryGap:pxTodpWidth(20),//条间距离
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

//对折线图进行封装
const getLineOption_1 = (lineData) => {
  let option =options.line_1;
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
export {getPieOption,getPieOption_1,getBarOption,getLineOption,getBarOption_1,getLineOption_1};