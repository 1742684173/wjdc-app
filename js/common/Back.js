import React,{Component} from 'react';
import {TouchableOpacity,Image} from 'react-native';
import {pxTodpWidth} from "./ScreenUtil";
import backImg from '../img/common/back-icon.png';

export default class Back extends Component{

    _goBack = () => {
        this.props.navigation.state?(this.props.navigation.state.params?(
            this.props.navigation.state.params.callback?
                this.props.navigation.state.params.callback({}):null
        ):null):null;
        this.props.navigation.goBack();
    }

    render(){
        return(
            <TouchableOpacity onPress={this._goBack} style={{width:pxTodpWidth(100),paddingLeft:pxTodpWidth(30)}}>
                <Image source={backImg}/>
            </TouchableOpacity>
        )
    }
}