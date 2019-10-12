import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { setClipboardData } from '@/utils/extendTaro';

import Iconfont from '@/components/Iconfont';

import './index.less';

export default function Index(props) {
  const tpl = _get(props, 'tpl');

  function handleClick() {
    if (tpl.url) {
      setClipboardData(tpl.url);
    }
  }

  return tpl ? (
    <View className="m-order-detail" onClick={handleClick}>
      <View className="u-label">{tpl.label}</View>
      <View className="u-list">
        <View className="u-item">
          <View className="u-icon">
            <Iconfont type="icon-express" size="16" color="#333"></Iconfont>
          </View>
          <View className="u-content" style="color: #333;">{tpl.status}</View>
        </View>
        <View className="u-item">
          <View className="u-icon">
            <Iconfont type="icon-gps" size="16" color="#333"></Iconfont>
          </View>
          <View className="u-content u-address">
            <View style="color: #333;">{tpl.user_name}</View>
            <View>{tpl.address}</View>
          </View>
        </View>
        <View className="u-item">
          <View className="u-icon">
            <Iconfont type="icon-order" size="16" color="#333"></Iconfont>
          </View>
          <View className="u-content u-date">
            <View style="color: #333;">{tpl.orderNo}</View>
            {tpl.date.map(date => (
              <View>{date}</View>
            ))}
          </View>
        </View>
      </View>
    </View>
  ) : null;
}

Index.PropTypes = {
  tpl: PropTypes.object
};
