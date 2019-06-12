import React,{Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {phoneCall,sendMessage} from "../../../utils/ToolUtil";
import {connect} from 'react-redux';
import * as actions from '../../../actions';

class ContactDetail extends Component{
    static navigationOptions = ({navigation}) => ({
        title:'员工详情',
    })

    constructor(props){
        super(props);
        this.state = {
            isLoad:true,
            ygxq:{},
            isShowDialog:false,//显示圣诞框
            phoneList:[],//电话列表
            //Yglb_YGID:props.navigation.state.params.Yglb_YGID
        }
    }

    componentDidMount(){
        this._getContactDetail({i_nYgID:this.props.navigation.state.params.item.Yglb_YGID});
    }

    //获取联系人详情
    _getContactDetail = async(object:Object) =>{
        let error = '';
        // try{
        //   let {type,code,data,note} = await this.props.ygxqAction(object);
        //   if(type === actionType.MMS_A_YGXQ){
        //     if(code === 1){
        //       if(data.code === 1){
        //         this.setState({ygxq:data.records[0]});
        //       }else{
        //         error = data.note;
        //       }
        //     }else{
        //       error = note;
        //     }
        //   }
        // }catch (e) {
        //   error = e.message || e.note;
        // }

        this.setState({isLoad:false,});
        if(error.length > 0){
            // toast.toastLong(error);
        }
    }

    //打电话 发短信
    _phone = (phone,isSendMsg) => {
        let arr = phone.split('/');
        if(arr.length > 1){
            this.setState({phoneList:{isSendMsg:isSendMsg,data:arr},isShowDialog:true});
        }else{
            isSendMsg?sendMessage(arr[0]):phoneCall(arr[0], true);
            this.setState({isShowDialog:false});
        }
    }

    render(){

        return(
            <View style={styles.contain}>

                <View style={[styles.div,{height:164}]}>
                    <Image source={this.state.ygxq.Ygxq_YGXB} resizeMode={'contain'} style={styles.icon}/>
                    <Text style={{fontSize:19,color:'#333333'}}>
                        {this.state.ygxq.Ygxq_YGXM}
                    </Text>
                    <View style={{flexDirection:'row',alignItems:'center',}}>
                        <TouchableOpacity
                            style={styles.msgAndTel}
                            onPress={()=>this._phone(this.state.ygxq.Ygxq_LXDH,true)}>
                            <Image source={require('../../../img/common/message.png')}
                                   style={{width:42,height:42}}/>
                            <Text style={{fontSize:14,color:'#666666'}}>发短信</Text>
                        </TouchableOpacity>

                        <View style={{backgroundColor:'#dcdcdc',width:1,height:35}}/>

                        <TouchableOpacity style={styles.msgAndTel}
                                          onPress={()=>this._phone(this.state.ygxq.Ygxq_LXDH,false)}>
                            <Image source={require('../../../img/common/phone.png')}
                                   style={{width:42,height:42}}/>
                            <Text style={{fontSize:14,color:'#666666'}}>打电话</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.div,{height:121}]}>
                    {this.renderItem('编   号',this.state.ygxq.Ygxq_YGBH)}
                    {this.renderItem('职   位',this.state.ygxq.Ygxq_GWMC)}
                    {this.renderItem('部   门',this.state.ygxq.Ygxq_BMMC)}
                </View>

                <View style={[styles.div,{height:185}]}>
                    {this.renderItem('联系电话',...(''+this.state.ygxq.Ygxq_LXDH).split('/'))}
                    {this.renderItem('电子邮箱',this.state.ygxq.Ygxq_DZYX)}
                    {this.renderItem('入职日期',this.state.ygxq.Ygxq_RZRQ)}
                    {this.renderItem('在职状态',this.state.ygxq.Ygxq_ZZZT)}
                    {this.renderItem('工作地点',this.state.ygxq.Ygxq_GZDD)}
                </View>

            </View>
        )
    }

    renderItem(title,...values){
        let value = values.length===0?null:
            values.map((item,i)=>{
                return(
                    <Text key={i} style={{color:'#333'}}>{item}
                        {i===values.length-1?null:<Text style={{color:'#333333'}}> / </Text>}
                    </Text>
                )
            })
        return(
            <View style={[styles.itemDiv]}>
                <Text style={{fontSize:14,color:'#666666'}}>{title}</Text>
                <Text style={{fontSize:14,color:'#333333'}}>{value}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contain:{
        flex:1,
        //backgroundColor:''
        width:'100%',
    },
    div:{
        width:345,
        marginTop:12,
        marginHorizontal:15,
        alignItems:'center',
        backgroundColor:'#ffffff',
        borderRadius:10,
    },
    icon:{
        width:43,
        height:85,
        marginTop:8,
    },
    msgAndTel:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:172,
        height:45
    },
    itemDiv:{
        width:315,
        height:36,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-end',
        marginHorizontal:15,
        borderBottomWidth:1,
        borderBottomColor:'#dcdcdc',
    }
})

export default connect(null,actions)(ContactDetail);