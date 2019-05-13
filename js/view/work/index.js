import React, { Component } from 'react';
import {connect} from 'react-redux'
import WorkFlatList from "./WorkFlatList";
import contactPic from '../../img/work/contact.png';

const func = [
    {pic:contactPic,title:'帐单',navigate:'Bill'},
    {pic:contactPic,title:'联系人',navigate:'Contact'},
    {pic:contactPic,title:'宴席',navigate:'Contact'},
    {pic:contactPic,title:'族谱',navigate:'Contact'},
];

class Work extends Component {
    static navigationOptions = (navigation) =>({
        title:'工作',
    })

    _onItemClick = (item) => {
        this.props.navigation.navigate(item.navigate)
    }

    render(){
        return (
            <WorkFlatList data={func} onItemClick={this._onItemClick}/>
        );
    }
}

export default connect(null, null)(Work);