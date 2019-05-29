import React,{Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    TouchableOpacity
}from 'react-native';
import Button from "./Button";

export type Props = {
    values:Array,//选项
    title:string,//标签名称
    isNeed:boolean,//是否必填
}

export default class RadioButton extends Component{
    constructor(props){
        super(props);
        const {onChange,defaultValue} = this.props;
        onChange(defaultValue);
    }

    render(){
        const {values,title,isNeed,value,onChange} = this.props;
        let radios = values.map((item,i)=>{
            return(
                <Button key={i} style={styles.radioStyle} onPress={()=>onChange(item.id)}>
                    <View style={styles.outCircle}>
                        {item.id===value?<View style={styles.inCircle}/>:null}
                    </View>
                    <Text style={styles.inputStyle}>{item.value}</Text>
                </Button>
            )
        })

        return(
            <View style={styles.contain}>
                <Text style={[styles.titleStyle]}>
                    <Text style={{color:'#eb3232'}}>{isNeed?'*':' '}</Text>{title}
                </Text>
                {radios}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    contain:{
        flexDirection:'row',
        //alignItems:'center',
        height:36,
    },
    titleStyle:{
        marginRight:23,
        fontSize:14,
        color:'#666666',
    },
    radioStyle:{
        flex:1,
        flexDirection:'row',
        backgroundColor: '#00000000'
    },
    outCircle:{
        justifyContent:'center',
        alignItems:'center',
        width:20,
        height:20,
        borderRadius:40,
        marginRight:5,
        borderWidth:1,
        borderColor:'#dcdcdc',
    },
    inCircle:{
        backgroundColor:'#333',
        width:10,
        height:10,
        borderRadius:10,
    },
    inputStyle:{
        fontSize:14,
        color:'#333',
    }
})


