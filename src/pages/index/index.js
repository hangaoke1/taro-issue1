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

    const sring2object = (_string = "", _split) => {
      let _obj = {};
  
      _string.split(_split).forEach(item => {
          let _brr = item.split('=');
          if (!_brr || !_brr.length) return;
          let _key = _brr.shift();
          if (!_key) return;
          _obj[decodeURIComponent(_key)] =
              decodeURIComponent(_brr.join('='));
      })
  
        return _obj;
    };
  
  
    const query2object = (query) => {
        return sring2object(query, '&')
    }

    Taro.scanCode().then(json => {
      let queryParam = query2object(json.result.substr(json.result.indexOf('?') + 1));

      let domain = 'https://qytest.netease.com'

      // 测试环境
      if(queryParam.testing === 1){
        domain = 'https://qytest.netease.com'
      // 预发
      }else if(queryParam.testing == 2){
        domain = 'https://qiyukf.netease.com'
      }else{
        domain = 'https://qiyukf.com'
      }

      console.log(queryParam);
      if(queryParam.key){
        myPluginInterface._$configAppKey(queryParam.key);
        myPluginInterface.__configDomain(domain);
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
