import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Text, View, StyleSheet, Image, Platform,TextInput, TouchableHighlight,TouchableOpacity,ListView,Modal,PixelRatio,ScrollView,SafeAreaView } from 'react-native';
import Title from '../../common/Title';
import DateBetween from '../../common/DateBetween';
import DateTimeField from '../../common/DateTimeField';
import Field from '../../common/Field';
import TextField from '../../common/TextField';
import MySelect from './common/MySelect';
import {reduxForm} from 'redux-form';
import * as actions from '../../../actions/index';
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";

type Props = {
    modalVisible?:boolean,//是否显示
    onReset?:Function,//重置
    onSubmit?:Function,//提交
};

//按方式查，按种类查 按时间 金额大小 支出/收入
const sortName = [
    {id:'sortName',name:'按类别升序'},
    {id:'sortName desc',name:'按类别降序'},
    {id:'labelName',name:'按标签升序'},
    {id:'labelName desc',name:'按标签降序'},
    {id:'dates',name:'按时间升序'},
    {id:'dates desc',name:'按时间降序'},
    {id:'sums',name:'按金额升序'},
    {id:'sums desc',name:'按金额降序'},
];

const type = [
    {id:'in',name:'收入'},
    {id:'out',name:'支出'},
];

class BillLabel extends Component<Props> {

    _onReset = async () => {
        this.props.onReset();
    }

    _onSubmit = async (object:Object) => {
        // await this.setState(object);
        this.props.onSubmit(object)
    }

    render(){
        const {hideModal,label,sort,selectLabel,handleSubmit} = this.props;
        return (
            <View style={{width:'100%',height:'100%',flexDirection:'row'}}>
                <Button
                    style={styles.leftView}
                    onPress={hideModal}
                />

                <View style={{backgroundColor:'#fff', width:'80%', height:'100%', position: 'absolute', right: 0}}>

                    <ScrollView
                        contentContainerStyle={{marginTop:pxTodpHeight(50),marginHorizontal:pxTodpWidth(30)}}
                        keyboardShouldPersistTaps={'handled'}
                    >

                        <Field name={'type'} component={MySelect} title={'类形'}
                               values={type} isAll={true} defaultValue={selectLabel.type}/>

                        <Title text={'时间范围'} style={styles.title}/>
                        <View style={{paddingHorizontal: pxTodpWidth(20)}}>
                            <Field name={'startTime'} component={DateTimeField} title={'开始时间'}
                                   defaultValue={selectLabel.startTime}/>

                            <View style={{height:pxTodpHeight(10)}}/>

                            <Field name={'endTime'} component={DateTimeField} title={'结束时间'}
                                   defaultValue={selectLabel.endTime}/>
                        </View>

                        <Title text={'金额范围'} style={styles.title}/>
                        <View style={{marginHorizontal: pxTodpWidth(30)}}>
                            <Field name={'minSum'} component={TextField} title={'最小金额'}
                                   keyboardType={'numeric'} defaultValue={selectLabel.minSum}/>

                            <View style={{height:pxTodpHeight(10)}}/>

                            <Field name={'maxSum'} component={TextField} title={'最大金额'}
                                   keyboardType={'numeric'} defaultValue={selectLabel.maxSum}/>
                        </View>

                        <Field name={'sortName'} component={MySelect} title={'排序'}
                               values={sortName} defaultValue={selectLabel.sortName}/>

                        <Field name={'labelId'} component={MySelect} title={'标签'}
                               values={label} isAll={true} defaultValue={selectLabel.labelId}/>

                        <Field name={'sortId'} component={MySelect} title={'分类'}
                               values={sort} isAll={true} defaultValue={selectLabel.sortId}/>

                        <View style={{height:pxTodpHeight(400)}}/>
                    </ScrollView>

                    <View style={styles.bottomDiv}>

                        <TouchableOpacity style={[styles.btn,{backgroundColor:'#ff8518'}]} onPress={this._onReset}>
                            <Text style={styles.btnFont}>重置</Text>
                        </TouchableOpacity>

                        <View style={{width:pxTodpWidth(30)}}/>

                        <TouchableOpacity style={styles.btn} onPress={handleSubmit(this._onSubmit)}>
                            <Text style={styles.btnFont}>查询</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    bottomDiv:{
        position:'absolute',
        backgroundColor:'#fff',
        bottom:0,left:0,
        height:pxTodpHeight(100),
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btn:{
        width:pxTodpWidth(220),
        height:pxTodpHeight(68),
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#21c3fe',
        borderRadius: pxTodpWidth(30),
    },
    btnFont:{
        fontSize: pxTodpWidth(30),
        color:'#fff',
    },
    leftView:{
        flex:1,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        borderRadius:0,
    },
    div1:{
        flexDirection: 'row',
        flexWrap:'wrap',
        width:pxTodpWidth(650),
        marginVertical: pxTodpHeight(20)
    },
    div2:{
        backgroundColor:'#f8f8f8',
        height:pxTodpHeight(66),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:pxTodpWidth(20),
        paddingVertical: pxTodpHeight(10),
        paddingHorizontal: pxTodpWidth(20),
        marginVertical:pxTodpHeight(6),
        marginLeft: pxTodpWidth(30)
    },
    font1:{
        fontSize:pxTodpWidth(26),
        color:'#333'
    },
    title:{
        marginTop:pxTodpHeight(20),
        marginBottom:pxTodpHeight(10),
    }
});

const ReduxBillLabelForm = reduxForm({
    form: 'BillLabelForm',
})(BillLabel)

export default connect(null,actions)(ReduxBillLabelForm);