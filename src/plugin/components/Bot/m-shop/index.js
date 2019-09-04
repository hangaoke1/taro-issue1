import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import Iconfont from '@/components/Iconfont';
import MGood from '@/components/Bot/m-good';

import './index.less';

export default function MShop(props) {
  const shop = _get(props, 'shop');

  return shop ? (
    <View className="u-tab">
      <View className="u-shop">
        <View className="u-shop-icon">
          <Iconfont type="icon-shopx" color="#666" size="16"></Iconfont>
        </View>
        <View className="u-shop-name">{shop.s_name}</View>
        <View className="u-shop-status">{shop.s_status}</View>
      </View>
      <View className="u-good-list">
        <View className="u-good-wrap">
          {shop.goods.map(good => {
            return (
              <View className="u-good-inner">
                <MGood item={good} key={good.params}></MGood>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  ) : null;
}
