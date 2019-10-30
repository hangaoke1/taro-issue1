import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button, Input } from '@tarojs/components'

import './index.less'

const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Index extends Component {

  config = {
    navigationBarTitleText: '网易七鱼Demo'
  }

  state = {
    unReadCount: 0,
    appId: null
  }

  componentWillMount () {
    // myPluginInterface._$configAppKey('6dff3dbbe41efc598f74eac5d547355c');
    myPluginInterface._$configAppKey('f13509f5e8b8e1fbb388b3ddbee238c2');
  }

  componentDidMount () {
    myPluginInterface._$onunread((obj) => {
      const { total, msg } = obj;
      console.log('监听到未读消息: ', total, msg)
      this.setState({
        unReadCount: total
      })
    })

    myPluginInterface._$onFileOpenAction((fileObj) => {
      const name = fileObj.name || '';
      const nameArr = name.split('.');
      const ext = (nameArr[nameArr.length - 1] || '').toLocaleLowerCase();
      if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(ext)) {
        Taro.openDocument({
          filePath: fileObj.tempFilePath,
          success: function (res) {}
        })
      } else {
        Taro.showToast({
          title: '暂不支持该文件类型预览'
        })
      }
    })

    if(Taro.getStorageSync('YSF-APPKEY') && Taro.getStorageSync('YSF-DOMAIN')){
      myPluginInterface._$configAppKey(Taro.getStorageSync('YSF-APPKEY'));
      myPluginInterface.__configDomain( Taro.getStorageSync('YSF-DOMAIN'));
    }

    if(Taro.getStorageSync('YSF-APPID')){
      this.setState({
        appId: Taro.getStorageSync('YSF-APPID')
      })
      myPluginInterface.__configAppId(Taro.getStorageSync('YSF-APPID'));
    }
  }

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
      if(queryParam.testing == 1){
        domain = 'https://qytest.netease.com'
      // 预发
      }else if(queryParam.testing == 2){
        domain = 'https://qiyukf.netease.com'
      }else{
        domain = 'https://qiyukf.com'
      }

      if(queryParam.key){
        myPluginInterface._$configAppKey(queryParam.key);
        myPluginInterface.__configDomain(domain);

        Taro.setStorageSync(
          'YSF-APPKEY', queryParam.key
        )

        Taro.setStorageSync(
          'YSF-DOMAIN', domain
        )

      }

      Taro.showToast({
        title: 'appKey绑定成功',
        icon: 'none',
        duration: 1000
      })
    })
  }

  handleChange = (event) => {
    myPluginInterface._$setUserInfo({
      userId: event.target.value
    });
    Taro.showToast({
      title: '用户id更新成功'
    })
  }

  handleAppId = () => {
    Taro.setClipboardData(
      {
        data: Taro.getAccountInfoSync().miniProgram.appId
      }
    ).then(json => {
      Taro.showToast({
        title: 'appId已复制',
        icon: 'none',
        duration: 1000
      })
    })
  }

  handleBlur = (event) => {
    let {value} = event.detail;
    myPluginInterface.__configAppId(value);
    Taro.setStorageSync(
      'YSF-APPID', value
    )

    Taro.showToast({
      title: 'appId填写成功',
      icon: 'none',
      duration: 1000
    })
  }

  emptyUnread = () => {
    myPluginInterface._$clearUnreadCount();
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
          <View>
            <Navigator url='/pages/info/index'>
              <Button>用户信息</Button>
            </Navigator>
          </View>
          <View>
            <Navigator url='/pages/product/index'>
              <Button>商品卡片</Button>
            </Navigator>
          </View>
          <View>
            <Button onClick={this.handleAppId}>{Taro.getAccountInfoSync().miniProgram.appId}</Button>
          </View>
          <View>
            <Navigator url='/pages/test/index'>
              <Button>测试页面</Button>
            </Navigator>
          </View>
          <View style='text-align: center;margin: 10px 0;'>消息未读数: {unReadCount}</View>
          <View><Button type="warn" onClick={this.emptyUnread}>清空消息未读数</Button></View>
          <View>
            自定义appId:
            <Input placeholder="null" value={this.state.appId} onBlur={this.handleBlur}></Input>
          </View>
      </View>
    )
  }
}
