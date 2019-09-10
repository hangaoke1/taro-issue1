import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button, Input } from '@tarojs/components'

import './index.less'

const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Info extends Component {

  config = {
    navigationBarTitleText: '用户信息',
    usingComponents: {
      'icon-font': 'plugin://myPlugin/Iconfont'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      users: [{
        uid: 'user111111111',
        name: '用户A',
        data: [
          { "key": "real_name", "value": "用户A" },
          { "key": "mobile_phone", "value": 15669060662 },
          { "key": "email", "value": "13800000000@163.com" },
          { "index": 0, "key": "account", "label": "账号", "value": "zhangsan", "href": "http://example.domain/user/zhangsan" },
          { "index": 1, "key": "sex", "label": "性别", "value": "先生" },
          { "index": 2, "key": "reg_date", "label": "注册日期", "value": "2015-11-16" },
          { "index": 3, "key": "last_login", "label": "上次登录时间", "value": "2015-12-22 15:38:54" },
          { "index": 4, "key": "avatar", "label": "头像", "value": "https://xxxxx.jpg" }
        ]
      }, {
        uid: 'user222222222',
        name: '用户B',
        data: [
          { "key": "real_name", "value": "用户B" },
          { "key": "mobile_phone", "value": 15669060662 },
          { "key": "email", "value": "13800000000@163.com" },
          { "index": 0, "key": "account", "label": "账号", "value": "zhangsan", "href": "http://example.domain/user/zhangsan" },
          { "index": 1, "key": "sex", "label": "性别", "value": "先生" },
          { "index": 2, "key": "reg_date", "label": "注册日期", "value": "2015-11-16" },
          { "index": 3, "key": "last_login", "label": "上次登录时间", "value": "2015-12-22 15:38:54" },
          { "index": 4, "key": "avatar", "label": "头像", "value": "https://xxxxx.jpg" }
        ]
      }, {
        uid: 'user3333333',
        name: '用户C',
        data: [
          { "key": "real_name", "value": "用户C" },
          { "key": "mobile_phone", "value": 15669060662 },
          { "key": "email", "value": "13800000000@163.com" },
          { "index": 0, "key": "account", "label": "账号", "value": "zhangsan", "href": "http://example.domain/user/zhangsan" },
          { "index": 1, "key": "sex", "label": "性别", "value": "先生" },
          { "index": 2, "key": "reg_date", "label": "注册日期", "value": "2015-11-16" },
          { "index": 3, "key": "last_login", "label": "上次登录时间", "value": "2015-12-22 15:38:54" },
          { "index": 4, "key": "avatar", "label": "头像", "value": "https://xxxxx.jpg" }
        ]
      }],
      selected: null,
      selectedName: null
    }
  }

  handleSelect = (selected, selectedName) => {
    this.setState({
      selected,
      selectedName
    })

    Taro.showToast({
      title: `已切换到${selectedName}`,
      icon: 'success',
      duration: 1000
    })
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { users, selected } = this.state;
    return (
      <View className='m-Info'>
        <View className="m-Info_item">
          <View className="m-Info_item_title">
            <View className="Info_item_title_text">当前用户</View>
          </View>
          <View>{selectedName ? selectedName : '匿名用户'}</View>
        </View>
        <View className="m-Info_item">
          <View className="m-Info_item_title">
            <View className="Info_item_title_text">切换用户</View>
          </View>
        </View>
        <View className="m-Info_btn_con">
          {
            users.map(item => {
              return (
                <View key={item.uid} className="m-Info_btn_item"
                  onClick={this.handleSelect.bind(this, item.uid, item.name)}>
                  <View className="m-Info_btn">
                    {item.name}
                  </View>
                  {
                    selected === item.uid ?
                      <View className="z-sel" >
                        <icon-font extraProps={{
                          color: '#337EFF',
                          size: '12',
                          type: 'icon-correct'
                        }} />
                      </View> :
                      null
                  }
                </View>
              )
            })
          }
        </View>
        <View className="m-Info_item">
          <View className="m-Info_item_title">
            <View className="Info_item_title_text">自定义用户信息</View>
          </View>
        </View>
      </View>
    )
  }
}
