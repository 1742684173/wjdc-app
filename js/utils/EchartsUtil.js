class EchartsUtil {
    init(){
        this.option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                left:'right',
                data: []
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: [0, 0.01],
                axisTick:{
                    show:false,
                },
                data: []
            },
            yAxis: {
                type: 'value',
                axisTick:{
                    show:false,
                },
                data: []
            },
            dataZoom: [
                // {
                //     type: 'slider',
                //     show: true,
                //     xAxisIndex: [0],
                //     start: 0,
                //     end: 100
                // },
                // {
                //     type: 'slider',
                //     show: true,
                //     yAxisIndex: [0],
                //     left: '93%',
                //     startValue: 0,
                //     end: 24
                // },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    startValue: 0,
                    endValue: 4
                },
                // {
                //     type: 'inside',
                //     yAxisIndex: [0],
                //     startValue: 0,
                //     end: 24
                // }
            ],
            series: [
                // {
                //     name: '支出(元)',
                //     type: 'bar',
                //     barWidth:10,
                //     data: []
                // },
                // {
                //     name: '收入(元)',
                //     type: 'bar',
                //     barWidth:10,
                //     data: billByDateSR
                // }
            ],
            //color:[]
        };
        return this;
    }

    setTitleOption(obj){
        this.option.title = obj;
        return this;
    }

    setTitle(title){
        this.option.title.text = title;
        return this;
    }

    setTooltip(obj){
        this.option.tooltip = obj;
        return this;
    }

    setLegend(obj){
        this.option.legend = obj;
        return this;
    }

    setLegendData(data){
        this.option.legend.data = data;
        return this;
    }

    setGrid(obj){
        this.option.grid = obj;
        return this;
    }

    setXAxis(obj){
        this.option.xAxis = obj;
        return this;
    }

    setXAxisData(obj){
        this.option.xAxis.data = obj;
        return this;
    }

    setYAxis(obj){
        this.option.yAxis = obj;
        return this;
    }

    setYAxisData(obj){
        this.option.yAxis.data = obj;
        return this;
    }

    setDataZoom(obj){
        this.option.dataZoom = obj;
        return this;
    }

    setColor(colors){
        this.option.color = colors;
        return this;
    }

    setSeries(obj){
        this.option.series = obj;
        return this;
    }

    getOption(){
        return this.option;
    }

}

module.exports = EchartsUtil;