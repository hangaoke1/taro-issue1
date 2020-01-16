import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';
import { get } from '@/plugin/global_config';

import './index.less'
@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
class ActionList extends Component {

  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  }

  state = {
    disableList: []
  }

  componentWillMount () { }

  componentDidMount () { }

  handleActionClick = (action) => {
    const { target, params, p_name } = action
    if (action.type === 'url') {
      setClipboardData(action.target)
    } else {
      if (this.state.disableList.includes(p_name)) { return }
      // 判断是否是机器人
      if (!get('isRobot')) {
        this.setState((state) => ({
          disableList: [...state.disableList, p_name]
        }))
        return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none'})
      }

      sendTemplateText({
        target,
        params,
        label: p_name
      })
    }
  }

  render () {
    const { item, tpl, Setting } = this.props;
    const { disableList } = this.state;
    const list = _get(tpl, 'list', []);
    return item ? (
      <View className='m-action-list'>
        <View className="u-label">{tpl.label}</View>
        <View className="u-list">
          {list.map(action => {
            return <View 
              className={`u-list-item ${disableList.includes(action.p_name) ? 'z-disabled' : ''}`}
              style={`${disableList.includes(action.p_name) ? '' : Setting.themeTextButton}`}
              onClick={this.handleActionClick.bind(this, action)}>{action.p_name}</View>
          })}
        </View>
      </View>
    ): null
  }
}

export default ActionList