import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';

import './index.less'

export default class Bot extends Component {

  static propTypes = {
    item: PropTypes.object
  }

  static defaultProps = {
    item: null
  }

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    const { item } = this.props;
    const { content } = item || {};
    const { template } = content || {};

    return (
      <View className='m-bot'>
        bot消息列表{template.id}
      </View>
    )
  }
}
