import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import MCard from '@/components/Bot/m-card';
import MGroup from '@/components/Bot/m-group';

import './index.less';

export default function TplBubbleList(props) {

  function handleSearchMore() {
    eventbus.trigger('bot_show_bubble_list', props.item.uuid)
  }

  const item = _get(props, 'item');
  const tpl = _get(item, 'content.template', {});

  return item ? (
    <View className="u-bubble-list">
      {tpl.list.slice(0, 4).map(p => {
        return String(p.p_item_type) === '0' ? (
          <MCard key={p.params} item={p} message={item}></MCard>
        ) : (
          <MGroup key={p.params} item={p}></MGroup>
        );
      })}
      {tpl.list.length > 4 ? (
        <View className="u-bubble-more" onClick={handleSearchMore}>
          查看更多
        </View>
      ) : null}
    </View>
  ) : null;
}
