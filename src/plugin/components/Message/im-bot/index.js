import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import Avatar from '../u-avatar';

import './index.less'

export default class Bot extends Component {

  static propTypes = {
    item: PropTypes.object
  }

  static defaultProps = {
    item: {}
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
      <View className={item.fromUser ? 'm-bot m-bot-right' : 'm-bot m-bot-left'}>
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className='u-text-arrow' />
        <View className='u-text'>
          <View>请选择您想咨询的商品：</View>
          <View>请选择您想咨询的商品：</View>
          <View>请选择您想咨询的商品：</View>
          <View>请选择您想咨询的商品：</View>
        </View>
      </View>
    )
  }
}
