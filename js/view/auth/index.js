// @flow
import { Component } from 'react';
import { connect } from 'react-redux';
import type { NavigationScreenProp } from 'react-navigation';

class Index extends Component<Props> {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = () => {
        const { token, lockPassword,navigation } = this.props;
        if(token){
            if(lockPassword){
                navigation.navigate('CheckLock');
            }else{
                navigation.navigate('App');
            }
        }else{
            navigation.navigate('Auth');
        }
    };

    render() {
        return null;
    }
}

const select = ({ user: {token,lockPassword} = {} }) => ({
    token,lockPassword
});

export default connect(select)(Index);
