import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';

import MShop from '@/components/Bot/m-shop';
import './index.less';

export default function TplOrderList(props) {
  const { tpl, item } = props;
  const list = _get(tpl, 'list', []);

  function handleAction() {
    eventbus.trigger('bot_show_order_list', item);
  }

  return (
    <View className="m-order">
      <View className="u-label">{tpl.label}</View>
      {list.map(shop => {
        return (
          <MShop shop={shop} key={shop.s_status}></MShop>
        );
      })}
      <View className="u-action" onClick={handleAction}>
        查看更多
      </View>
    </View>
  );
}

TplOrderList.PropTypes = {
  item: PropTypes.object,
  tpl: PropTypes.object
};
