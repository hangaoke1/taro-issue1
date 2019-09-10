import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';

import './index.less'

class ActionList extends Component {

  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  }

  componentWillMount () { }

  componentDidMount () { }

  handleActionClick = (action) => {
    const { target, params, p_name } = action
    if (action.type === 'url') {
      setClipboardData(action.target)
    } else {
      sendTemplateText({
        target,
        params,
        label: p_name
      })
    }
  }

  render () {
    const { item, tpl } = this.props;
    const list = _get(tpl, 'list', []);
    return item ? (
      <View className='m-action-list'>
        <View className="u-label">{tpl.label}</View>
        <View className="u-list">
          {list.map(action => {
            return <View className="u-list-item" onClick={this.handleActionClick.bind(this, action)}>{action.p_name}</View>
          })}
        </View>
      </View>
    ): null
  }
}

export default ActionList