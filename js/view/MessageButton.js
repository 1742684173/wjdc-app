// @flow
import React, { Component } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import Button from './common/Button';
import menuIcon from '../img/nav/nav_message.png';

class MessageButton extends Component {
    shouldComponentUpdate = () => false;

    _openDrawer = () => {

    }

    render() {
        return (
            <Button style={[styles.button, Platform.OS==='android'? {paddingTop:0}: ""]} onPress={this._openDrawer}>
                <Image style={styles.icon} source={menuIcon}/>
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'transparent',
    },
    icon: {
        marginTop:10,
        width: 35,
        height: 28,
        resizeMode:'contain',

    },
});

export default withNavigation(MessageButton);
