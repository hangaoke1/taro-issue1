import Taro, { Component } from '@tarojs/taro';
import {View} from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

export default class Notify extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {message} = this.props;

    return (
      <View className="m-Notify">
        {message}
      </View>
    )
  }
}

Notify.defaultProps = {
  duration: 3000
}

Notify.propType = {
  message: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func
}
