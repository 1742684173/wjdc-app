import React from "react";
import {Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {pxTodpHeight, pxTodpWidth} from "./ScreenUtil";
import dateIcon from "../img/common/date.png";
import DateTimePicker from "react-native-modal-datetime-picker";
import searchIcon from "../img/common/search.png";
import moment from "moment";

export type Props = {
    searchDate:Function,//通过时间搜索，两个参数：开始日期 结束日期
}

var curDate = new Date();
export default class DataBetween extends React.Component {
    props:Props

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isVisibleStart: false,
            isVisibleEnd: false,
            dataStartText:moment(new Date(curDate.getTime(curDate.getTime() - 24*60*60*1000))).format("YYYY-MM-DD"),
            dataEndText:moment(curDate).format("YYYY-MM-DD"),
        };
    }

    //显示隐藏日期控件
    _setDateTimePickerVisible = (which) => {
        which === 'start' ? this.setState({ isVisibleStart: !this.state. isVisibleStart}):
            this.setState({ isVisibleEnd: !this.state. isVisibleEnd });
    }

    //处理开始日期选择
    _handleStartDatePicked = (date) => {
        var DateFormat =  moment(date).format("YYYY-MM-DD");
        this.setState({ dataStartText: DateFormat });
        this._setDateTimePickerVisible('start');
    };

    //处理结束日期选择
    _handleEndDatePicked = (date) => {
        var DateFormat =  moment(date).format("YYYY-MM-DD");
        this.setState({ dataEndText: DateFormat });
        this._setDateTimePickerVisible('end');
    };

    _searchDate = () => {
        let startData = moment(this.state.dataStartText).format("YYYYMMDD");
        let endData = moment(this.state.dataEndText).format("YYYYMMDD");
        this.props.searchDate(startData,endData);
    }

    render() {
        return (
            <View style={styles.chooseData}>
                <View style={[styles.input]}>
                    <Text style={{fontSize:pxTodpHeight(26),color:'#333333',width:pxTodpWidth(180)}}>{this.state.dataStartText}</Text>
                    <TouchableOpacity onPress={()=>this._setDateTimePickerVisible('start')} >
                        <Image source={dateIcon}  mode='stretch'  style={styles.dataIcon} />
                    </TouchableOpacity>

                    <DateTimePicker
                        isVisible={this.state.isVisibleStart}
                        onConfirm={this._handleStartDatePicked}
                        onCancel={()=>this._setDateTimePickerVisible('start')}
                        titleIOS={'请选择'}
                        cancelTextIOS={'取消'}
                        confirmTextIOS={'确认'}
                    />
                </View>

                <Text style={{marginHorizontal:pxTodpWidth(10),fontSize:pxTodpHeight(28),color:'#333333' }}>至 </Text>

                <View style={styles.input}>
                    <Text style={{fontSize:pxTodpHeight(26),color:'#333333',width:pxTodpWidth(180)}}>{this.state.dataEndText}</Text>
                    <TouchableOpacity onPress={()=>this._setDateTimePickerVisible('end')} style={{marginRight:pxTodpWidth(10) }}  >
                        <Image source={dateIcon}  mode='stretch'  style={styles.dataIcon} />
                    </TouchableOpacity>

                    <DateTimePicker
                        isVisible={this.state.isVisibleEnd}
                        onConfirm={this._handleEndDatePicked}
                        onCancel={()=>this._setDateTimePickerVisible('end')}
                        titleIOS={'请选择'}
                        cancelTextIOS={'取消'}
                        confirmTextIOS={'确认'}
                    />
                </View>

                <TouchableHighlight style={{ marginLeft: pxTodpWidth(20),justifyContent:'center'}} onPress={this._searchDate}>
                    <Image
                        style={styles.searchIcon}
                        mode='stretch'
                        source={searchIcon}
                    />
                </TouchableHighlight>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    chooseData:{
        height:pxTodpHeight(80),
        backgroundColor:'#fff',
        borderRadius: pxTodpWidth(20),
        alignItems: 'center',
        flexDirection:'row',
    },
    input: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        height: pxTodpHeight(56),
        alignItems: 'center',
        borderColor: '#21c3d5',
        borderRadius: pxTodpWidth(10),
        borderWidth:2,
        paddingHorizontal:pxTodpWidth(10),
    },
    dataIcon:  {
        width:pxTodpWidth(30),
        height:pxTodpHeight(40)
    },
    searchIcon:{
        width:pxTodpWidth(40),
        height:pxTodpHeight(50),
        resizeMode:'contain',
    },
    pzphlist:{
        width:pxTodpWidth(690),

        backgroundColor:'#fff',
        borderRadius: pxTodpWidth(20),
        marginTop:pxTodpHeight(24),
        marginLeft:pxTodpWidth(30),
        justifyContent:'flex-start',
        flexDirection:'column'

    },
    inputLine:{
        height: pxTodpHeight(72),
        alignItems: 'center',
        borderColor: '#dcdcdc',
        borderRadius: pxTodpWidth(35),
        borderWidth:pxTodpHeight(1),
        width: pxTodpWidth(492),
        paddingLeft:pxTodpWidth(20),
        paddingVertical:pxTodpHeight(0),
    },

    lineSpace:{
        paddingTop:pxTodpHeight(40),
    },
})