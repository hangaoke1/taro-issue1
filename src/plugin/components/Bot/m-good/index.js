import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';

import { sendBotGood } from '@/actions/chat';
import './index.less';

export default function MGood(props) {
  const disabled = _get(props, 'disabled');
  const item = _get(props, 'item');
  const url = _get(item, 'p_url');

  function handleClick() {
    if (disabled) {
      return;
    }

    if (url) {
      Taro.setClipboardData({ data: url });
    } else {
      sendBotGood(item);
    }
    eventbus.trigger('bot_close_order_list');
  }

  return item ? (
    <View className={`m-good ${url ? 'u-url' : ''}`} onClick={handleClick}>
      <View className="u-good-left">
        <Image className="u-good-img" src={item.p_img}></Image>
      </View>
      <View className="u-good-mid">
        <View className="u-good-name">{item.p_name}</View>
        <View className="u-good-stock">{item.p_stock}</View>
      </View>
      <View className="u-good-right">
        <View className="u-good-price">{item.p_price}</View>
        <View className="u-good-count">{item.p_count}</View>
        <View className="u-good-status">{item.p_status}</View>
      </View>
    </View>
  ) : null;
}
