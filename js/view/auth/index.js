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
    const { token, navigation } = this.props;
    navigation.navigate(token ? 'App' : 'Auth');
  };

  render() {
    return null;
  }
}

const select = ({ user: {token} = {} }) => ({
  token,
});

export default connect(select)(Index);
