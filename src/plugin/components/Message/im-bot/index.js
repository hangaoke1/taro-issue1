import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes, { func } from 'prop-types';
import _get from 'lodash/get';

import Avatar from '../u-avatar';
import TplBubbleList from './TplBubbleList';
import TplItem from './TplItem';
import TplErrorMsg from './TplErrorMsg';

import './index.less';

export default class Bot extends Component {
  static propTypes = {
    item: PropTypes.object
  };

  static defaultProps = {
    item: {}
  };

  config = {
    navigationBarTitleText: '首页'
  };

  componentWillMount() {}

  componentDidMount() {}

  render() {
    const { item } = this.props;
    const tpl = _get(item, 'content.template', {});
    const isShowLabel = ['bubble_list', 'drawer_list'].includes(tpl.id);
    const layout = null;
    switch (tpl.id) {
      case 'bubble_list': {
        layout = <TplBubbleList item={item} tpl={tpl}></TplBubbleList>;
        break;
      }
      case 'qiyu_template_item': {
        layout = <TplItem item={item} tpl={tpl}></TplItem>;
        break;
      }
      case 'error_msg': {
        layout = <TplErrorMsg item={item} tpl={tpl}></TplErrorMsg>
        break;
      }
      default: {
        layout = <View className="u-tip">暂不支持该bot类型{tpl.id}</View>;
      }
    }
    return (
      <View
        className={item.fromUser ? 'm-bot m-bot-right' : 'm-bot m-bot-left'}
      >
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className="u-text-arrow" />
        <View className="u-text">
          {isShowLabel ? <View className="u-label">{tpl.label}</View> : null}
          {layout}
        </View>
      </View>
    );
  }
}
