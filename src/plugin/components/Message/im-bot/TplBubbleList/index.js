import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import { setClipboardData } from '@/utils/extendTaro';
import MCard from '@/components/Bot/m-card';
import MGroup from '@/components/Bot/m-group';

import './index.less';

export default function TplBubbleList(props) {

  const item = _get(props, 'item');
  const tpl = _get(props, 'tpl');
  const type = _get(props, 'tpl.action.type');
  const target = _get(props, 'tpl.action.target');
  const list = _get(tpl, 'list', []);

  function handleSearchMore() {
    if (type === 'display') {
      return;
    }
    if (type === 'url') {
      setClipboardData(target)
    }
    if (type === 'block') {
      eventbus.trigger('bot_show_bubble_list', props.item.uuid);
    }
  }

  return item ? (
    <View>
      <View className="u-label">{tpl.label}</View>
      <View className="u-title">{_get(tpl, 'title.label')}</View>
      {list.length ? <View className="u-bubble-list">
        {list.slice(0, 4).map(p => {
          return String(p.p_item_type) === '0' ? (
            <MCard key={p.params} item={p} message={item}></MCard>
          ) : (
            <MGroup key={p.params} item={p}></MGroup>
          );
        })}
        {list.length > 4 ? (
          <View className="u-bubble-more" onClick={handleSearchMore}>
            查看更多
          </View>
        ) : null}
      </View> : <View className="u-empty">{tpl.empty_list_hint}</View>}
    </View>
  ) : null;
}
