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

import upPic from '../../img/common/up.png';
import downPic from '../../img/common/down.png';
import selectPic from '../../img/common/select.png';
import add from '../../img/common/add.png';
import edit from '../../img/common/edit.png';
import del from '../../img/common/delete1.png';
import Button from "./Button";


export default class Select extends Component{

    constructor(props){
        super(props);
        this.state = {
            isExpand:false,
        }
    }

    hide = () => {
        this.setState({isExpand:false});
    }

    setValue = (item) => {
        this.setState({isExpand:false});
        this.props.onChange(item.id);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.values !== this.props.values){
            nextProps.values.length > 0?this.props.onChange(nextProps.values[0].id):null;
        }
    }

    render(){
        const {
            values,
            title,
            isNeed,
            isShowAdd,
            addBtn,
            isShowEdit,
            editBtn,
            deleteBtn,
            isShowDelete,
            value,
            onChange
        } = this.props;

        let select = values.map((item,i)=>{
            return(
                <View key={i}  style={[styles.itemView,styles.optionItem]}>
                    {
                        isShowEdit?(
                            <Button style={{marginRight: 15,backgroundColor:'#00000000'}} onPress={()=>editBtn(item)}>
                                <Image source={edit}/>
                            </Button>
                        ):null
                    }

                    {
                        isShowDelete?(
                            <Button style={{marginRight: 10,backgroundColor:'#00000000'}} onPress={()=>deleteBtn(item)}>
                                <Image source={del}/>
                            </Button>
                        ):null
                    }

                    <Button style={{flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#00000000'}} onPress={()=>{
                        onChange(item.id);
                        this.setState({isExpand:false})
                    }}>
                        <Text style={styles.inputStyle}>{item.name}</Text>
                        {item.id===value?<Image source={selectPic}/>:null}
                    </Button>

                </View>
            )
        })

        let showText = values.map((item,i)=>{
            if(value === item.id){
                return item.name;
            }else{
                return '';
            }
        })

        return(
            <View style={styles.contain}>
                <Text style={[styles.titleStyle]}>
                    <Text style={{color:'#eb3232'}}>{isNeed?'*':'  '}</Text>{title}
                </Text>

                <View style={{flex:1,marginTop:-10,marginLeft:10}}>
                    <View style={[styles.selectView,values.length>6?{height:this.state.isExpand?250:40}:null]}>
                        <View style={[styles.itemView]}>

                            <Button
                                style={{flex:1,flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',backgroundColor:'#00000000'}}
                                onPress={()=>this.setState({isExpand:!this.state.isExpand})}>
                                <Text style={styles.inputStyle}>{showText}</Text>
                                <Image source={this.state.isExpand?upPic:downPic}/>
                            </Button>
                            {
                                isShowAdd?(
                                    <Button onPress={addBtn} style={{marginLeft:15,backgroundColor:'#00000000'}}>
                                        <Image source={add}/>
                                    </Button>
                                ):null
                            }
                        </View>
                        <ScrollView style={[values.length>6?{height:this.state.isExpand?250:40}:null]}>
                            {this.state.isExpand? select :null}
                        </ScrollView>
                    </View>
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    contain:{
        flexDirection:'row',
    },
    titleStyle:{
        backgroundColor:'#ffffff',
        fontSize:14,
        color:'#666666',
    },
    selectView:{
        width:'100%',
        backgroundColor:'#fff',
        borderRadius:20,
        borderWidth:1,
        borderColor:'#dcdcdc',
        paddingHorizontal:20,
        position:'absolute',
    },
    inputStyle:{
        fontSize:14,
        color:'#333',
    },
    itemView:{
        height:36,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    optionItem:{
        marginTop:5,
        borderBottomColor:'#dcdcdc',
        borderBottomWidth:1,
    }
})

