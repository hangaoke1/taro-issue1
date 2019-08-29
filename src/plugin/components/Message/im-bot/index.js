import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus'

import MCard from '@/components/Bot/m-card';
import MGroup from '@/components/Bot/m-group';
import Avatar from '../u-avatar';

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

  // 查看更多
  handleSearchMore = () => {
    eventbus.trigger('bot_show_bubble_list', this.props.item.uuid)
  }

  render() {
    const { item } = this.props;
    const tpl = _get(item, 'content.template', {});

    return (
      <View
        className={item.fromUser ? 'm-bot m-bot-right' : 'm-bot m-bot-left'}
      >
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className="u-text-arrow" />
        <View className="u-text">
          <View className="u-label">{tpl.label}</View>
          {tpl.id === 'bubble_list'
            ? <View className="u-bubble-list">
              {tpl.list.slice(0, 4).map(p => {
              return String(p.p_item_type) === '0' ? (
                <MCard
                  key={p.params}
                  item={p}
                ></MCard>
              ) : (
                <MGroup key={p.params} item={p}></MGroup>
              );
            })}
            { tpl.list.length > 4 ? <View className="u-bubble-more" onClick={this.handleSearchMore}>查看更多</View> : null }
            </View>
            : null}
        </View>
      </View>
    );
  }
}
