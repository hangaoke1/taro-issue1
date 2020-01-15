import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import classNames from 'classnames';
import { get } from '@/plugin/global_config';

import './index.less'

// 工单提交
@connect(
  ({ Setting, Session }) => ({
    Setting,
    Session
  }),
  dispatch => ({})
)
class AutoWorkSheet extends Component {

  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  }

  state = {}

  componentWillMount () { }

  componentDidMount () { }

  handleActionClick = () => {
    const isSameSession = this.props.item.sessionid === this.props.Session.sessionid
    if (!get('isRobot') || !isSameSession) {
      return Taro.showToast({
        title: '信息表单已过期',
        icon: 'none'
      })
    }
    const uuid = _get(this.props.item, 'uuid');
    eventbus.trigger('bot_show_auto_worksheet', uuid);
  }

  render () {
    const { item, tpl, Setting } = this.props;
    return item ? (
      <View className='m-action-list'>
        <View className="u-label">{tpl.label}</View>
        <View className="u-list">
            <View 
              className={
                classNames({
                 'u-list-item': true,
                 'u-disabled': tpl.submitted == 1
                })
              }
              style={
                {
                  background: tpl.submitted != 1 ? Setting.themeColor : ''
                }
              }
              onClick={this.handleActionClick}>填写信息</View>
        </View>
      </View>
    ): null
  }
}

export default AutoWorkSheet
