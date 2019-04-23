import React,{Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {pxTodpHeight,pxTodpWidth,ScreenWidth} from "../../../common/ScreenUtil";
import {phoneCall,sendMessage} from "../../../common/Tool";
import MyDialog from "../../../common/MyDialog";
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import MyPhoneFlatList from '../../MyPhoneFlatList';
import * as toast from "../../../common/MyToast";
import Back from "../../../common/Back";

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
      toast.toastLong(error);
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

        <MyDialog isLoad={true} visible={this.state.isLoad} onRequestClose={()=>{}}/>

        <MyDialog
          isChild={true}
          child={
            <MyPhoneFlatList
              data={this.state.phoneList}
              onSelectPhone={this._phone}
              cancel={()=>this.setState({isShowDialog:false})}
            />
          }
          visible={this.state.isShowDialog}
          onRequestClose={()=>this.setState({isShowDialog:false})}/>

        <View style={[styles.div,{height:pxTodpHeight(328)}]}>
          <Image source={this.state.ygxq.Ygxq_YGXB} resizeMode={'contain'} style={styles.icon}/>
          <Text style={{fontSize:pxTodpWidth(38),color:'#333333'}}>
            {this.state.ygxq.Ygxq_YGXM}
          </Text>
          <View style={{flexDirection:'row',alignItems:'center',}}>
            <TouchableOpacity
              style={styles.msgAndTel}
              onPress={()=>this._phone(this.state.ygxq.Ygxq_LXDH,true)}>
              <Image source={require('../../../img/common/message.png')}
                     style={{width:pxTodpWidth(83),height:pxTodpHeight(83)}}/>
              <Text style={{fontSize:pxTodpWidth(28),color:'#666666'}}>发短信</Text>
            </TouchableOpacity>

            <View style={{backgroundColor:'#dcdcdc',width:1,height:pxTodpHeight(70)}}/>

            <TouchableOpacity style={styles.msgAndTel}
                              onPress={()=>this._phone(this.state.ygxq.Ygxq_LXDH,false)}>
              <Image source={require('../../../img/common/phone.png')}
                     style={{width:pxTodpWidth(83),height:pxTodpHeight(83)}}/>
              <Text style={{fontSize:pxTodpWidth(28),color:'#666666'}}>打电话</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.div,{height:pxTodpHeight(242)}]}>
          {this.renderItem('编   号',this.state.ygxq.Ygxq_YGBH)}
          {this.renderItem('职   位',this.state.ygxq.Ygxq_GWMC)}
          {this.renderItem('部   门',this.state.ygxq.Ygxq_BMMC)}
        </View>

        <View style={[styles.div,{height:pxTodpHeight(390)}]}>
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
        <Text style={{fontSize:pxTodpWidth(28),color:'#666666'}}>{title}</Text>
        <Text style={{fontSize:pxTodpWidth(28),color:'#333333'}}>{value}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    //backgroundColor:''
    width:ScreenWidth,
  },
  div:{
    width:pxTodpWidth(690),
    marginTop:pxTodpHeight(24),
    marginHorizontal:pxTodpWidth(30),
    alignItems:'center',
    backgroundColor:'#ffffff',
    borderRadius:pxTodpWidth(20),
  },
  icon:{
    width:pxTodpWidth(170),
    height:pxTodpHeight(170),
    marginTop:pxTodpHeight(15),
    //borderRadius:pxTodpHeight(170),
    //resizeMode:'contain',
  },
  msgAndTel:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:pxTodpWidth(344),
    height:pxTodpHeight(91)
  },
  itemDiv:{
    width:pxTodpWidth(630),
    height:pxTodpHeight(72),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-end',
    marginHorizontal:pxTodpWidth(30),
    borderBottomWidth:1,
    borderBottomColor:'#dcdcdc',
  }
})

export default connect(null,actions)(ContactDetail);