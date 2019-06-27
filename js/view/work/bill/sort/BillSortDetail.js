import React, { Component } from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';
import BaseComponent from "../../../base/BaseComponent";
import {postAction} from "../../../../actions";
import moment from "moment";
import * as appJson from '../../../../../app';
import Button from "../../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../../utils/ScreenUtil";

class BillSortDetail extends BaseComponent {

    state = {
        data:{},
    };

    // 构造
    constructor(props) {
        super(props);
        this.props.navigation.setParams({rightView:this._renderRightView()});
        this.setTitle("分类详情");
        this.item = this.props.navigation.state.params.item;
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
        this._getBillSort();
    }

    //右上筛选按钮
    _renderRightView = () => {
        return (
            <Button style={{marginRight:pxTodpWidth(30)}}
                    onPress={this._editBillSort}>
                <Text style={{fontSize:pxTodpWidth(36),color:'#00c2ff'}}>编辑</Text>
            </Button>
        )
    }

    _getBillSort = async () => {
        this.showActivityIndicator();

        try{
            //分类
            const {type,code,msg,data} = await this.props.postAction(
                appJson.action.billSortFindDetailById,{id:this.item.id},"查询分类详情");

            this.hideActivityIndicator();

            if(type === appJson.action.billSortFindDetailById){
                if(code === appJson.action.success){
                   this.setState({data:data.list[0]});
                }else {
                    this.showToast(msg);
                }
            }
        }catch (e) {
            this.handleRequestError(e.message || e.note);
        }
    }

    //去编辑帐单界面
    _editBillSort = () => {
        this.props.navigation.navigate('BillSortUpdateForm',{
            item:Object.assign(this.state.data,{parentName:this.item.parentName}),
            callback:(data)=>{
                this._getBillSort();
            }});
    }

    render() {
        super.render();
        let view = (
            <View style={styles.contain}>
                <View style={[styles.itemView,{marginTop:0}]}>
                    <Text style={styles.textName}>名称：</Text>
                    <Text style={styles.textValue}>{this.state.data.name}</Text>
                </View>

                <View style={styles.itemView}>
                    <Text style={styles.textName}>是否置顶：</Text>
                    <Text style={styles.textValue}>{this.state.data.top===1?'是':'否'}</Text>
                </View>

                <View style={styles.itemView}>
                    <Text style={styles.textName}>描述：</Text>
                    <Text style={styles.textValue}>{this.state.data.descs}</Text>
                </View>
            </View>
        );
        return super.renderBase(view);
    }

}

const styles = StyleSheet.create({
    contain:{
        marginTop:pxTodpHeight(30),
        backgroundColor:'#ffffff',
        marginHorizontal: pxTodpWidth(30),
        paddingHorizontal: pxTodpWidth(30),
        paddingVertical: pxTodpHeight(30),
        borderRadius:pxTodpWidth(20)
    },
    itemView:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor:"#dcdcdc",
        paddingBottom: pxTodpHeight(6),
        marginTop:pxTodpHeight(30)
    },
    textName:{
        fontSize:pxTodpWidth(28),
        color:'#666666',
    },
    textValue:{
        fontSize:pxTodpWidth(28),
        color:'#333',
    },
    btnSubmit:{
        fontSize:pxTodpWidth(40),
        color:'#fff'
    },
});

export default connect(null,{postAction})(BillSortDetail);