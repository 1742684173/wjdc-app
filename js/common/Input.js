// @flow
import React,{Component} from 'react';
import type { Node } from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, Platform, Image} from 'react-native';
import Divider from './Divider';
import Theme from './Theme';
export type Props = {
  value?: string,
  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
  placeholder?: string,
  disableUnderline?: boolean,
  style?: any,
  inputStyle?: any,
  prefix?: Node,
  postfix?: Node,
};

class Input extends Component<any> {
  constructor(props:Props) {
    super(props);
  }

  onPress = () => {
    this.props.onChange('');
    this.textInput.clear();
  }

  render(){
    const {
      style,
      inputStyle,
      disableUnderline,
      prefix,
      postfix,
      // onChange,
      //onFocus,
      value,
      ...other
    } = this.props;      //添加value值为了让...other不要默认取value空值

    return (

      <View style={[styles.container, style]}>
        {prefix}
        <TextInput
          ref={input => { this.textInput = input }}
          placeholderTextColor={'#dcdcdc'}
          style={[styles.input, inputStyle]}
          underlineColorAndroid={'transparent'}
          // onChangeText={(text)=>onChange(text)}
          defaultValue={value}
          {...other}
        />
        <TouchableOpacity onPress={this.onPress}>
          {postfix}
        </TouchableOpacity>
        {!disableUnderline && <Divider absolute />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    //paddingVertical: Theme.spacingXS,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});
export default Input;
