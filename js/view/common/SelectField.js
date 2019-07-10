import React,{Component} from 'react';
import{StyleSheet, Text, View, TouchableOpacity, Image,ScrollView}from 'react-native';
import Title from "./Title";
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";
import Button from "./Button";
import del from "../../img/common/delete1.png";
import add from "../../img/common/add.png";

const upPic = require('../../img/common/up.png');
const downPic = require('../../img/common/down.png');
const selectPic = require('../../img/common/select.png');
const rightPic = require('../../img/common/right.png');

export type Props = {
    values:Array,//选项
    title?:string,//标签名称
    isAll?:boolean,//是否有所有选项
    isNeed?:boolean,//是否必填
    isShowAdd?:boolean,//是否显示添加按钮
    addBtn?:Function,//添加按钮方法
    addImg?:string,
    isShowDelete?:boolean,//是否显示删除按钮
    deleteBtn?:Function,//删除按钮方法
    onItemPress?:Function,//父按钮方法
    onParentItem?:Function,//父按钮方法
    isParent?:boolean,//是否有父类
    parentValues?:Array
}

export default class SelectField extends Component<Props>{
    constructor(props) {
        super(props);

        props.defaultValue?props.onChange(props.defaultValue):null;
    }

    _onChange = (item) => {
        this.props.isParent?this.props.onItemPress(item):null;

        if(this.props.value+'' === item.id+''){
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
            isNeed,
            isAll,
            isShowAdd,
            addBtn,
            addImg,
            isShowDelete,
            deleteBtn,
            isParent,//是否有父类
            parentValues,
            onParentItem,
        } = this.props;

        let flagArray = isAll?[{id:'all',name:'所有'}].concat(values):values;

        let select = flagArray.map((item,i)=>{
            return(
                <TouchableOpacity
                    style={[styles.div2,{borderWidth:item.id+''===value+''?1:0}]}
                    key={i}
                    onPress={()=>this._onChange(item)}
                >
                    <Text style={styles.font1}>
                        {item.name}
                    </Text>
                    {item.id+''===value+''?<Image source={selectPic}/>:null}
                    {
                        isShowDelete && item.id!==value?(
                            <Button style={{height:'100%',paddingLeft: pxTodpWidth(20),backgroundColor:'#00000000'}} onPress={()=>deleteBtn(item)}>
                                <Image source={del}/>
                            </Button>
                        ):null
                    }

                </TouchableOpacity>
            )
        });

        let parentSelect = isParent?parentValues.map((item,i)=>{
            return (
                <TouchableOpacity
                    onPress={()=>onParentItem(item)}
                    key={i}
                    style={{
                        borderRadius:0,
                        alignItems: 'center',
                        flexDirection:'row',
                        backgroundColor:'#f8f8f8',
                        marginLeft: i===0?pxTodpWidth(30):0,
                    }}
                >
                    <View style={{
                        height:pxTodpHeight(60),
                        justifyContent: 'center',
                        paddingHorizontal: pxTodpWidth(10),

                    }}>
                        <Text style={{fontSize:pxTodpWidth(30), color:'#333', fontWeight:'bold'}}>
                            {item.name}
                        </Text>
                    </View>
                    <Image source={rightPic} style={{height:pxTodpHeight(60),width: pxTodpWidth(10)}} resizeMode={'stretch'}/>
                </TouchableOpacity>
            )
        }):null;

        return(
            <View style={styles.contain}>

                <Text style={[styles.titleStyle]}>
                    <Text style={{color:'#eb3232'}}>{isNeed?'*':'  '}</Text>
                    {title}
                </Text>

                <View style={styles.div1}>
                    {
                        isParent?(
                            <View style={{
                                marginTop:pxTodpHeight(-10),
                                backgroundColor:'#f8f8f8',
                                width:'100%',
                                flexDirection: 'row',
                                flexWrap:'wrap',
                                borderTopRightRadius:pxTodpWidth(40),
                                borderTopLeftRadius:pxTodpWidth(40),
                            }}>
                                {parentSelect}
                            </View>
                        ):null
                    }

                    {select}

                    {
                        isShowAdd?(
                            <Button
                                onPress={addBtn}
                                style={[styles.div2,{marginLeft:pxTodpWidth(30),backgroundColor:'#00000000'}]}
                            >
                                <Image source={addImg?addImg:add}/>
                            </Button>
                        ):null
                    }
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    contain: {
        flexDirection: 'row',
    },
    titleStyle: {
        marginTop:pxTodpHeight(10),
        marginRight: pxTodpWidth(20),
        fontSize: pxTodpWidth(28),
        color: '#666666',
    },
    div1:{
        flex:1,
        flexDirection: 'row',
        flexWrap:'wrap',
        borderColor: '#dcdcdc',
        borderWidth: 1,
        borderRadius: pxTodpWidth(40),
        paddingVertical: pxTodpHeight(10),
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

