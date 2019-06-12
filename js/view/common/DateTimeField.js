import React, { Component } from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import dateIcon from "../../img/common/date.png";
import Button from "./Button";
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";

var curDate = new Date();
let format = 'YYYY-MM-DD';
export default class DateTimeField extends Component {
    state = {
        isDateTimePickerVisible: false,
    };

    constructor(props) {
        super(props);
        //时间格式化

        switch (props.mode) {
            case 'time':format = 'HH:mm:ss';break;
            case 'date':format = 'YYYY-MM-DD';break;
            case 'datetime':format = 'YYYY-MM-DD HH:mm:ss';break;
        }

        props.defaultValue?props.onChange(moment(props.defaultValue).format(format)):null;
    }


    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.props.onChange(moment(date).format(format));//
        this._hideDateTimePicker();
    };

    render () {
        const {title,value,isNeed,mode} = this.props;

        return (
            <View style={styles.contain}>
                <Text style={[styles.titleStyle]}>
                    <Text style={{color:'#eb3232'}}>{isNeed?'*':'  '}</Text>
                    {title}
                </Text>
                <View style={styles.btnView}>
                    <Text style={{flex:1}}>{value}</Text>
                    <Button onPress={this._showDateTimePicker} style={{backgroundColor:'#00000000'}}>
                        <Image source={dateIcon}  mode='stretch'  style={styles.dataIcon} />
                    </Button>
                </View>
                <DateTimePicker
                    //date={new Date(value)}
                    is24Hour={true}
                    mode={mode?mode:'date'}
                    datePickerModeAndroid={'spinner'}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    titleIOS={'请选择'}
                    cancelTextIOS={'取消'}
                    confirmTextIOS={'确认'}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    contain: {
        flexDirection: 'row',
        alignItems:'center',
        height: pxTodpHeight(72),
    },
    titleStyle: {
        marginRight: pxTodpWidth(20),
        fontSize: pxTodpWidth(28),
        color: '#666666',
    },
    btnView:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:pxTodpWidth(20),
        justifyContent:'center',
        height: pxTodpHeight(72),
        borderWidth: 1,
        borderColor:'#dcdcdc',
        borderRadius:pxTodpWidth(40),
    },
    dataIcon:  {
        width:pxTodpWidth(30),
        height:pxTodpHeight(40)
    },
});
