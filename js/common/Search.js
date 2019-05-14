import React, {Component, Node} from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
}from "react-native";
import {ScreenWidth,ScreenHeight} from "./ScreenUtil";
import search from "../img/common/search.png";
import select from "../img/common/search_select.png";
import add from "../img/common/add.png";

type Props = {
    placeholder?:string,//提示
    isShowBeforeBtn?:boolean,//是否显示前面按钮
    onBeforeBtn?:Function,//
    beforeImg?:string,//图标
    isShowMiddle?:boolean,//是否显示中间按钮
    onMiddleBtn?:Function,
    middleImg?:string,//图标
    isShowBehind?:boolean,//是否显示后面按钮
    onBehindBtn?:Function,
    behindImg?:string,//图标
};

export default class Search extends Component<Props>{

    constructor(props){
        super(props);
        this.state = {
            value:"",
        }
    }

    clearSearchInput = () => {
        this.refs.searchInput.clear();
    }

    render(){
        const {
            placeholder,
            isShowBeforeBtn,//是否显示前面按钮
            onBeforeBtn,//
            beforeImg,//图标
            isShowMiddle,//是否显示中间按钮
            onMiddleBtn,
            middleImg,//图标
            isShowBehind,//是否显示后面按钮
            onBehindBtn,
            behindImg,//图标
            ...other
        } = this.props;
        return(
            <View style={styles.contain}>
                <View style={styles.searchView}>
                    {
                        isShowBeforeBtn?<TouchableOpacity onPress={()=>onBeforeBtn(this.state.value)}>
                            <Image source={beforeImg?beforeImg:search} style={styles.searchImage}/>
                        </TouchableOpacity>:null
                    }

                    <TextInput
                        ref={"searchInput"}
                        placeholder={placeholder?placeholder:""}
                        placeholderTextColor={"#999999"}
                        returnKeyType={"search"}
                        underlineColorAndroid={"#00000000"}
                        onChangeText ={(text)=>this.setState({value:text})}
                        style={styles.inputView}
                        {...other}
                    />
                </View>
                {
                    isShowMiddle?<TouchableOpacity  onPress={()=>onMiddleBtn(this.state.value)} style={styles.addView}>
                        <Image source={middleImg?middleImg:add} style={styles.addImage}/>
                    </TouchableOpacity>:null
                }

                {
                    isShowBehind?<TouchableOpacity  onPress={()=>onBehindBtn(this.state.value)} style={styles.addView}>
                        <Image source={behindImg?behindImg:select} style={styles.addImage}/>
                    </TouchableOpacity>:null
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    contain:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#ffffff",
        paddingHorizontal:15,
        paddingVertical:6,
        //,
    },
    searchView:{
        flex:1,
        flexDirection:"row",
        backgroundColor:"#f2f2f2",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:5,
        height:35,
    },
    inputView:{
        flex:1,
        height:45,
        marginHorizontal:10,
        fontSize:13,
    },
    searchImage:{
        height:20,
        width:20,
        marginRight:5,
        marginLeft: 5,
        resizeMode :"contain",
    },
    addView:{
        alignItems:"center",
        justifyContent:"center",
        width:44,
        height:35,
        borderRadius:5,
        borderWidth:1,
        borderColor:"#f2f2f2",
        marginLeft:7,
    },
    addImage:{
        height:15,
        width:15,
        resizeMode :"contain",
    },
})