import React, { Component } from 'react';
import {View, StyleSheet, FlatList, Text, TouchableWithoutFeedback, Image, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../../app';
import * as actions from '../../../../actions';
import BaseComponent from '../../../base/BaseComponent'
import LoadView from "../../../common/LoadView";
import Button from "../../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../../utils/ScreenUtil";
import right from "../../../../img/common/right.png";
import unselectIcon from "../../../../img/common/un_select1.png";
import selectIcon from "../../../../img/common/select1.png";
import editIcon from "../../../../img/common/edit.png";
import Search from "../../../common/Search";
import Divider from "../../../common/Divider";
import SwipeRow from "../../../common/SwipeRow";
import nullDataIcon from "../../../../img/common/nullDataIcon.png";


class BillSort extends BaseComponent {

    state = {
        data:[],
        foot:1,
        isRefresh:false,
        selected: (new Map(): Map<string, boolean>),
    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('分类管理');
    }

    //初始化list
    initList = () => {
        this.currentPage = 1;
        this.pageSize = 23;
        this.condition = null;
    }

    async componentDidMount(){
        super.componentDidMount();
        await this.initBase();
        this.initList();
        this._getBillSort();
    }

    _getBillSort = async () => {
        if(!this.state.refreshing || this.state.foot === 2){

        }else{
            await this.showActivityIndicator();
        }

        try{
            let {type,code,msg,data} = await this.props.postAction(
                appJson.action.billSortFind,
                {
                    parentId:0,
                    currentPage:this.currentPage,
                    pageSize:this.pageSize,
                    condition:this.condition,
                    sortName:'top desc'
                },
                '查询账单分类'
            );
            this.hideActivityIndicator();

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
            return;
        }else{
            this.currentPage++;
        }

        //底部显示 正在加载更多数据
        this.setState({foot:2});
        //获取数据
        this._getBillSort();

    }

    //去详情界面
    _onDetailItem = async (item) => {
        await this.hideAlert();
        this.props.navigation.navigate('BillSortDetail',{
            item:{id:item.id},
            callback:(data)=>{
                this._getBillSort();
            }
        });
    }

    //通过id删除
    _onDeleteItem = async ({item,callback}) => {
        this.showAlert({
            content:'确定删除?',
            buttons:[
                {
                    text:'确定',
                    onPress:async ()=>{
                        await this.showActivityIndicator();

                        try{
                            let {type,code,msg,data} = await this.props.postAction(
                                appJson.action.billSortDeleteById,
                                {id:item.id}, '通过id删除分类'
                            );
                            if(type === appJson.action.billSortDeleteById ){
                                if (code === appJson.action.success) {
                                    this.showToast(msg);
                                    this._onRefresh();
                                    callback(true);
                                }else{
                                    this.showToast(msg);
                                }
                            }
                            this.hideActivityIndicator();
                        }catch (e) {
                            this.handleRequestError(e);
                        }
                    }
                },
                {
                    text: '取消',
                    onPress:this.hideAlert
                }
            ]
        })
    }

    //置顶
    _onTopItem = async ({item,callback}) => {
        await this.showActivityIndicator();

        try{
            let {type,code,msg,data} = await this.props.postAction(
                appJson.action.billSortTopById,
                {id:item.id,top:item.top===1?0:1},
                '置顶'
            );
            this.hideActivityIndicator();

            if(type === appJson.action.billSortTopById){
                if (code === appJson.action.success) {
                    this._onRefresh();
                    callback(true);
                }else{
                    this.showToast(msg);
                }
            }

        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //去添加分类
    _goAddBillSort = () => {
        this.props.navigation.navigate('BillSortAddForm',{
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
        this.initList();
        this._getBillSort();
    }

    _renderRow = ({item}) => {
        return (
            <FlatListItem
                id={item.id}
                onDetailItem={this._onDetailItem}
                onDeleteItem={this._onDeleteItem }
                onTopItem={ this._onTopItem }
                selected={ !!this.state.selected.get(item.id)}
                item={item}
            />
        )
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
                        isShowMiddle={true}//是否显示中间按钮
                        onMiddleBtn={this._goAddBillSort}
                    />
                </View>

                <View style={styles.flatlistView}>
                    <FlatList
                        style={{borderRadius:10,backgroundColor:'#fff'}}
                        data={this.state.data}
                        onRefresh={this._onRefresh}
                        refreshing={this.state.isRefresh}
                        ListFooterComponent={this._footView}
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={0.8}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderRow}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={this._ListEmptyComponent}
                    />
                </View>

                <View style={{height:pxTodpHeight(30)}}/>
            </View>
        )

        return super.renderBase(view);
    }

    _ListEmptyComponent = () =>{
        let cpt = (
            <View style={{flex:1, alignItems:'center', marginTop:pxTodpHeight(100)}}>
                <Image source={nullDataIcon} style={{height:pxTodpHeight(110),width:pxTodpWidth(364),resizeMode:'contain',}}/>
                <Text style={{color:'#999'}}>空空如也~</Text>
            </View>
        )
        return cpt;
    }

    _keyExtractor = (item, index) => index+'';

    _ItemSeparatorComponent = () => <Divider/>
}

// 封装Item组件
class FlatListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onDetailItem(this.props.item);
    };

    //删除
    _onDeleteItem = () => {
        this.props.onDeleteItem({
            item:this.props.item,
            callback:(success)=>{
                success?this._closeSwipeRow():null
            }
        });
    }

    //置顶
    _onTopItem = () => {
        this.props.onTopItem({
            item:this.props.item,
            callback:(success)=>{
                success?this._closeSwipeRow():null
            }
        });
    }

    _closeSwipeRow = () => {
        this.swiperow._animateToClosedPosition();
    }

    render() {
        const item = this.props.item;
        return(
            <SwipeRow ref={ref => this.swiperow=ref} style={styles.itemContain}>
                <View style={{flexDirection: 'row'}}>
                    <Button
                        style={[styles.itemBtn,{backgroundColor: '#dcdcdc'}]}
                        onPress={this._onTopItem}
                    >
                        <Text style={{color:'#fff',fontSize:pxTodpWidth(30)}}>
                            {item.top === 1?'取消置顶':'置顶'}
                        </Text>
                    </Button>

                    <Button
                        style={[styles.itemBtn,{backgroundColor: '#f03'}]}
                        onPress={this._onDeleteItem}
                    >
                        <Text style={{color:'#fff',fontSize:pxTodpWidth(30)}}>删除</Text>
                    </Button>
                </View>

                <TouchableWithoutFeedback onPress={this._onPress}>
                    <View style={styles.itemView}>
                        <Text style={{fontSize:pxTodpWidth(32),color:item.top === 1?'#f03':'#333'}}>
                            {item.name}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </SwipeRow>
        );
    }
}

const styles = StyleSheet.create({
    itemContain:{
        height:pxTodpHeight(104),
        width:undefined,
        backgroundColor:'#00000000',
        // marginHorizontal: pxTodpWidth(30),
    },
    itemView:{
        width:'100%',
        height:'100%',
        justifyContent:'space-around',
        backgroundColor:'#fff',
        paddingVertical: pxTodpHeight(10),
        paddingHorizontal: pxTodpWidth(10),
    },
    itemBtn:{
        height:pxTodpHeight(104),
        borderRadius:0,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal: pxTodpWidth(10),
    },
    flatlistView:{
        flex:1,
        width:undefined,
        paddingHorizontal:pxTodpWidth(30),
        marginTop:pxTodpHeight(30)
    }
});

export default connect(null,actions)(BillSort);