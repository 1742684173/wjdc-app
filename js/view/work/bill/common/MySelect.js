import React,{Component} from 'react';
import{StyleSheet, Text, View, TouchableOpacity, Image,ScrollView}from 'react-native';

export type Props = {
    values:Array,//选项
    title:string,//标签名称
    isNeed:boolean,//是否必填
    isShowAdd:boolean,//是否显示添加按钮
    addBtn:Function,//添加按钮方法
    isShowEdit:boolean,//是否显示编辑按钮
    editBtn:Function,//编辑按钮方法
    isShowDelete:boolean,//是否显示删除按钮
    deleteBtn:Function,//删除按钮方法
}

const upPic = require('../../../../img/common/up.png');
const downPic = require('../../../../img/common/down.png');
const selectPic = require('../../../../img/common/select.png');
import Title from "../../../common/Title";
import {pxTodpHeight, pxTodpWidth} from "../../../../utils/ScreenUtil";

type Props = {
    values:Array,//数据
    title:string,//标题
    isAll:boolean,//是否有所有选项
}

export default class MySelect extends Component{
    constructor(props) {
        super(props);

        props.defaultValue?props.onChange(props.defaultValue):null;
    }

    _onChange = (item) => {
        if(this.props.value === item.id){
            this.props.onChange(null);
        }else{
            this.props.onChange(item.id);
        }
    }

    render(){
        const {
            values,
            title,
            value,
            isAll,
            ...others
        } = this.props;

        let flagArray = isAll?[{id:'all',name:'所有'}].concat(values):values;
        let select = flagArray.map((item,i)=>{
            return(
                <TouchableOpacity
                    style={[styles.div2,{borderWidth:item.id===value?1:0}]}
                    key={i}
                    onPress={()=>this._onChange(item)}
                >
                    <Text style={styles.font1}>
                        {item.name}
                    </Text>
                    {item.id===value?<Image source={selectPic}/>:null}
                </TouchableOpacity>
            )
        })

        return(
            <View>
                <Title text={title}/>

                <View style={styles.div1}>
                    {select}
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    div1:{
        flexDirection: 'row',
        flexWrap:'wrap',
    },
    div2:{
        backgroundColor:'#f8f8f8',
        height:pxTodpHeight(66),
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:pxTodpWidth(20),
        paddingVertical: pxTodpHeight(10),
        paddingHorizontal: pxTodpWidth(20),
        marginVertical:pxTodpHeight(6),
        marginLeft: pxTodpWidth(30),
        borderColor:'#21c3fe',
    },
    font1:{
        fontSize:pxTodpWidth(26),
        color:'#333'
    },
    title:{
        marginTop:pxTodpHeight(20)
    }
})

