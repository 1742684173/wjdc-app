import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler, ScrollView,} from 'react-native';
import {connect} from 'react-redux';
import BaseComponent from "../../base/BaseComponent";
import {postAction} from "../../../actions";
import moment from "moment";
import * as appJson from '../../../../app';
import Button from "../../common/Button";

class BillDetail extends BaseComponent {

    state = {
        data:{},
    };

    // 构造
    constructor(props) {
        super(props);
        this.setTitle("帐单详情");
    }

    componentDidMount = async () => {
        await this.initBase();
        this._getBill();
    }

    _getBill = async () => {
        this.showActivityIndicator();

        try{

            //分类
            const {type,code,msg,data} = await this.props.postAction(
                appJson.action.billFind,{
                    billId:this.props.navigation.state.params.id,
                    all:"all"
                },"查询消费详情");

            this.hideActivityIndicator();

            if(type === appJson.action.billFind){
                if(code === appJson.action.success){
                    data.totalCount >0 ? this.setState({data:data.list[0]}):null;
                }
            }
        }catch (e) {
            this.handleRequestError(e.message || e.note);
        }

    }

    //去编辑帐单界面
    _editBill = () => {
        this.props.navigation.navigate('BillForm',{
            title:'编辑帐单',
            data:this.state.data,
            callback:(data)=>{
                this._getBill();
            }});
    }

    render() {
        super.render();
        let view = (
            <View style={styles.contain}>
                <View style={[styles.itemView,{marginTop:0}]}>
                    <Text style={styles.textName}>消费时间：</Text>
                    <Text style={styles.textValue}>{
                        moment(this.state.data.dates).format("YYYY-MM-DD hh:mm:ss")
                    }</Text>
                </View>

                <View style={styles.itemView}>
                    <Text style={styles.textName}>消费类型：</Text>
                    <Text style={styles.textValue}>{this.state.data.type === -1?'支出':'收入'}</Text>
                </View>

                <View style={styles.itemView}>
                    <Text style={styles.textName}>消费金额：</Text>
                    <Text style={styles.textValue}>{this.state.data.sums}</Text>
                </View>

                <View style={styles.itemView}>
                    <Text style={styles.textName}>消费方式：</Text>
                    <Text style={styles.textValue}>{this.state.data.methodName}</Text>
                </View>

                <View style={styles.itemView}>
                    <Text style={styles.textName}>消费分类：</Text>
                    <Text style={styles.textValue}>{this.state.data.sortName}</Text>
                </View>

                <View style={styles.itemView}>
                    <Text style={styles.textName}>描述：</Text>
                    <Text style={styles.textValue}>{this.state.data.descs}</Text>
                </View>

                <View style={{height:50}}/>
                <Button style={{height:39,backgroundColor:'#21c3ff',}} onPress={this._editBill}>
                    <Text style={styles.btnSubmit}>编辑</Text>
                </Button>
            </View>
        );
        return super.renderBase(view);
    }

}

const styles = StyleSheet.create({
    contain:{
        marginTop:15,
        backgroundColor:'#ffffff',
        marginHorizontal: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius:10
    },
    itemView:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor:"#dcdcdc",
        paddingBottom: 3,
        marginTop:15
    },
    textName:{
        fontSize:14,
        color:'#666666',
    },
    textValue:{
        fontSize:14,
        color:'#333',
    },
    btnSubmit:{
        fontSize:20,
        color:'#fff'
    },
});

export default connect(null,{postAction})(BillDetail);