import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes, { func } from 'prop-types';
import _get from 'lodash/get';

import Avatar from '../u-avatar';
import TplBubbleList from './TplBubbleList';
import TplItem from './TplItem';

import './index.less';

// function RenderContent(props) {
//   const { item, tpl } = props;
//   if (tpl.id === 'bubble_list') {
//     return <TplBubbleList item={item}></TplBubbleList>;
//   } else if (tpl.id === 'qiyu_template_item') {
//     return <TplItem item={item}></TplItem>;
//   } else {
//     return <View>暂时不支持该bot消息{tpl.id}</View>;
//   }
// };

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

    return (
      <View
        className={item.fromUser ? 'm-bot m-bot-right' : 'm-bot m-bot-left'}
      >
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className="u-text-arrow" />
        <View className="u-text">
          {isShowLabel ? <View className="u-label">{tpl.label}</View> : null}
          {/* <RenderContent tpl={tpl} item={item}></RenderContent> */}
          {tpl.id === 'bubble_list' ? (
            <TplBubbleList item={item}></TplBubbleList>
          ) : null}
          {tpl.id === 'qiyu_template_item' ? (
            <TplItem item={item}></TplItem>
          ) : null}
        </View>
      </View>
    );
  }
}
