import React from "react";
import {Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import dateIcon from "../../img/common/date.png";
import DateTimePicker from "react-native-modal-datetime-picker";
import searchIcon from "../../img/common/search.png";
import moment from "moment";
import Button from "./Button";
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";

export type Props = {
    searchDate:Function,//通过时间搜索，两个参数：开始日期 结束日期
    mode:string,//格式化 默认为'YYYY-MM-DD'
    startDefaultValue:string,//开始时间默认值
    endDefaultValue:string,//开始时间默认值
    style?:any,//通过时间搜索，两个参数：开始日期 结束日期
}

var curDate = new Date();
let format = 'YYYY-MM-DD';
export default class DateBetween extends React.Component {
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

    clear = async () => {
        await this.setState({
            dataStartText:null,
            dataEndText:null,
        })
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
        let startData = this.state.dataStartText?moment(this.state.dataStartText).format(format):null;
        let endData = this.state.dataEndText?moment(this.state.dataEndText).format(format):null;
        this.props.searchDate(startData,endData);
    }

    render() {
        return (
            <View style={[styles.chooseData,this.props.style]}>
                <View style={[styles.input]}>
                    <Text style={{fontSize:pxTodpWidth(26),color:'#333333',width:pxTodpWidth(180)}}>{this.state.dataStartText}</Text>
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

                <Text style={{marginHorizontal:pxTodpWidth(10),fontSize:pxTodpWidth(28),color:'#333333' }}>至 </Text>

                <View style={styles.input}>
                    <Text style={{fontSize:pxTodpWidth(26),color:'#333333',width:pxTodpWidth(180)}}>{this.state.dataEndText}</Text>
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

                <Button style={{backgroundColor:'#00000000',marginLeft: pxTodpWidth(20),justifyContent:'center'}} onPress={this._searchDate}>
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
        borderColor: '#00c2ff',
        borderRadius: pxTodpWidth(10),
        borderWidth:1,
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
        borderRadius: pxTodpWidth(56),
        borderWidth:1,
        width: pxTodpWidth(492),
        paddingLeft:pxTodpWidth(20),
        paddingVertical:0,
    },

    lineSpace:{
        paddingTop:pxTodpHeight(40),
    },
})