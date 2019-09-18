import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Button, Input, Textarea, Slider } from '@tarojs/components'

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
        <View className="u-btn-con">
          <Button onClick={this.handleOk}>OK</Button>
        </View>
      </View>
    )
  }
}
