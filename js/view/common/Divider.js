// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';

export type Props = {
    inset?: boolean,
    style?: any,
    absolute?: boolean,
};

const Divider = (props: Props) => {
    const style = [
        styles.divider,
        props.inset && styles.inset,
        props.absolute && styles.absolute,
        props.style,
    ];

    return (
        <View style={style} />
    );
};

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#dcdcdc',
    },
    inset: {
        marginLeft: 15,
    },
    absolute: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});


export default Divider;
