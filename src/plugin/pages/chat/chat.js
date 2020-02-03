import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { connect } from '@tarojs/redux'

@connect(
  ({ Setting }) => ({
    Setting
  }),
  (dispatch) => ({})
)
class chat extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    const prefixCls = 'ehome-index'

    return (
      <View className={prefixCls}>
        测试
      </View>
    )
  }
}

export default chat