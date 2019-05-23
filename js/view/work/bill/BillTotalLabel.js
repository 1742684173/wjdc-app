import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Text, View, StyleSheet, TouchableOpacity,ScrollView} from 'react-native';
import Title from '../../common/Title';
import DateTimeField from '../../common/DateTimeField';
import Field from '../../common/Field';
import MySelect from './common/MySelect';
import {reduxForm} from 'redux-form';
import * as actions from '../../../actions';

type Props = {
    modalVisible?:boolean,//是否显示
    reset?:Function,//重置
    submit?:Function,//提交
};

const type = [
    {id:'in',name:'收入'},
    {id:'out',name:'支出'},
];

const timeUnit = [
    {id:'day',name:'天'},
    {id:'week',name:'周'},
    {id:'mouth',name:'月'},
    {id:'season',name:'季'},
    {id:'year',name:'年'},
]

class BillTotalLabel extends Component<Props> {

    _onReset = async () => {
        this.props.onReset();
    }

    _onSubmit = async (object:Object) => {
        await this.setState(object);
        this.props.onSubmit(object)
    }

    render(){
        const {hideModal,method,sort,selectLabel,handleSubmit} = this.props;
        return (
            <View style={{width:'100%',height:'100%',flexDirection:'row'}}>
                <TouchableOpacity style={styles.leftView} onPress={hideModal}/>

                <View style={{backgroundColor:'#fff', width:'80%', height:'100%', position: 'absolute', right: 0}}>

                    <ScrollView
                        contentContainerStyle={{marginTop:25}}
                        keyboardShouldPersistTaps={'handled'}
                    >

                        <Field name={'type'} component={MySelect} title={'类形'}
                               values={type} isAll={true} defaultValue={selectLabel.type}/>

                        <Title text={'时间范围'} style={styles.title}/>
                        <View style={{paddingHorizontal: 10}}>
                            <Field name={'startTime'} component={DateTimeField} title={'开始时间'}
                                   defaultValue={selectLabel.startTime}/>

                            <View style={{height:5}}/>

                            <Field name={'endTime'} component={DateTimeField} title={'结束时间'}
                                   defaultValue={selectLabel.endTime}/>
                        </View>

                        <Field name={'method'} component={MySelect} title={'时间段'}
                               values={timeUnit} defaultValue={selectLabel.timeUnit}/>

                        <Field name={'method'} component={MySelect} title={'方式'}
                               values={method}  isAll={true} defaultValue={selectLabel.method}/>

                        <Field name={'sort'} component={MySelect} title={'分类'}
                               values={sort}  isAll={true} defaultValue={selectLabel.sort}/>

                        <View style={{height:200}}/>
                    </ScrollView>

                    <View style={styles.bottomDiv}>

                        <TouchableOpacity style={[styles.btn,{backgroundColor:'#ff8518'}]} onPress={this._onReset}>
                            <Text style={styles.btnFont}>重置</Text>
                        </TouchableOpacity>

                        <View style={{width:15}}/>

                        <TouchableOpacity style={styles.btn} onPress={handleSubmit(this._onSubmit)}>
                            <Text style={styles.btnFont}>统计</Text>
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
        height:50,
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btn:{
        width:105,
        height:34,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#21c3fe',
        borderRadius: 15,
    },
    btnFont:{
        fontSize: 15,
        color:'#fff',
    },
    leftView:{
        flex:1,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
    },
    div1:{
        flexDirection: 'row',
        flexWrap:'wrap',
        width:325,
        marginVertical: 10
    },
    div2:{
        backgroundColor:'#f8f8f8',
        height:33,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical:3,
        marginLeft: 15
    },
    font1:{
        fontSize:13,
        color:'#333'
    },
    title:{
        marginTop:10,
        marginBottom:5,
    }
});

const ReduxBillTotalLabelForm = reduxForm({
    form: 'BillTotalLabelForm',
})(BillTotalLabel)

export default connect(null,actions)(ReduxBillTotalLabelForm);