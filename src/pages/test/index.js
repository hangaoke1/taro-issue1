import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

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

  handleKeyboardheightchange = (event) => {
    Taro.showToast({
      title: 'haha' + event.detail.height
    })
    setTimeout(() => {
      Taro.showToast({
        title: '收起键盘'
      })
      Taro.hideKeyboard()
    }, 3000)
  }

  render () {
    const prefixCls = 'ehome-index'

    const {focus} = this.state;
    return (
      <View className={prefixCls}>
        <View style={`position: fixed;left:0; top:100px;width:375px;border: 1px solid red;z-index: 100;`}>
          <Input
          type='text'
          focus={focus}
          onKeyboardheightchange={this.handleKeyboardheightchange}
          className='u-edtior'
          confirmType='send'
          confirmHold
          adjustPosition={false}
        />
        </View>
        <ScrollView scrollY className="u-scroll">
          {Object.keys([...new Array(100)]).map((item) => <View key={item}>测试{item}</View>)}
        </ScrollView>
      </View>
    )
  }
}

export default index