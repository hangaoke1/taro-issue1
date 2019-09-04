import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';

import './index.less';

export default function Index(props) {
  const tpl = _get(props, 'tpl');
  const list = _get(tpl, 'list', []);

  function handleClick (item) {
    if (item.type === 'url') {
      setClipboardData(item.target)
    } else {
      sendTemplateText(item)
    }
  }

  return tpl ? (
    <View className="m-order-status">
      <View className="u-label">{tpl.label}</View>
      <View className="u-title">{tpl.title}</View>
      <View className="u-list">
        { list.map(item => <View className="u-list-item" onClick={handleClick.bind(null, item)} key={item.valid_operation}>{item.valid_operation}</View>) }
      </View>
    </View>
  ) : null;
}

Index.PropTypes = {
  tpl: PropTypes.object
};
