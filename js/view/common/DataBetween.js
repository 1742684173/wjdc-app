import React from "react";
import {Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import dateIcon from "../../img/common/date.png";
import DateTimePicker from "react-native-modal-datetime-picker";
import searchIcon from "../../img/common/search.png";
import moment from "moment";
import Button from "./Button";

export type Props = {
    searchDate:Function,//通过时间搜索，两个参数：开始日期 结束日期
    mode:string,//格式化 默认为'YYYY-MM-DD'
    startDefaultValue:string,//开始时间默认值
    endDefaultValue:string,//开始时间默认值
    style?:any,//通过时间搜索，两个参数：开始日期 结束日期
}

var curDate = new Date();
let format = 'YYYY-MM-DD';
export default class DataBetween extends React.Component {
    props:Props

    constructor(props) {
        super(props);
        switch (props.mode) {
            case 'time':format = 'HH:mm:ss';break;
            case 'date':format = 'YYYY-MM-DD';break;
            case 'datetime':format = 'YYYY-MM-DD HH:mm:ss';break;
        }
        // 初始状态
        this.state = {
            isVisibleStart: false,
            isVisibleEnd: false,
            dataStartText:props.startDefaultValue?moment(props.startDefaultValue).format(format):null,
            dataEndText:props.endDefaultValue?moment(props.endDefaultValue).format(format):null,
        };
    }

    //显示隐藏日期控件
    _setDateTimePickerVisible = (which) => {
        which === 'start' ? this.setState({ isVisibleStart: !this.state. isVisibleStart}):
            this.setState({ isVisibleEnd: !this.state. isVisibleEnd });
    }

    //处理开始日期选择
    _handleStartDatePicked = (date) => {
        var DateFormat =  moment(date).format(format);
        this.setState({ dataStartText: DateFormat });
        this._setDateTimePickerVisible('start');
    };

    //处理结束日期选择
    _handleEndDatePicked = (date) => {
        var DateFormat =  moment(date).format(format);
        this.setState({ dataEndText: DateFormat });
        this._setDateTimePickerVisible('end');
    };

    _searchDate = () => {
        let startData = moment(this.state.dataStartText).format(format);
        let endData = moment(this.state.dataEndText).format(format);
        this.props.searchDate(startData,endData);
    }

    render() {
        return (
            <View style={[styles.chooseData,this.props.style]}>
                <View style={[styles.input]}>
                    <Text style={{fontSize:13,color:'#333333',width:90}}>{this.state.dataStartText}</Text>
                    <Button onPress={()=>this._setDateTimePickerVisible('start')} style={{backgroundColor:'#00000000',}} >
                        <Image source={dateIcon}  mode='stretch'  style={styles.dataIcon} />
                    </Button>

                    <DateTimePicker
                        isVisible={this.state.isVisibleStart}
                        onConfirm={this._handleStartDatePicked}
                        onCancel={()=>this._setDateTimePickerVisible('start')}
                        titleIOS={'请选择'}
                        cancelTextIOS={'取消'}
                        confirmTextIOS={'确认'}
                    />
                </View>

                <Text style={{marginHorizontal:5,fontSize:14,color:'#333333' }}>至 </Text>

                <View style={styles.input}>
                    <Text style={{fontSize:13,color:'#333333',width:90}}>{this.state.dataEndText}</Text>
                    <Button onPress={()=>this._setDateTimePickerVisible('end')} style={{backgroundColor:'#00000000',marginRight:5}}  >
                        <Image source={dateIcon}  mode='stretch'  style={styles.dataIcon} />
                    </Button>

                    <DateTimePicker
                        isVisible={this.state.isVisibleEnd}
                        onConfirm={this._handleEndDatePicked}
                        onCancel={()=>this._setDateTimePickerVisible('end')}
                        titleIOS={'请选择'}
                        cancelTextIOS={'取消'}
                        confirmTextIOS={'确认'}
                    />
                </View>

                <Button style={{backgroundColor:'#00000000',marginLeft: 10,justifyContent:'center'}} onPress={this._searchDate}>
                    <Image
                        style={styles.searchIcon}
                        mode='stretch'
                        source={searchIcon}
                    />
                </Button>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    chooseData:{
        height:40,
        backgroundColor:'#fff',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection:'row',
    },
    input: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        height: 28,
        alignItems: 'center',
        borderColor: '#00c2ff',
        borderRadius: 5,
        borderWidth:1,
        paddingHorizontal:5,
    },
    dataIcon:  {
        width:15,
        height:20
    },
    searchIcon:{
        width:20,
        height:25,
        resizeMode:'contain',
    },
    pzphlist:{
        width:345,

        backgroundColor:'#fff',
        borderRadius: 10,
        marginTop:12,
        marginLeft:15,
        justifyContent:'flex-start',
        flexDirection:'column'

    },
    inputLine:{
        height: 36,
        alignItems: 'center',
        borderColor: '#dcdcdc',
        borderRadius: 28,
        borderWidth:1,
        width: 246,
        paddingLeft:10,
        paddingVertical:0,
    },

    lineSpace:{
        paddingTop:20,
    },
})