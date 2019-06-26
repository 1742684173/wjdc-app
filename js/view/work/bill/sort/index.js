import React, { Component } from 'react';
import {View, StyleSheet, Platform, Text, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../../app';
import * as actions from '../../../../actions';
import BaseComponent from '../../../base/BaseComponent'
import List from "./common/List";
import LoadView from "../../../common/LoadView";
import Button from "../../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../../utils/ScreenUtil";
import right from "../../../../img/common/right.png";
import Search from "../../../common/Search";


class BillSort extends BaseComponent {

    state = {
        data:[],
        sortParentValues:[{id:0,name:'一级目录'}],
        foot:1,
        status:1,//1代表是可进入子目录 2：是可删除
    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('分类管理');
        //this.props.navigation.setParams({rightView:this._renderRightView()});
    }

    _renderRightView = () => {
        return (
            <Button style={{paddingHorizontal: pxTodpWidth(30)}}
                    onPress={this._onSelectBtn}>
                <Text style={{fontSize:pxTodpWidth(36),color:'#00c2ff'}}>编辑</Text>
            </Button>
        )
    }

    //初始化list
    initList = () => {
        this.currentPage = 1;
        this.pageSize = 10;
        this.condition = null;
        this.parentId = 0;
        this.parentName = '一级目录';
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
        this.initList();
        this._getBillSort();
    }

    _getBillSort = async () => {
        if(!this.state.refreshing){
            await this.showActivityIndicator();
        }

        try{
            let {type,code,msg,data} = await this.props.postAction(
                appJson.action.billSortFind,
                {
                    parentId:this.parentId,
                    currentPage:this.currentPage,
                    pageSize:this.pageSize,
                    condition:this.condition,
                    sortName:'top desc'
                },
                '查询账单分类'
            );
            if(type === appJson.action.billSortFind){
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

    _footView = () => {
        if(this.state.data.length === 0){
            return null;
        }else{
            return <LoadView foot={this.state.foot}/>
        }
    }

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
        this._getBillSort();
    }

    //长按分类item
    _onLongPress = async (item) => {
        this.showSelectAlert({buttons:[
            // {text:'添加子类',onPress:()=>{}},
            {text:item.top===1?'取消置顶':'置顶',onPress:()=>this._topOrCancel(item)},
            {text:'删除',onPress:()=>this._deleteById(item)},
            // {text:'修改',onPress:()=>{}},
            {text:'详情',onPress:()=>this._goFindDetail(item)},
            {text:'取消',onPress:this._cancelSelectAlert},
        ]})
    }

    _goFindDetail = async (obj) => {
        await this.hideAlert();
        this.props.navigation.navigate('BillSortDetail',{
            item:Object.assign(obj,{
                parentName:this.parentName
            }),
            callback:(data)=>{
                this._getBillSort();
            }});
    }

    //通过id删除
    _deleteById = async (obj) => {
        await this.showActivityIndicator();

        try{
            let {type,code,msg,data} = await this.props.postAction(
                appJson.action.billSortDeleteById,
                {id:obj.id}, '通过删除分类'
            );
            if(type === appJson.action.billSortDeleteById ){
                if (code === appJson.action.success) {
                    this._onRefresh();
                }else{
                    this.showToast(msg);
                }
            }
            this.hideActivityIndicator();
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //置顶与取消置顶
    _topOrCancel = async (obj) => {
        await this.showActivityIndicator();

        try{
            let {type,code,msg,data} = await this.props.postAction(
                obj.top===1?appJson.action.billSortCancelTopById:appJson.action.billSortTopById,
                {id:obj.id}, '置顶'
            );
            this.hideActivityIndicator();

            if(type === appJson.action.billSortTopById || type === appJson.action.billSortCancelTopById){
                if (code === appJson.action.success) {
                    this._onRefresh();
                }else{
                    this.showToast(msg);
                }
            }

        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //隐藏selectAlert
    _cancelSelectAlert = () => {
        this.hideAlert();
    }

    //进入子分类
    _onPress = async (obj) => {
        this.initList();
        let parentValues = this.state.sortParentValues;
        parentValues.push(obj);
        await this.setState({sortParentValues:parentValues});

        this.parentId = obj.id;
        this.parentName = obj.name;
        this._getBillSort();
    }

    //按级查分类
    _onParentItem = async (obj) => {
        this.initList();
        let parentValues = this.state.sortParentValues;
        let result = [];
        for(let i=0;i<parentValues.length;i++){
            result.push(parentValues[i]);
            if(parentValues[i].id === obj.id){
                break;
            }
        }
        await this.setState({sortParentValues:result});

        this.parentId = obj.id;
        this.parentName = obj.name;
        this._getBillSort();
    }

    //去添加分类
    _goAddBillSort = () => {
        this.props.navigation.navigate('BillSortAddForm',{
            item:{
                parentId:this.parentId,
                parentName:this.parentName
            },
            callback:this._getBillSort
        });
    }

    //搜索
    _searchByValue = (value) => {
        this.condition = value;
        this._getBillSort();
    }

    //刷新
    _onRefresh = () => {
        this.refs.search.clearSearchInput();
        let pId = this.parentId;
        this.initList();
        this.parentId = pId;
        this._getBillSort();
    }

    render() {
        super.render();
        let view = (
            <View style={{flex:1}}>
                <View style={{backgroundColor:'#ffffff'}}>
                    <Search
                        ref={'search'}
                        placeholder={'请转入关健字'}//提示
                        isShowBeforeBtn={true}//是否显示前面按钮
                        onBeforeBtn={this._searchByValue}//
                        // beforeImg={beforeImg}//图标
                        isShowMiddle={true}//是否显示中间按钮
                        onMiddleBtn={this._goAddBillSort}
                    />
                </View>
                <View style={styles.directSty}>
                    {
                        this.state.sortParentValues.map((item,i)=>{
                            return (
                                <TouchableOpacity
                                    onPress={()=>this._onParentItem(item)}
                                    key={i+''}
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
                                    <Image source={right} style={{height:pxTodpHeight(60),width: pxTodpWidth(10)}} resizeMode={'stretch'}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>

                <List
                    data={this.state.data}
                    onRefresh={this._onRefresh}
                    footView={this._footView}
                    onEndReached={this._onEndReached}
                    onPress={this._onPress}
                    onLongPress={this._onLongPress}
                />
            </View>
        )

        return super.renderBase(view);
    }


}

const styles = StyleSheet.create({
    directSty:{
        backgroundColor:'#fff',
        width:'100%',
        flexDirection: 'row',
        flexWrap:'wrap',
        marginBottom: pxTodpHeight(20)
    }
});

export default connect(null,actions)(BillSort);