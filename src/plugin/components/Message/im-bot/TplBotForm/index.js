import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'

import './index.less'

class TplBotForm extends Component {

  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    const { tpl } = this.props;
    return (
      <View className="m-form">
        <View className="u-label">{tpl.label}</View>
      </View>
    )
  }
}

export default TplBotForm