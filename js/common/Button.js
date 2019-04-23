// @flow
import React from 'react';
import type { Element } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import Theme from './Theme';

const Touchable = Platform.OS === 'android' ?
  TouchableNativeFeedback : TouchableOpacity;

export type Props = {
  color?: string,
  style?: any,
  children?: Element<any>,
  onPress?: Function,
  disabled?: boolean,
};

const Button = (props: Props) => {
  const {
    color,
    style,
    children,
    onPress,
    disabled,
  } = props;

  const buttonStyle = [
    styles.button,
    color && { backgroundColor: color },
    style,
  ];

  const content = Platform.OS === 'android' ? (
    <View style={buttonStyle}>{children}</View>
  ) : (
    children
  );

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      style={buttonStyle}
    >
      {content}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 22,
    padding: Theme.spacingSM,
    backgroundColor: Theme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Button;
