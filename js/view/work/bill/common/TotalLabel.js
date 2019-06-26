import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Text, View, StyleSheet, TouchableOpacity,ScrollView} from 'react-native';
import Title from '../../../common/Title';
import DateTimeField from '../../../common/DateTimeField';
import Field from '../../../common/Field';
import MySelect from './MySelect';
import {reduxForm} from 'redux-form';
import * as actions from '../../../../actions/index';
import Button from "../../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../../utils/ScreenUtil";

type Props = {
    modalVisible?:boolean,//是否显示
    onReset?:Function,//重置
    onSubmit?:Function,//提交
};

const type = [
    {id:'in',name:'收入'},
    {id:'out',name:'支出'},
];

const dateformats = [
    {id:'%Y-%m-%d',name:'日'},
    {id:'%Y-%u',name:'周'},
    {id:'%Y-%m',name:'月'},
    // {id:'season',name:'季'},
    {id:'%Y',name:'年'},
]

class TotalLabel extends Component<Props> {

    _onReset = async () => {
        this.props.onReset();
    }

    _onSubmit = async (object:Object) => {
        await this.setState(object);
        this.props.onSubmit(object)
    }

    render(){
        const {hideModal,label,sort,selectLabel,handleSubmit} = this.props;
        return (
            <View style={{width:'100%',height:'100%',flexDirection:'row'}}>
                <Button style={styles.leftView} onPress={hideModal}/>

                <View style={{backgroundColor:'#fff', width:'80%', height:'100%', position: 'absolute', right: 0}}>

                    <ScrollView
                        contentContainerStyle={{
                            marginVertical:pxTodpHeight(30),
                            marginHorizontal:pxTodpWidth(30),
                            marginTop:pxTodpHeight(50)
                        }}
                        keyboardShouldPersistTaps={'handled'}
                    >

                        <Field name={'type'} component={MySelect} title={'类形'}
                               values={type} isAll={true} defaultValue={selectLabel.type}/>

                        <Field name={'dateformat'} component={MySelect} title={'时间段'}
                               values={dateformats} defaultValue={selectLabel.dateformat}/>

                        <Field name={'labelId'} component={MySelect} title={'方式'}
                               values={label}  isAll={true} defaultValue={selectLabel.labelId}/>

                        <Field name={'sortId'} component={MySelect} title={'分类'}
                               values={sort}  isAll={true} defaultValue={selectLabel.sortId}/>

                        <View style={{height:pxTodpHeight(400)}}/>
                    </ScrollView>

                    <View style={styles.bottomDiv}>

                        <Button style={[styles.btn,{backgroundColor:'#ff8518'}]} onPress={this._onReset}>
                            <Text style={styles.btnFont}>重置</Text>
                        </Button>

                        <View style={{width:pxTodpWidth(30)}}/>

                        <Button style={styles.btn} onPress={handleSubmit(this._onSubmit)}>
                            <Text style={styles.btnFont}>统计</Text>
                        </Button>

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
        fontSize: pxTodpWidth(40),
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
        fontSize:pxTodpWidth(1260),
        color:'#333'
    },
    title:{
        marginTop:pxTodpHeight(20),
        marginBottom:pxTodpHeight(10),
    }
});

const ReduxBillTotalLabelForm = reduxForm({
    form: 'BillTotalLabelForm',
})(TotalLabel)

export default connect(null,actions)(ReduxBillTotalLabelForm);