import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button } from '@tarojs/components'

import './index.less'

const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {
    myPluginInterface._$configAppKey('7540b40c6afa96fc975ce040733ae7f6');
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Navigator url='plugin://myPlugin/chat'>
          <Button>咨询客服</Button>
      </Navigator>
      </View>
    )
  }
}
