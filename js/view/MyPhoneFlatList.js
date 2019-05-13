import React,{Component} from 'react';
import {FlatList, StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {pxTodpHeight, pxTodpWidth} from "../common/ScreenUtil";
import PropTypes from 'prop-types';
import nullDataIcon from "../img/common/nullDataIcon.png";

export default class MyPhoneFlatList extends Component{
    static propTypes = {
        data:PropTypes.any,//传入的数据
        onSelectPhone:PropTypes.func,//选择数据
    }

    constructor(props){
        super(props);
        this.state = {isSendMsg:props.data.isSendMsg}
    }

    _cancel = () => {
        this.props.cancel();
    }

    render(){
        return(
            <View  style={[styles.contain,{height:pxTodpHeight(300)}]}>

                <FlatList
                    data={this.props.data.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._ListEmptyComponent}
                    ListHeaderComponent={this._listHeaderComponent}
                />

                <View style={styles.btnView}>
                    {/*取消按钮*/}
                    <TouchableOpacity style={styles.btn} onPress={this._cancel}>
                        <Text style={{fontSize:pxTodpWidth(32),color:'#666666'}}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _keyExtractor = (item, index) => index++;

    _renderItem = ({item}) => {
        let isSendMsg = this.state.isSendMsg;
        return (
            <TouchableOpacity
                style={{width:pxTodpWidth(500),height:pxTodpHeight(70),justifyContent:'center',alignItems:'center'}}
                onPress={this.props.onSelectPhone.bind(this,item,isSendMsg)}>
                <Text>{item}</Text>
            </TouchableOpacity>
        );
    }

    _ListEmptyComponent = () =>{
        let cpt = (
            <View style={styles.emptyView}>
                <Text style={{color:'#999'}}>空空如也~</Text>
            </View>
        )
        return cpt;
    }

    _listHeaderComponent = () => {
        return (
            <View style={{width:pxTodpWidth(500),alignItems:'center',marginBottom: pxTodpHeight(10)}}>
                <Text style={{color:'#999'}}>请选择电话</Text>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    contain:{
        width:pxTodpWidth(500),
        backgroundColor:'#fff',
        paddingTop:pxTodpHeight(20),
        //marginHorizontal:pxTodpWidth(30),
        borderRadius:pxTodpWidth(20),
        justifyContent: 'space-between'
    },
    emptyView:{
        flex:1,
        alignItems:'center',
        marginTop:pxTodpHeight(100)
    },
    btnView:{
        width:pxTodpWidth(500),
        height:pxTodpHeight(100),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderTopColor:'#dcdcdc',
        borderTopWidth:1
    },
    btn:{
        flex:1,
        // height:pxTodpHeight(100),
        justifyContent:'center',
        alignItems:'center',
    }
})