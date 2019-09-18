import Taro, { Component } from '@tarojs/taro'
import {
  View, Text, Navigator, Button, Input,
  Textarea, Slider, Form, Switch
} from '@tarojs/components'

import './index.less'

const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Info extends Component {

  config = {
    navigationBarTitleText: '商品卡片',
    usingComponents: {
      'icon-font': 'plugin://myPlugin/Iconfont'
    }
  }

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleOk = () => {
    let product = {
      title: '任天堂（Nintendo）Switch游戏机',
      desc: '任天堂（Nintendo） Switch NS NX掌上游戏机便携 塞尔达马里奥新款游戏机 主机不锁 日版黑机彩色手柄+中文赛/塞尔达传说(指南+地图)',
      note: '$2330',
      picture: 'https://img10.360buyimg.com/n5/s75x75_jfs/t4030/290/29851193/293745/d5e2b731/58ac3506Nbb57b5f6.jpg',
      url: 'https://www.taobao.com/',
      show: 1,
      sendByUser: 1
    };

    myPluginInterface._$configProduct(product);
    Taro.showToast({
      title: `已保存商品信息，重新申请会话生效`,
      icon: 'none',
      duration: 1000
    })
  }

  handleSubmit = (event) => {
    // event.detail
    let product = event.detail.value;
    myPluginInterface._$configProduct(product);
    Taro.showToast({
      title: `已保存商品信息，重新申请会话生效`,
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
            <View className="Info_item_title_text">商品卡片</View>
          </View>
        </View>
        <Form onSubmit={this.handleSubmit}>
          <View className="m-Info_item_form_con">
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                标题（title）
            </View>
              <View className="m-Info_item_form_id_value">
                <Input placeholder="标题（title）" className="u-ipt"
                  value="任天堂（Nintendo）Switch游戏机" name="title"></Input>
              </View>
            </View>
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                商品描述（desc）
            </View>
              <View className="m-Info_item_form_id_value">
                <Input placeholder="商品描述（desc）" className="u-ipt"
                  name="desc"
                  value="任天堂（Nintendo） Switch NS NX掌上游戏机便携 塞尔达马里奥新款游戏机 主机不锁 日版黑机彩色手柄+中文赛/塞尔达传说(指南+地图)"></Input>
              </View>
            </View>
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                商品备注（note）
            </View>
              <View className="m-Info_item_form_id_value">
                <Input placeholder="商品备注（note）" className="u-ipt"
                  value="$2330" name="note"></Input>
              </View>
            </View>
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                配图地址（picture）
            </View>
              <View className="m-Info_item_form_id_value">
                <Input placeholder="配图地址（picture）" className="u-ipt"
                  name="picture"
                  value="https://img10.360buyimg.com/n5/s75x75_jfs/t4030/290/29851193/293745/d5e2b731/58ac3506Nbb57b5f6.jpg"></Input>
              </View>
            </View>
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                跳转地址（url）
            </View>
              <View className="m-Info_item_form_id_value">
                <Input placeholder="跳转地址（url）" className="u-ipt"
                  name="url"
                  value="https://www.taobao.com/"></Input>
              </View>
            </View>
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                发送按钮文案（actionText）
            </View>
              <View className="m-Info_item_form_id_value">
                <Input placeholder="发送按钮文案（actionText）" className="u-ipt"
                  name="actionText"
                  value="发送"></Input>
              </View>
            </View>
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                是否在访客端展示（isShow）
            </View>
              <View className="m-Info_item_form_id_value">
                <Switch checked={true} name="isShow"></Switch>
              </View>
            </View>
            <View className="m-Info_item_form">
              <View className="m-Info_item_form_id_label">
                访客手动发送（sendByUser）
            </View>
              <View className="m-Info_item_form_id_value">
                <Switch checked={false} name="sendByUser"></Switch>
              </View>
            </View>
          </View>
          <View className="u-btn-con">
            <Button form-type="submit">OK</Button>
          </View>
        </Form>
      </View>
    )
  }
}
