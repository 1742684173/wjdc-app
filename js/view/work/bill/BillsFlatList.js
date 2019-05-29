import React,{Component} from 'react';
import {FlatList,StyleSheet,View,Text,TouchableOpacity,Image} from 'react-native';
import PropTypes from 'prop-types';
import nullDataIcon from "../../../img/common/nullDataIcon.png";
import moment from "moment";

export default class BillsFlatList extends Component{
    static propTypes = {
        data:PropTypes.any,//传入的数据
        onRefresh:PropTypes.func,//刷新数据
        onItemClick:PropTypes.func,//点击item事件
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
            <TouchableOpacity style={styles.itemView} onPress={()=>this._goDetail(item)}>

                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    {/*分类名称*/}
                    <Text style={{fontSize:15}}>
                        {item.sortName}
                    </Text>
                    {/*分类金额*/}
                    <Text style={{color:item.type === -1?'#00cd00':'#f03',fontSize:15}}>
                        {item.type === -1?'-':'+'}{item.sums}
                    </Text>
                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{color:'#999',fontSize:12}}>
                        来源:{item.methodName}
                    </Text>
                    <Text style={{color:'#999',fontSize:12}}>
                        时间:{moment(item.dates).format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                </View>

            </TouchableOpacity>
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
        justifyContent:'space-around',
        height:50,
        // width:'100%',
        backgroundColor:'#ffffff',
        borderRadius:10,
        paddingHorizontal:5,
        marginHorizontal:15,
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