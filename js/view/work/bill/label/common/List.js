import React,{PureComponent,Component} from 'react';
import {StyleSheet,View,Text,TouchableWithoutFeedback,Image,FlatList} from 'react-native';
import PropTypes from 'prop-types';
import nullDataIcon from "../../../../../img/common/nullDataIcon.png";
import un_select from "../../../../../img/common/un_select1.png";
import select from "../../../../../img/common/select1.png";
import rightIcon from "../../../../../img/common/right.png";
import Button from "../../../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../../../utils/ScreenUtil";
import SwipeRow from "../../../../common/SwipeRow";

export default class List extends PureComponent {
    static propTypes = {
        data:PropTypes.any,//传入的数据
        onRefresh:PropTypes.func,//刷新数据
        onPress:PropTypes.func,//短按
        onDeleteItem:PropTypes.func,//删除
        // onItemClick:PropTypes.func,//点击item事件
        // onDeleteItem:PropTypes.func,//删除
    }

    state = {
        isRefresh:false,//是否刷新
        selected: (new Map(): Map<string, boolean>),
    }

    componentDidMount(){
        //传过来的值作为选中的
        // this.props.extraData.map((item,i)=>{
        //     this.setState((state) => {
        //         const selected = new Map(state.selected);
        //         selected.set(item, !selected.get(item));
        //         return {selected};
        //     });
        // });
    }

    render(){
        return  (
            <FlatList
                data={this.props.data}
                extraData={this.state}
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
        )
    }

    _onRefresh = async() => {
        this.setState({isRefresh:true});
        await this.props.onRefresh();
        this.setState({isRefresh:false});
    }

    _keyExtractor = (item, index) => index+'';

    _onPressItem = (item) => {
        this.props.onPress(item);
        // this.setState((state) => {
        //     const selected = new Map(state.selected);
        //     selected.set(item, !selected.get(item));
        //     return {selected};
        // });
    }

    _renderItem = ({item}) => {
        return(
            <SwipeRow style={{
                height:pxTodpHeight(104),
                width:undefined,
                backgroundColor:'#00000000',
                marginHorizontal: pxTodpWidth(30),
            }}>
                <Button
                    style={{
                        width:pxTodpWidth(100),
                        height:pxTodpHeight(104),
                        backgroundColor: '#f03',
                        borderRadius:pxTodpWidth(10),
                        justifyContent:'center',
                        alignItems:'center',
                    }}
                    onPress={()=>this.props.onDeleteItem(item)}
                >
                    <Text style={{color:'#fff',fontSize:pxTodpWidth(30)}}>删除</Text>
                </Button>

                <View
                    style={{
                        borderRadius:pxTodpWidth(10),
                        width:'100%',
                        height:'100%',
                        justifyContent:'space-around',
                        backgroundColor:'#fff',
                        paddingVertical: pxTodpHeight(10),
                        paddingHorizontal: pxTodpWidth(10),
                    }}
                    onPress={this._onPress}
                >
                    {/*<Image source={this.props.selected?select:un_select}/>*/}
                    <Text style={{fontSize:pxTodpWidth(32),color:item.top === 1?'#f03':'#333'}}>
                        {item.name}
                    </Text>
                </View>
            </SwipeRow>
        );
    }

    //行之间的分隔线
    _ItemSeparatorComponent(){
        return(
            <View style={{backgroundColor:'#00000000',height:pxTodpHeight(5)}}/>
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
    container: {
        borderRadius:pxTodpWidth(10),
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        paddingVertical: pxTodpHeight(10),
        paddingHorizontal: pxTodpWidth(10),
    },

    emptyView:{
        flex:1,
        alignItems:'center',
        marginTop:pxTodpHeight(100)
    },
})
