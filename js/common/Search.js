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
import {pxTodpHeight,pxTodpWidth,ScreenWidth,ScreenHeight} from "./ScreenUtil";
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
        paddingHorizontal:pxTodpWidth(30),
        paddingVertical:pxTodpHeight(12),
        //,
    },
    searchView:{
        flex:1,
        flexDirection:"row",
        backgroundColor:"#f2f2f2",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:pxTodpWidth(10),
        height:pxTodpHeight(70),
    },
    inputView:{
        flex:1,
        height:pxTodpHeight(90),
        marginHorizontal:pxTodpWidth(20),
        fontSize:pxTodpWidth(26),
    },
    searchImage:{
        height:pxTodpHeight(40),
        width:pxTodpWidth(40),
        marginRight:pxTodpWidth(10),
        marginLeft: pxTodpWidth(10),
        resizeMode :"contain",
    },
    addView:{
        alignItems:"center",
        justifyContent:"center",
        width:pxTodpWidth(88),
        height:pxTodpHeight(70),
        borderRadius:pxTodpWidth(10),
        borderWidth:1,
        borderColor:"#f2f2f2",
        marginLeft:pxTodpWidth(13),
    },
    addImage:{
        height:pxTodpHeight(30),
        width:pxTodpWidth(30),
        resizeMode :"contain",
    },
})