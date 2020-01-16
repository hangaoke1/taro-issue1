import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import { setClipboardData } from '@/utils/extendTaro';
import { get } from '@/plugin/global_config';
import MShop from '@/components/Bot/m-shop';
import './index.less';

export default function TplOrderList(props) {
  const { tpl, item } = props;
  const list = _get(tpl, 'list', []);

  function handleAction() {
    const action = tpl.action;
    if (action.type === 'url') {
      setClipboardData(action.target);
    } else {
      // 判断是否是机器人
      if (!get('isRobot')) {
        return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none'})
      }
      eventbus.trigger('bot_show_order_list', item);
    }
  }

  return (
    <View className="m-order">
      <View className="u-label">{tpl.label}</View>
      {list.map(shop => {
        return <MShop shop={shop} key={shop.s_status}></MShop>;
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
