import React,{Component} from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import nullDataIcon from "../../img/common/nullDataIcon.png";
import PropTypes from 'prop-types';
import {pxTodpHeight} from "../../utils/ScreenUtil";



export default class MoreList extends Component{
    static propTypes = {
        isShowActivityIndicator:PropTypes.bool,
        data:PropTypes.array.isRequired,//传入的数据
        headerHeight:PropTypes.number,
        leftWidth:PropTypes.number,
        leftTitle:PropTypes.array.isRequired,
        rightTitle:PropTypes.array.isRequired,
        itemHeadView:PropTypes.any.isRequired,
        itemLeftView:PropTypes.any.isRequired,
        itemRightView:PropTypes.any.isRequired,
        foot:PropTypes.number,//
        onEndReached:PropTypes.any,
        onRefresh:PropTypes.any,
    }

    state = {
        data:[],
        isRefresh:false
    }


    componentWillReceiveProps(nextProps){
        this.setState({data:this.props.data});
    }

    _onMomentumScrollEnd = (self)=> {
        var offSetY = self.nativeEvent.contentOffset.y;  //获取滑动的距离
        var contentSizeHeight = self.nativeEvent.contentSize.height; //scrollView  contentSize 高度
        var oriageScrollHeight = self.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (offSetY + oriageScrollHeight >= contentSizeHeight-1) {
            //加载显示
            this.props.onEndReached();
        }
    }

    _onRefresh = async() => {
        // this.setState({isRefresh:true,whichSelect:-1});
        this.setState({isRefresh:true});
        await this.props.onRefresh();
        this.setState({isRefresh:false});
    }

    render(){
        return this.state.data.length===0?this._ListEmptyComponent():
        <ScrollView
            style={{flex:1,}}
            stickyHeaderIndices={[0]}
            onMomentumScrollEnd={this._onMomentumScrollEnd}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefresh}
                    onRefresh={this._onRefresh}
                />
            }
        >
            {this._ListHeaderComponent()}

            <View style={{flex:1,flexDirection:'row',}}>

                <View style={{width:this.props.leftWidth}}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderLeftItem}
                        scrollEnabled={false}
                        bounces={false}
                    />
                </View>

                <ScrollView
                    horizontal={true}
                    ref={(right)=>this.rightList = right}
                    onScroll={this._rightOnScroll}
                    scrollEventThrottle={20}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <FlatList
                        ref={'rightItemList'}
                        extraData={this.state}
                        data={this.state.data}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderRightItem}
                        scrollEnabled={false}
                    />
                </ScrollView>
            </View>

            {
                this.props.isShowActivityIndicator?(
                    <View style={{flexDirection:'row',marginTop:pxTodpHeight(30), width:undefined, justifyContent:'center',}}>
                        <ActivityIndicator animating={this.props.foot===2}/>
                        <Text style={{color:'#333',fontSize:12}}>
                            {this.props.foot===0?'上拉加载':(this.props.foot===2?'正在加载中...':this.props.foot===1?'没有更多数据了':'')}
                        </Text>
                    </View>
                ):null
            }

        </ScrollView>
    }

    _leftScroll = (self)=> {
        var x = self.nativeEvent.contentOffset.x;
        if (Platform.OS==='ios') {
            this.rightList.setNativeProps({
                contentOffset: {x: x, y: 0, animated: false}
            })
        }

    }

    _rightOnScroll = (self)=> {
        var x = self.nativeEvent.contentOffset.x;
        if (Platform.OS==='ios') {
            this.leftList.setNativeProps({
                contentOffset: {x: x, y: 0, animated: false}
            })
        }else {
            this.leftList.scrollTo({x: x, y: 0, animated: false})
        }
    }

    _renderLeftItem = ({item,index}) => {
        return this.props.itemLeftView(item,index)
    }

    _renderRightItem = ({item,index}) => {
        return this.props.itemRightView(item,index)
    }

    _ListHeaderComponent = () => {
        let headerView = (
            <View style={{
                height:this.props.headerHeight,
                width:undefined,
            }}>

                <View style={{
                    flexDirection:'row',
                    width:this.props.leftWidth,
                    backgroundColor:'#E6F8FF',
                    left:0,
                    top:0,
                    position:'absolute'
                }}>
                    {
                        this.props.leftTitle.map((item,i)=>{
                            return this.props.itemHeadView(item)
                        })
                    }
                </View>

                <ScrollView
                    style={{
                        flex:1,
                        left:this.props.leftWidth,
                        backgroundColor:'#E6F8FF',
                        top:0,
                        position:'absolute'
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    automaticallyAdjustContentInsets={false}
                    onScroll={this._leftScroll}
                    ref={(left)=>this.leftList = left}
                    scrollEventThrottle={20}
                    scrollEnabled={false}
                >
                    {
                        this.props.rightTitle.map((item,i)=>{
                            return this.props.itemHeadView(item)
                        })
                    }
                </ScrollView>


            </View>
        )
        return headerView;
    }

    _keyExtractor = (item, index) => index++ +'';

    _ListEmptyComponent = () =>{
        let cpt = (
            <View style={styles.emptyView}>
                <Image source={nullDataIcon} style={{height:undefined,width:undefined,resizeMode:'contain',}}/>
                <Text style={{color:'#999'}}>空空如也~</Text>
            </View>
        )
        return cpt;
    }
}

const styles = StyleSheet.create({
    emptyView:{
        // marginTop:pxTodpHeight(100),
        alignItems:'center'
    },



})