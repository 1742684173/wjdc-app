import React,{Component} from 'react';
import {StyleSheet,View,Text,TouchableWithoutFeedback,Image,FlatList} from 'react-native';
import PropTypes from 'prop-types';
import nullDataIcon from "../../../../img/common/nullDataIcon.png";
import moment from "moment";
import Button from "../../../common/Button";
import SwipeRow from "../../../common/SwipeRow";
import Divider from "../../../common/Divider";
import {pxTodpHeight, pxTodpWidth} from "../../../../utils/ScreenUtil";
import {formatDate, formatDateToWeek} from "../../../../utils/ToolUtil";

export default class HistoryList extends Component{
    static propTypes = {
        data:PropTypes.any,//传入的数据
        onRefresh:PropTypes.func,//刷新数据
        onItemClick:PropTypes.func,//点击item事件
        onDeleteItem:PropTypes.func,//删除
    }

    constructor(props){
        super(props);
        this.state = {
            isRefresh:false,
        }
    }

    _onRefresh = async() => {
        this.setState({isRefresh:true});
        await this.props.onRefresh();
        this.setState({isRefresh:false});
    }

    //去事件详情界面
    _goDetail = (item) => {
        this.props.onItemClick(item);
    }

    render(){
        return(
            <FlatList
                data={this.props.data}
                onRefresh={this._onRefresh}
                refreshing={this.state.isRefresh}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={this._ListEmptyComponent}
                ListFooterComponent={this.props.footView}
                onEndReached={this.props.onEndReached}
                onEndReachedThreshold={1}
                ItemSeparatorComponent={this._ItemSeparatorComponent}
            />
        );
    }

    _keyExtractor = (item, index) => index+++'';

    _onDeleteItem = (item) => {
        this.props.onDeleteItem(item);
        this.swiperow._animateToClosedPosition();
    }

    _renderItem = ({item}) => {

        return (
            <SwipeRow style={styles.itemView} ref={ref=>this.swiperow=ref}>
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

    //行之间的分隔线
    _ItemSeparatorComponent(){
        return(
            <View style={{height:pxTodpHeight(24),}}/>
        )
    }

    _ListEmptyComponent = () =>{
        let cpt = (
            <View style={styles.emptyView}>
                <Image source={nullDataIcon} style={{height:pxTodpHeight(110),width:pxTodpWidth(364),resizeMode:'contain',}}/>
                <Text style={{color:'#999'}}>空空如也~</Text>
            </View>
        )
        return cpt;
    }

}

const styles = StyleSheet.create({
    itemView:{
        // borderRadius:pxTodpWidth(10),
        height:pxTodpHeight(160),
        width:undefined,
        backgroundColor:'#00000000',
        marginHorizontal: pxTodpWidth(30),
    },
    emptyView:{
        flex:1,
        alignItems:'center',
        marginTop:pxTodpHeight(100)
    },
    topView:{
        height:pxTodpHeight(60),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderColor:'#dcdcdc',
    },
    div1:{
        height:pxTodpHeight(40),
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderLeftWidth:0,
        borderTopRightRadius:pxTodpWidth(30),
        borderBottomRightRadius:pxTodpWidth(30),
        paddingLeft:pxTodpWidth(14),
        paddingRight:pxTodpWidth(14),
    }
})