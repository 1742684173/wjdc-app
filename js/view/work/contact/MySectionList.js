import React,{Component} from 'react';
import {SectionList,StyleSheet,View,Text,Image,TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import PinYinList from './PinYinList';
import nullDataIcon from "../../../img/common/nullDataIcon.png";

const ITEM_HEIGHT = 69; //item的高度
const SECTION_HEIGHT = 27;  //分组头部的高度
const SEPARATOR_HEIGHT = 1;  //分割线的高度

class MySectionList extends Component{

    static propTypes = {
        onRefresh:PropTypes.func,//刷新
        data:PropTypes.array,//传入的数据
    }

    constructor(props){
        super(props);
        this.state = {
            isRefresh:false,
            pinYin:'#',
        }
    }

    render(){
        return(
            <View style={styles.contain}>
                <View style={{width:375}}>
                    {/*联系人列表*/}
                    <SectionList
                        ref='contactList'
                        sections={this.props.data}//数据源
                        onRefresh={this._onRefresh}
                        refreshing={this.state.isRefresh}
                        renderItem={this._renderItem}//item布局
                        keyExtractor={this._extraUniqueKey}
                        renderSectionHeader={this._renderSectionHeader}
                        ItemSeparatorComponent={this._itemSeparatorComponent} //item分隔线
                        showsVerticalScrollIndicator={false}
                        showHorizontalScrollIndicator={false}
                        initialNumToRender={1000}
                        // scrollEnabled={true}//默认是true,false禁止滚动
                        // getItemLayout={(data, index) => (
                        //   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
                        // )}
                        //ListHeaderComponent={this._listHeaderComponent}
                        ListFooterComponent={this._listFooterComponent}
                        ListEmptyComponent={this._listEmptyComponent}//当数据为空时显示
                        onViewableItemsChanged={this._itemChange}
                    />
                </View>

                {/*拼音列表*/}
                <View style={{zIndex:100,top:40,left:-25}}>
                    <PinYinList pinYin={this.state.pinYin} pinYins={this.props.pinYins} selectPinYin={this._selectPinYin}/>
                </View>

            </View>
        )
    }

    _onRefresh = () => {
        this.setState({isRefresh:true});
        this.props.onRefresh();
        this.setState({isRefresh:false});
    }

    //通过字母决定显示联系人的位置
    _selectPinYin = (key) => {
        this.setState({pinYin:key});
        let flag = 0;
        for(let item of this.props.data){
            if(item.key >= key || '#' === key){
                this.refs.contactList.scrollToLocation({animated:true,sectionIndex:flag,itemIndex:-1});
            }else{
                flag += 1;
            }
        }

    }

    //当数据为空时显示
    _listEmptyComponent = () => {
        return(
            <View style={styles.emptyView}>
                <Image source={nullDataIcon} style={{height:105,width:182,resizeMode:'contain',}}/>
                <Text style={{color:'#999'}}>空空如也~</Text>
            </View>
        )
    }

    //设置唯一key
    _extraUniqueKey = (item,index) =>{
        return index++;
    }

    //表头
    _renderSectionHeader = (data) => {
        return(
            <Text style={styles.listHeader}>
                {data.section.key}
            </Text>
        )
    }

    //每一行
    _renderItem = ({item}) =>{
        return(
            <TouchableOpacity
                style={styles.listItemContain}
                onPress={this.props.onItemClick}>
                {/*头像*/}
                <Image
                    source={item.icon}
                    style={styles.listItemImage}/>

                {/*姓名*/}
                <Text style={styles.listItemName}>
                    {item.Yglb_YGXM}
                </Text>

                {/*职位与营业部*/}
                <Text style={styles.listItemDept}>
                    {item.Yglb_GWMC}{'\n'}{item.Yglb_BMMC}
                </Text>
            </TouchableOpacity>
        )
    }

    _listHeaderComponent = () => {
        return <View style={styles.headerView}><Text></Text></View>;
    }

    _listFooterComponent = () => {
        return this.props.data.length > 0 ?
            <View style={styles.footView}></View>:<View/>;
    }

    //分隔线
    _itemSeparatorComponent = () => {
        return <View style={styles.separatorView}/>;
    }

    //当item改动时触发
    _itemChange = (info) =>{
        //console.log(JSON.stringify(info));
        let section = info.viewableItems[0]?info.viewableItems[0].item.key:'';
        section?this.setState({pinYin:section}):null;
    }


}

const styles = StyleSheet.create({
    contain:{
        flexDirection:'row',
        width:375,
        height:575,
    },
    emptyView:{
        justifyContent:'center',
        alignItems:'center',
        margin:50
    },
    headerView:{
        backgroundColor: '#25B960',
        alignItems: 'center',
        height: 0
    },
    separatorView:{
        height:SEPARATOR_HEIGHT,
        paddingHorizontal:15,
        backgroundColor:'#f2f2f2',
    },
    listHeader:{
        backgroundColor:'#f2f2f2',
        height: SECTION_HEIGHT,
        textAlignVertical: 'center',
        color: '#333333',
        fontSize: 16,
        paddingHorizontal:15,
    },
    listItemContain:{
        flexDirection:'row',
        height: ITEM_HEIGHT,
        //justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:15
    },
    listItemImage:{
        width:55,
        height:55,
        borderWidth:1,
        borderColor:'#f2f2f2',
    },
    listItemName:{
        textAlignVertical: 'center',
        marginLeft:12,
        color: '#333333',
        fontSize: 18
    },
    listItemDept:{
        flex:1,
        textAlign:'right',
        paddingRight:23,
        fontSize:13,
        color:'#666666',
    },
    footView:{
        // backgroundColor: '#f2f2f2',
        justifyContent:'center',
        alignItems: 'center',
        height:69
    }
})

export default MySectionList;