import React, {Component} from 'react';
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
}from 'react-native';
export type Props = {
    type?:string,//类形: load->加载框 alert->弹出框 others->自定义  默认是load
    visible:boolean,//是否显示
    title?:string,//标题
    content?:any,//内容
    buttons?:Array,
    onRequestClose?:Function,
    onShow?:Function,//显示前调用
}

class MyDialog extends Component{
    state = {
        visible:false,
    }

    componentWillReceiveProps(nextProps){
        if(this.props.visible != nextProps.visible){
            this.setState({visible:nextProps.visible});
        }
    }

    render(){
        const {
            type,
            visible,
            title,
            content,
            buttons,
            onRequestClose,
            onShow,
        } = this.props;

        let view = null;
        switch (type) {
            case 'alert':
                view = (
                    <View style={styles.modal}>
                        <Text style={{color:'#333',fontSize:15,marginVertical:15}}>
                            {title?title:''}
                        </Text>
                        <View style={{marginHorizontal: 5}}>
                            <Text style={{color:'#666',fontSize:15,marginBottom: 15}}>
                                {content?content:''}
                            </Text>
                        </View>
                        <View style={[styles.btnView,{flexDirection:buttons.length>3?'column':'row'}]}>
                            {
                                buttons.length >0?(
                                    buttons.map((item,i)=>{
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                style={[styles.btn,{borderRightWidth:i===buttons.length-1?0:1}]}
                                                onPress={item.onPress}>
                                                <Text style={{fontSize:15,color:'#666666'}}>
                                                    {item.text}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                ):(
                                    <TouchableOpacity style={[styles.btn]} onPress={()=>{
                                        this.setState({visible:false});
                                    }}>
                                        <Text style={{fontSize:15,color:'#666666'}}>
                                            确定
                                        </Text>
                                    </TouchableOpacity>
                                )

                            }
                        </View>

                    </View>
                );
                break;

            case 'others':
                view = content;
                break;

            default:
                view = (
                    <View style={{alignItems:'center'}}>
                        <ActivityIndicator size={'large'} color={'#fff'}/>
                        <Text style={{color:'#333',fontSize:15}}>
                            {title}
                        </Text>
                    </View>
                );
                break;
        }

        return(
            <Modal
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                animationType={'none'}
                transparent={true}
                visible={this.state.visible}
                onRequestClose={onRequestClose?onRequestClose:()=>{}}
                onShow={onShow?onShow:()=>{}}
            >
                <View style={styles.contain}>
                    {view}
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    contain:{
        flex:1,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0, 0, 0, 0.3)'
    },
    modal:{
        width:250,
        backgroundColor:'#ffffff',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    divider:{
        width:250,
        height:1,
        backgroundColor:'#dcdcdc'
    },
    btnView:{
        width:'100%',
        height:45,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderTopColor:'#dcdcdc',
        borderTopWidth:1
    },
    btn:{
        flex:1,
        height:'100%',
        justifyContent:'center',
        borderColor:'#dcdcdc',
        alignItems:'center',
    }
})


export default MyDialog;