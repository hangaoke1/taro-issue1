import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button } from '@tarojs/components'
import './index.less'

const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {
    myPluginInterface.sayHello()
    const answer = myPluginInterface.answer
    console.log('answer: ', answer)
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
