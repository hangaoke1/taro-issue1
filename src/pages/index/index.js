import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {}

  componentDidMount () {}

  render () {
    const prefixCls = 'ehome-index'

    return (
      <View className={prefixCls}>
        <Navigator url='plugin://myPlugin/chat'>
          <Button>咨询客服</Button>
        </Navigator>
      </View>
    )
  }
}

export default index
