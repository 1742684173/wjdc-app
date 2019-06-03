import React,{Component} from 'react';
import {PanResponder,Animated,FlatList,StyleSheet,View,Text,ScrollView,Image} from 'react-native';
import PropTypes from 'prop-types';
import nullDataIcon from "../../../img/common/nullDataIcon.png";
import moment from "moment";
import Button from "../../common/Button";
import SwipeRow from "../../common/SwipeRow";

export default class BillsFlatList extends Component{
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

    _renderItem = ({item}) => {

        return (
            <SwipeRow style={styles.itemView}>
                <Button
                    style={{
                        width:40,
                        height:50,
                        backgroundColor: '#f03',
                        borderRadius: 0,
                        justifyContent:'center',
                        alignItems:'center',
                    }}
                    onPress={()=>this.props.onDeleteItem(item)}
                >
                    <Text style={{color:'#fff',fontSize:12}}>删除</Text>
                </Button>

                <Button
                    style={{
                        borderRadius:0,
                        // borderBottomLeftRadius:5,
                        // borderTopLeftRadius:5,
                        width:'100%',
                        height:'100%',
                        justifyContent:'space-around',
                        backgroundColor:'#fff',
                        paddingHorizontal: 5
                    }}
                    onPress={()=>this._goDetail(item)}
                >

                    <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                        {/*分类名称*/}
                        <Text style={{fontSize:15}}>
                            {item.sortName}
                        </Text>
                        {/*分类金额*/}
                        <Text style={{color:item.type === -1?'#00cd00':'#f03',fontSize:15}}>
                            {item.type === -1?'-':'+'}{item.sums}
                        </Text>
                    </View>

                    <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{color:'#999',fontSize:12}}>
                            来源:{item.methodName}
                        </Text>
                        <Text style={{color:'#999',fontSize:12}}>
                            时间:{moment(item.dates).format("YYYY-MM-DD HH:mm:ss")}
                        </Text>
                    </View>

                </Button>
            </SwipeRow>
        );
    }

    //行之间的分隔线
    _ItemSeparatorComponent(){
        return(
            <View style={{height:12,}}/>
        )
    }

    _ListEmptyComponent = () =>{
        let cpt = (
            <View style={styles.emptyView}>
                <Image source={nullDataIcon} style={{height:105,width:182,resizeMode:'contain',}}/>
                <Text style={{color:'#999'}}>空空如也~</Text>
            </View>
        )
        return cpt;
    }

}

const styles = StyleSheet.create({
    itemView:{
        //alignItems:'center',
        height:50,
        width:undefined,
        backgroundColor:'#fff',
        marginHorizontal: 15,
    },
    emptyView:{
        flex:1,
        alignItems:'center',
        marginTop:50
    },
    topView:{
        height:30,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderColor:'#dcdcdc',
    },
    div1:{
        height:20,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderLeftWidth:0,
        borderTopRightRadius:15,
        borderBottomRightRadius:15,
        paddingLeft:7,
        paddingRight:7,
    }
})