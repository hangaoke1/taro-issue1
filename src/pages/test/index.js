import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import GAudio from './GAudio'

import './index.less'

class index extends Component {

  config = {
    navigationBarTitleText: '测试'
  }

  state = {
    focus: false
  }

  componentWillMount () { }

  componentDidMount () { }


  render () {
    const prefixCls = 'ehome-index'
    return (
      <View className={prefixCls}>
        <GAudio src="https://nim.nosdn.127.net/MjQwNDgxMDQ=/bmltYV8yNDI3NTUxMF8xNTcyNDE5MDI4NTU1XzFhNzRhNDA5LTRmMTItNDFjZC1iM2IyLWJjYzAxZGFmNDMwNg=="></GAudio>
      </View>
    )
  }
}

export default index