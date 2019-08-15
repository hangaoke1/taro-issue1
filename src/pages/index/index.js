import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button } from '@tarojs/components'

import './index.less'

const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Index extends Component {

  config = {
    navigationBarTitleText: '网易七鱼Demo'
  }

  componentWillMount () {
    // myPluginInterface._$configAppKey('6dff3dbbe41efc598f74eac5d547355c');
    myPluginInterface._$configAppKey('f13509f5e8b8e1fbb388b3ddbee238c2');
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  handleClick = () => {
    Taro.scanCode().then(json => {
      let appkey = json.result.split('=')[2];
      console.log(json.result);
      if(appkey){
        myPluginInterface._$configAppKey(appkey);
      }
    })
  }

  render () {
    return (
      <View className='index'>
          <Navigator url='plugin://myPlugin/chat'>
            <Button>咨询客服</Button>
          </Navigator>
          <View>
            <Button onClick={this.handleClick}>扫一扫</Button>
          </View>
      </View>
    )
  }
}
