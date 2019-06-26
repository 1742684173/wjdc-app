import React,{PureComponent,Component} from 'react';
import {StyleSheet,View,Text,TouchableWithoutFeedback,Image,FlatList} from 'react-native';
import PropTypes from 'prop-types';
import nullDataIcon from "../../../../../img/common/nullDataIcon.png";
import un_select from "../../../../../img/common/un_select1.png";
import select from "../../../../../img/common/select1.png";
import rightIcon from "../../../../../img/common/right.png";
import Button from "../../../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../../../utils/ScreenUtil";

export default class List extends PureComponent {
    static propTypes = {
        data:PropTypes.any,//传入的数据
        onRefresh:PropTypes.func,//刷新数据
        onPress:PropTypes.func,//短按
        onLongPressItem:PropTypes.func,//长按
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
            <View style={{
                flex:1,
                backgroundColor:'#fff',
                marginHorizontal: pxTodpWidth(30),
                borderRadius:pxTodpWidth(20)
            }}>
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

                {/*<Button*/}
                    {/*style={{height:pxTodpHeight(78),backgroundColor:'#21c3ff',}}*/}
                    {/*onPress={()=>{}}*/}
                {/*>*/}
                    {/*<Text style={{fontSize:pxTodpWidth(40), color:'#fff'}}>删除</Text>*/}
                {/*</Button>*/}
            </View>
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

    _onLongPressItem = (item) => {
        this.props.onLongPress(item);
    }

    _renderItem = ({item}) => {
        return(
            <FlatListItem
                id={item}
                onPressItem={ this._onPressItem }
                onLongPressItem={ this._onLongPressItem }
                selected={ !!this.state.selected.get(item)}
                item={item}
            />
        )
    }

    //行之间的分隔线
    _ItemSeparatorComponent(){
        return(
            <View style={{backgroundColor:'#dcdcdc',height:pxTodpHeight(1)}}/>
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

// 封装Item组件
class FlatListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    }

    _onLongPress = () => {
        this.props.onLongPressItem(this.props.id);
    };

    render() {
        const item = this.props.item;
        return(
            <Button
                style={styles.container}
                onPress={this._onPress}
                onLongPress={this._onLongPress}
            >
                {/*<Image source={this.props.selected?select:un_select}/>*/}
                <Text style={{fontSize:pxTodpWidth(32),color:item.top === 1?'#f03':'#333'}}>
                    {item.name}
                </Text>
                <Image source={rightIcon}/>
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width:pxTodpWidth(690),
        height:pxTodpHeight(104),
        backgroundColor:'#fff',
        justifyContent:'space-between',
        alignItems: 'center',
        paddingHorizontal: pxTodpWidth(30)
    },

    emptyView:{
        flex:1,
        alignItems:'center',
        marginTop:pxTodpHeight(100)
    },
})
