import Taro, { Component } from '@tarojs/taro';
import { useSelector } from '@tarojs/redux';
import { View } from '@tarojs/components';
import _get from 'lodash/get';
import { get } from '@/plugin/global_config';
import eventbus from '@/lib/eventbus';
import { setClipboardData, showActionTel, showWakeTel } from '@/utils/extendTaro';
import MCard from '@/components/Bot/m-card';
import MGroup from '@/components/Bot/m-group';
import './index.less';

export default function TplBubbleList(props) {
  const item = _get(props, 'item');
  const tpl = _get(props, 'tpl', {});
  const type = _get(props, 'tpl.action.type');
  const target = _get(props, 'tpl.action.target');
  const list = _get(tpl, 'list', []);
  const Setting = useSelector(state => state.Setting);

  function handleLinklongpress() {
    if (type === 'tel') {
      showActionTel(target);
    }
  }

  function handleSearchMore() {
    if (type === 'display') {
      return;
    }
    if (type === 'tel') {
      showWakeTel(target)
    }
    if (type === 'url') {
      setClipboardData(target);
    }
    if (type === 'block') {
      // 判断是否是机器人
      if (!get('isRobot')) {
        return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none' });
      }
      eventbus.trigger('bot_show_bubble_list', props.item.uuid);
    }
  }

  let layout = null;
  if (list.length) {
    layout = (
      <View className="u-bubble-list">
        {list.slice(0, 2).map(p => {
          return String(p.p_item_type) === '0' ? (
            <MCard key={p.params} item={p} message={item}></MCard>
          ) : (
            <MGroup key={p.params} item={p}></MGroup>
          );
        })}
        {list.length > 2 ? (
          <View
            className="u-bubble-more"
            style={Setting.themeText}
            onClick={handleSearchMore}
            onLongPress={handleLinklongpress}
          >
            查看更多
          </View>
        ) : null}
      </View>
    );
  } else {
    layout = <View className="u-empty">{tpl.empty_list_hint}</View>;
  }

  return item ? (
    <View>
      <View className="u-label">{tpl.label}</View>
      {tpl.choosed ? null : layout}
    </View>
  ) : null;
}
