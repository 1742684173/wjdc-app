import React,{Component} from 'react';
import {View, StyleSheet, Animated,} from 'react-native';
import Search from '../../common/Search';
import * as actions from '../../../actions';
import {connect} from 'react-redux';
import MySectionList from './MySectionList';

class Contact extends Component{

    static navigationOptions = ({navigation}) =>({
        title:'通讯录',
    })

    constructor(props){
        super(props);
        this.state = {
            isLoad:false,
            pinYin:'A',
            pinYins:'',
            data: [],
        }
    }

    componentDidMount(){
        this._getContactList({});
    }

    //查询联系人列表
    _getContactList = async(object:Object) => {
        let error = '';
        // try{
        //   let contacts = await this.props.yglbAction(Object.assign(object,{i_nPageRows:9999,i_sSortName:'YGLB_XMSZM'}));
        //   if(contacts.type === actionType.MMS_A_YGLB){
        //     if(contacts.code === 1){
        //       if(contacts.data.code === 1){
        //         let data = [];
        //         let flag = {};
        //         let pinYins = '';
        //
        //         //处理格式
        //         contacts.data.records.map((item,i)=>{
        //           let key = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').includes(item.Yglb_XMSZM)?item.Yglb_XMSZM:'#';
        //           if(!flag[key]){
        //             data.push({key:key,data:[item]});
        //             pinYins += key;
        //             flag[key] = item;
        //           }else{
        //             for(let i=0;i<data.length;i++){
        //               if(data[i].key === key){
        //                 data[i].data.push(item);
        //                 break;
        //               }
        //             }
        //           }
        //         });
        //         console.log('index---->2');
        //         this.setState({data:data,pinYins:pinYins});
        //       }else{
        //         error = contacts.data.note;
        //       }
        //
        //     }else{
        //       error = contacts.note;
        //     }
        //   }
        // }catch (e) {
        //   error = e.message || e.note;
        //     //alert(e.message || e.note)
        // }

        this.setState({isLoad:false,});
        if(error.length > 0){
            toast.toastLong(error);
        }
    }

    //根据名称搜索
    _searchContact = (value) => {
        this._getContactList({'i_sCxtj':value});
    }

    //刷新
    _onRefresh = async() =>{
        await this._getContactList({});
    }

    _onItemClick = (item) => {
        this.props.navigation.navigate('ContactDetail',{item})
    }

    render(){
        return(
            <View keyboardDismissMode={'on-drag'} style={{backgroundColor:'#ffffff'}}>


                <Search
                    placeholder={'请输入姓名'}
                    onSearchBtn={this._searchContact}
                    isShowAdd={false}
                    onAddBtn={()=>{}}/>

                <MySectionList
                    data={this.state.data}
                    pinYins={this.state.pinYins}
                    navigation={this.props.navigation}
                    onRefresh={this._onRefresh}
                    onItemClick={this._onItemClick}
                />

            </View>
        )
    }

}

const styles = StyleSheet.create({
    searchContain:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#F2F2F2',
        marginVertical:6,
        marginHorizontal:15,
        borderRadius:3,
        height:28,
    },
    inputView:{
        flex:1,
        height:45,
        marginHorizontal:10,
        fontSize:13,
    },
    searchImage:{
        height:20,
        width:20,
        marginRight:12,
        resizeMode :'contain',
    },

})

export default connect(null, actions)(Contact);
