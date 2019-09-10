import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button, Input } from '@tarojs/components'

import './index.less'

const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Info extends Component {

  config = {
    navigationBarTitleText: '网易七鱼Demo'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='m-Info'>
        1111
      </View>
    )
  }
}
