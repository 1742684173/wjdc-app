import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList, BackHandler, Image,} from 'react-native';
import LoadView from '../../../common/LoadView';
import Search from '../../../common/Search';
import {connect} from 'react-redux';
import * as appJson from '../../../../../app';
import * as actions from '../../../../actions/index';
import BaseComponent from '../../../base/BaseComponent';
import List from './common/List';


class BillLabel extends BaseComponent {

    state = {
        total:0,//事件总数
        foot:1,
        data:[],
    }

    // 构造
    constructor(props) {
        super(props);
        this.setTitle('我的标签');

        this.initList();
    }

    //初始化list
    initList = () => {
        this.currentPage = 1;
        this.pageSize = 30;
        this.condition = null;
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
        await this._getBillLabelList();
    }

    _getBillLabelList = async () => {
        this.showActivityIndicator();

        try{
            //帐单
            let params= Object.assign({
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                condition:this.condition,
                sortName:this.sortName,
            });
            const {type,code,msg,data} =
                await this.props.postAction(appJson.action.billLabelFind,params,'查询标签');
            if(type === appJson.action.billLabelFind){
                if (code === appJson.action.success) {
                    let myData = this.state.data;
                    if(this.currentPage === 1){
                        myData = data.list;
                    }else{
                        data.list.map((item,i)=>{
                            myData.push(item)
                        })
                    }

                    //总页数
                    this.totalPage = data.totalPage;

                    let foot = 0;
                    //是否有下一页
                    if(data.currentPage === data.totalPage){
                        foot = 1;//listView底部显示没有更多数据了
                    }

                    this.setState({foot:foot,data:myData});
                }
            }
            this.hideActivityIndicator();
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //条件查询
    _onSearchBtn = (value) => {
        this.initList();
        this.condition = value;
        this._getBillLabelList();
    }

    //加载
    _onEndReached = () => {
        //0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        if(this.state.foot != 0){
            return;
        }

        if(this.currentPage!=1 && this.currentPage >= this.totalPage){
            //this.setState({foot:1});
            return;
        }else{
            this.currentPage++;
        }

        //底部显示正在加载更多数据
        this.setState({foot:2});
        //获取数据
        this._getBillLabelList();
    }

    _onRefresh = () => {
        this.initList();
        this.refs.search.clearSearchInput();
        this._getBillLabelList()
    }

    //flatlist底部
    _footView = () => {
        if(this.state.data.length === 0){
            return null;
        }else{
            return <LoadView foot={this.state.foot}/>
        }
    }

    //前往详情界面
    _onItemClick = (item) => {
        this.props.navigation.navigate('BillLabelDetail', {
            id:item.id,
            callback:(data)=>{
                this._onRefresh();
            }
        })
    }

    //去新增
    _onAddBtn = () => {
        this.props.navigation.navigate('BillLabelAddForm',{
            callback:(data)=>{
                this._onRefresh();
            }});
    }

    _onDeleteItem = async (item) => {
        this.showAlert({
            content:'确认删除?',
            buttons:[
                {
                    text:'确认',
                    onPress:()=>this._confirmDelete(item.id)
                },
                {
                    text:'取消',
                    onPress:this._cancelDelete
                }
            ]
        });
    }

    //确认删除消费类别
    _confirmDelete = async (id:number) => {
        this.showActivityIndicator();
        try{
            //方式
            const {code,type,msg} = await this.props.postAction(appJson.action.billLabelDeleteById,{id:id},'通过id删除帐单');
            this.hideActivityIndicator();
            if(type === appJson.action.billLabelDeleteById){
                if(code === appJson.action.success){
                    this._onRefresh();
                }else{
                    this.showToast(msg);
                }
            }
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    _cancelDelete = () => {
        this.hideActivityIndicator();
    }

    render() {
        super.render();
        let view = (
            <View style={styles.contain}>

                <View style={{backgroundColor:'#ffffff',marginBottom: 5}}>
                    <Search
                        ref={'search'}
                        placeholder={'请转入关健字'}//提示
                        isShowBeforeBtn={true}//是否显示前面按钮
                        onBeforeBtn={this._onSearchBtn}//
                        isShowMiddle={true}//是否显示中间按钮
                        onMiddleBtn={this._onAddBtn}
                    />
                </View>

                <List
                    data={this.state.data}
                    onRefresh={this._onRefresh}
                    footView={this._footView}
                    onEndReached={this._onEndReached}
                    onPress={this._onItemClick}
                    onDeleteItem={this._onDeleteItem}
                />

            </View>
        )

        return super.renderBase(view);
    }

}

const styles = StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:'#f2f2f2',
    },
});

export default connect(null,actions)(BillLabel);