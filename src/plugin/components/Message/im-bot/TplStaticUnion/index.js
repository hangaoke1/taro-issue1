import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class StaticUnion extends Component {

  componentWillMount () { }

  componentDidMount () { }

  render () {

    return (
      <View className="m-static-union">
        static-union消息
      </View>
    )
  }
}

export default StaticUnion