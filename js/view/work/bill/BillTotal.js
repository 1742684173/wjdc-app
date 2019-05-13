import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import BillsFlatList from './BillsFlatList';
import LoadView from '../../../common/LoadView';
import Search from '../../../common/Search';
import {connect} from 'react-redux';
import * as config from '../../../config';
import * as actions from '../../../actions';
import BillTotalLabel from './BillTotalLabel';
import BaseComponent from '../../base/BaseComponent';

class BillTotal extends BaseComponent {

    state = {
        data:[],
        selectLabel:{sortName:'dates desc'},//筛选的结果
    }

    // 构造
    constructor(props) {
        super(props);
        this.setTitle('消费统计');
    }

    componentDidMount = async () => {
        try{

        }catch (e) {
            this.showToast(JSON.stringify(e));
        }

    }

    renderLabel(){
        return (
            <BillTotalLabel
                method={this.state.selectMethod}
                sort={this.state.selectSort}
                hideModal={()=>this.initBase()}
                onSubmit={this._sumbit}
                onReset={this._reset}
                onRequestClose={()=>this.initBase()}
                selectLabel={this.state.selectLabel}
            />
        )
    }

    _getBillList = async () => {
        this.showActivityIndicator();

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
                method:this.method,
                sort:this.sort,
            });
            const {type,code,msg,data} =
                await this.props.postAction(config.BILL_FIND,params,'查询消费');
            if(type === config.BILL_FIND){
                if (code === config.CODE_SUCCESS) {
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
                    this.hideActivityIndicator();
                } else {
                    this.handleRequestError(code,msg);
                }
            }

        }catch (e) {
            this.showToast(e.message || e.note);
        }
    }

    _dealParams = (params:Object) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //消费类别
            case config.BILL_SORT_FIND:

                break;

            default:
                break;

        }
    }

    _reset = async () => {
        this.initLabel();
        await this.setState({selectLabel:{}});
        await this._getBillList();
    }

    //根据条件查询
    _sumbit = async (obj) => {
        this.currentPage = 1;

        this.startTime = obj.startTime;
        this.endTime = obj.endTime;

        switch (obj.type) {
            case 'in':
                this.minSum = obj.minSum?obj.minSum:0;
                this.maxSum = obj.maxSum;
                break;

            case 'out':
                this.minSum = obj.maxSum?-1*obj.maxSum:null;
                this.maxSum = 0;
                break;

            default:break;
        }

        this.method = obj.method;
        this.sort = obj.sort;

        await this.setState({selectLabel:obj});

        await this._getBillList();
    }

    render() {
        super.render();
        let view = (
            <View style={styles.contain}>

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

export default connect(null,actions)(BillTotal);