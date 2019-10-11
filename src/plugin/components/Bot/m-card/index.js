import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import { setClipboardData } from '@/utils/extendTaro';

import './index.less';

export default function MCard(props) {

  const item = _get(props, 'item', {});

  function handleClick () {
    if (props.disabled) {
      return
    }
    if (item.type === 'display') {
      return;
    }
    if (item.type === 'url') {
      setClipboardData(item.target)
    }
    if (item.type === 'block') {
      eventbus.trigger('bot_card_show', item, props.message);
    }
  }

  return item ? (
    <View className="m-card" onClick={handleClick}>
      <View className="u-left">
        <Image
          className="u-img"
          src={item.p_img}
        ></Image>
      </View>
      <View className="u-right">
        <View className="u-right-top">
          <View className="u-title">{item.p_title}</View>
          <View className="u-info">
            <View className="u-attr1">{item.p_attr_1}</View>
            <View className="u-attr2">{item.p_attr_2}</View>
          </View>
        </View>
        <View className="u-right-bottom">
          <View className="u-subTitle">{item.p_sub_title}</View>
          <View className="u-attr3">{item.p_attr_3}</View>
        </View>
      </View>
    </View>
  ) : null;
}
