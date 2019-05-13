// @flow
import React, { Component } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import Button from '../common/Button';
import menuIcon from '../img/nav/nav_menu.png';

class DrawerButton extends Component {
    shouldComponentUpdate = () => false;

    openDrawer = () => this.props.navigation.navigate('DrawerOpen');

    render() {
        return (
            <Button style={[styles.button,Platform.OS==='android'? {paddingTop:0}: ""]} onPress={this.openDrawer}>
                <Image style={styles.icon} source={menuIcon} />
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 15,
        backgroundColor: 'transparent',
        marginTop:10
    },
    icon: {
        width: 30,
        height: 28,
    },
});

export default withNavigation(DrawerButton);
