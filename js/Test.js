import React,{Component} from 'react';
import {View,Text} from 'react-native';
import {connect} from 'react-redux';
import Button from "./view/common/Button";
import * as action from './actions'


class Test extends Component{
    componentDidMount() {
        console.log(this.props)
    }

    go = async () => {
        const data = await this.props.getAges(3);
        console.log(JSON.stringify(data));
    }

    render(){
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                <Text>
                    {
                        this.props.username
                    }
                </Text>

                <Button onPress={this.go}>
                    <Text>button</Text>
                </Button>
            </View>
        );
    }
}

export default connect(null,action)(Test)