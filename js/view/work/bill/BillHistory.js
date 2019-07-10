import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList, BackHandler, TouchableWithoutFeedback,} from 'react-native';
import LoadView from '../../common/LoadView';
import Search from '../../common/Search';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BillLabel from './common/HistoryLabel';
import BaseComponent from '../../base/BaseComponent';
import SwipeRow from "../../common/SwipeRow";
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import {formatDate, formatDateToWeek} from "../../../utils/ToolUtil";
import Divider from "../../common/Divider";


class BillHistory extends BaseComponent {

    state = {
        isRefresh:false,
        total:0,//事件总数
        foot:1,
        data:[],
        sort:[],//分类
        label:[],//标签
        selectLabel:{sortName:'dates desc',type:'all',labelId:'all',sortId:'all'},//筛选的结果
    }

    // 构造
    constructor(props) {
        super(props);
        this.setTitle('历史记录');

        this.initList();
        this.initLabel();
    }

    //初始化list
    initList = () => {
        this.currentPage = 1;
        this.pageSize = 20;
        this.condition = null;
    }

    //初始化label
    initLabel = () => {
        this.type = null;
        this.sortName = 'dates desc';
        this.startTime = null;
        this.endTime = null;
        this.minSum = null;
        this.maxSum = null;
        this.labelId = null;
        this.sortId = null;
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
        this.showActivityIndicator();
        try{
            //分类
            const sortData = await this.props.postAction(appJson.action.billSortFind,{},'查询消费类别');
            this._dealParams(sortData);

            //方式
            const labelData = await this.props.postAction(appJson.action.billLabelFind,{},'查询消费方式');
            this._dealParams(labelData);

            await this._getBillList();
        }catch (e) {
            this.handleRequestError(e);
        }

    }

    renderLabel(){
        return (
            <BillLabel
                label={this.state.label}
                sort={this.state.sort}
                selectLabel={this.state.selectLabel}
                hideModal={()=>this.hideActivityIndicator()}
                onSubmit={this._onSumbit}
                onReset={this._onReset}
                onRequestClose={()=>this.initBase()}
                selectLabel={this.state.selectLabel}
            />
        )
    }

