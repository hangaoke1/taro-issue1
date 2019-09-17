import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button, Input, Textarea,Slider } from '@tarojs/components'

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
        userId: 'user111111111',
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
        userId: 'user222222222',
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
        userId: 'user3333333',
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
      selectedName: null,
      customId: null,
      customData: null,
      level: myPluginInterface._$getVipLevel()
    }
  }

  handleSelect = (selected, selectedName, userInfo) => {
    this.setState({
      selected,
      selectedName
    })

    Taro.setStorageSync('selected', selected);
    Taro.setStorageSync('selectedName', selectedName);

    myPluginInterface._$setUserInfo(userInfo);

    Taro.showToast({
      title: `已切换到${selectedName}`,
      icon: 'success',
      duration: 1000
    })
  }

  handleLogout = () => {
    myPluginInterface._$logout();
    this.setState({
      selected: null,
      selectedName: null
    })
    Taro.showToast({
      title: `用户已注销为匿名用户`,
      icon: 'success',
      duration: 1000
    })
  }

  handleCustom = () => {
    if(!this.state.customId){
      Taro.showToast({
        title: 'uid为必填值',
        icon: 'none'
      })
      return;
    }

    let userInfo = {};
    userInfo.userId = this.state.customId;
    userInfo.data = this.state.customData;

    myPluginInterface._$setUserInfo(userInfo);
    Taro.showToast({
      title: `已切换到自定义用户`,
      icon: 'success',
      duration: 1000
    })

  }

  handleDataConfirm = (event) => {
    // event.detail.value
    try{
      let customData = JSON.parse(event.detail.value);
      this.setState({
        customData
      })
    }catch(error){}
  }

  handleIdConfirm = (event) => {
    // event.detail.value
    let customId = event.detail.value;
    this.setState({
      customId
    })
  }

  handleVipChange = (event) => {
    // event.detail
    let level = event.detail.value;
    myPluginInterface._$setVipLevel(level);

    Taro.showToast({
      title: `已切换到VIP${level}，重新申请会话后生效`,
      icon: 'none',
      duration: 1000
    })
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { users, selected, level } = this.state;
    return (
      <View className='m-Info'>
        <View className="m-Info_item">
          <View className="m-Info_item_title">
            <View className="Info_item_title_text">VIP等级</View>
          </View>
        </View>
        <View className="m-Info_vip_con">
          <Slider step={1} value={level} showValue min={0}
            max={11} selectedColor='#5092e1' activeColor='#5092e1'
            onChange={this.handleVipChange}/>
        </View>
        <View className="m-Info_logout">
          <Button onClick={this.handleLogout}>注销用户</Button>
        </View>
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
                <View key={item.userId} className="m-Info_btn_item"
                  onClick={this.handleSelect.bind(this, item.userId, item.name, item)}>
                  <View className="m-Info_btn">
                    {item.name}
                  </View>
                  {
                    selected === item.userId ?
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
        <View className="m-Info_item_form_con">
          <View className="m-Info_item_form">
            <View className="m-Info_item_form_id_label">
              账号ID（必须）
            </View>
            <View className="m-Info_item_form_id_value">
              <Input placeholder="账号ID（必填）" className="u-ipt"
                onConfirm={this.handleIdConfirm}></Input>
            </View>
          </View>
          <View className="m-Info_item_form">
            <View className="m-Info_item_form_id_label">
              crm data
            </View>
            <View className="m-Info_item_form_id_value">
              <Textarea placeholder="crm data" className="u-textarea"
                maxlength="-1" cursorSpacing="140" onConfirm={this.handleDataConfirm}></Textarea>
            </View>
          </View>
          <View className="u-btn-con">
            <Button onClick={this.handleCustom}>切换</Button>
          </View>
        </View>
      </View>
    )
  }
}