    _getBillList = async () => {
        if(!this.state.refreshing){
            await this.showActivityIndicator();
        }

        try{
            //帐单
            let params= Object.assign({
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                condition:this.condition,
                sortName:this.sortName,
                type:this.type,
                startTime:this.startTime,
                endTime:this.endTime,
                minSum:this.minSum,
                maxSum:this.maxSum,
                labelId:this.labelId,
                sortId:this.sortId,
            });
            const {type,code,msg,data} =
                await this.props.postAction(appJson.action.billFind,params,'查询消费');
            if(type === appJson.action.billFind){
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

                    this.setState({isRefresh:false,foot:foot,data:myData});
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
        this._getBillList();
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
        this._getBillList();
    }

    _onRefresh = () => {
        this.initList();
        this.refs.search.clearSearchInput();
        this._getBillList()
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
    _onDetailPress = (item) => {
        this.props.navigation.navigate('BillDetail', {
            item:{id:item.id},
            callback:(data)=>{
                this._onRefresh();
            }
        })
    }

    //去新增帐单界面
    _onAddBtn = () => {
        this.props.navigation.navigate('BillAddForm',{
            callback:(data)=>{
                this._onRefresh();
            }});
    }

    // 筛选
    _onSelectBtn = async () => {

        await this.setState({
            dialogType:'others',//load alert others
            isDialogVisible:true,//是否显示加载框
            dialogContent:this.renderLabel(),//当dialogType为alert时是字符串，当是others时是相关控件
            dialogOnRequestClose:()=>{},//modal返回监听
            dialogOnShowClose:()=>{}//modal显示之前调用
        });
    }

    _onDeleteItem = async ({item,callback}) => {
        console.log(JSON.stringify(item));
        this.showAlert({
            content:'确认删除?',
            buttons:[
                {
                    text:'确认',
                    onPress:async ()=>{
                        await this.showActivityIndicator();
                        try{
                            //方式
                            const {code,type,msg} = await this.props.postAction(appJson.action.billDeleteById,{id:item.id},'通过id删除帐单');
                            this.hideActivityIndicator();
                            if(type === appJson.action.billDeleteById){
                                if(code === appJson.action.success){
                                    this.showToast(msg);
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
                },
                {
                    text:'取消',
                    onPress:()=> this.hideActivityIndicator()
                }
            ]
        });
    }

    _dealParams = (params:Object) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //消费类别
            case appJson.action.billSortFind:
                if(code === appJson.action.success){
                    if(data.totalCount > 0){
                        this.setState({sort:data.list});
                    }
                }
                break;

            //消费方式
            case appJson.action.billLabelFind:
                let selectLabel = [];
                if(code === appJson.action.success){
                    if(data.totalCount > 0){
                        this.setState({label:data.list});
                    }
                }
                break;

            default:
                break;

        }
    }

    _onReset = async () => {
        this.initLabel();
        await this.setState({selectLabel:{sortName:'dates desc',type:'all',labelId:'all',sortId:'all'}});
        await this._getBillList();
    }

    //根据条件查询
    _onSumbit = async (obj) => {
        console.log('---------'+JSON.stringify(obj));
        this.currentPage = 1;

        this.type = obj.type === 'all'?null:obj.type;
        this.startTime = obj.startTime;
        this.endTime = obj.endTime;
        this.sortName = obj.sortName;
        this.minSum = obj.minSum;
        this.maxSum = obj.maxSum;
        this.labelId = obj.labelId === 'all'?null:obj.labelId;
        this.sortId = obj.sortId === 'all'?null:obj.sortId;

        await this.setState({selectLabel:obj});

        await this._getBillList();
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
                        // beforeImg={beforeImg}//图标
                        isShowMiddle={true}//是否显示中间按钮
                        onMiddleBtn={this._onAddBtn}
                        // middleImg={middleImg}//图标
                        isShowBehind={true}//是否显示后面按钮
                        onBehindBtn={this._onSelectBtn}
                        // behindImg={behindImg}//图标
                    />
                </View>

                <FlatList
                    data={this.state.data}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.isRefresh}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderRow}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this._ListEmptyComponent}
                    ListFooterComponent={this._footView}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={1}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                />

            </View>
        )

        return super.renderBase(view);
    }

    _renderRow = ({item}) => {
        return (
            <FlatListItem
                id={item.id}
                onDetailItem={ this._onDetailPress }
                onDeleteItem={this._onDeleteItem }
                item={item}
            />
        )
    }

    _keyExtractor = (item, index) => index+'';

    _ItemSeparatorComponent = () => <View style={{height:pxTodpHeight(24),}}/>

}

// 封装Item组件
class FlatListItem extends React.PureComponent {
    _goDetail = () => {
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


    _closeSwipeRow = () => {
        this.swiperow._animateToClosedPosition();
    }

    render() {
        const item = this.props.item;
        return(
            <SwipeRow
                style={{ height:pxTodpHeight(160), width:undefined, backgroundColor:'#00000000', marginHorizontal: pxTodpWidth(30),}}
                ref={ref=>this.swiperow=ref}
            >
                <Button
                    style={{
                        width:pxTodpWidth(100),
                        height:pxTodpHeight(160),
                        backgroundColor: '#f03',
                        borderRadius:pxTodpWidth(10),
                        justifyContent:'center',
                        alignItems:'center',
                    }}
                    onPress={()=>this._onDeleteItem(item)}
                >
                    <Text style={{color:'#fff',fontSize:pxTodpWidth(30)}}>删除</Text>
                </Button>

                <TouchableWithoutFeedback onPress={()=>this._goDetail(item)}>

                    <View style={{
                        borderRadius:pxTodpWidth(10),
                        width:'100%',
                        height:'100%',
                        justifyContent:'space-around',
                        backgroundColor:'#fff',
                        paddingVertical: pxTodpHeight(10),
                        paddingHorizontal: pxTodpWidth(10),
                    }}>
                        <View style={{flex:1,width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                            {/*分类名称*/}
                            <Text ellipsizeMode={'tail'} style={{flex:1,fontSize:pxTodpWidth(30)}}>
                                {item.sortName}
                                <Text ellipsizeMode={'tail'} style={{flex:1,textAlign:'right',color:'#666',fontSize:pxTodpWidth(24)}}>({
                                    formatDateToWeek(formatDate(item.dates,"YYYY-MM-DD"))+' '
                                    +formatDate(item.dates,"HH:mm:ss")
                                })</Text>
                            </Text>

                            {/*分类金额*/}
                            <Text ellipsizeMode={'tail'} style={{flex:1,textAlign:'right',color:item.type === -1?'#00cd00':'#f03',fontSize:pxTodpWidth(30)}}>
                                {item.type === -1?'-':'+'}{item.sums}
                            </Text>
                        </View>

                        <Divider style={{width:'100%',height:1,backgroundColor:'#dcdcdc',marginVertical: pxTodpHeight(10)}}/>
                        <View style={{width:'100%',flex:2}}>
                            <Text ellipsizeMode={'tail'} style={{flex:1,color:'#999',fontSize:pxTodpWidth(24)}} ellipsizeMode={'tail'}>
                                详情：{item.descs}
                            </Text>

                            <Text ellipsizeMode={'tail'} style={{flex:1,color:'#999',fontSize:pxTodpWidth(24)}} ellipsizeMode={'tail'}>
                                标签：{item.labelName}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </SwipeRow>
        );
    }
}

const styles = StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:'#f2f2f2',
    },
});

export default connect(null,actions)(BillHistory);