import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';
import { get } from '@/plugin/global_config';
import './index.less';

export default function Index(props) {
  const tpl = _get(props, 'tpl');
  const list = _get(tpl, 'list', []);

  function handleClick (item) {
    const { target, params, valid_operation } = item;
    if (item.type === 'url') {
      setClipboardData(target)
    } else {
      // 判断是否是机器人
      if (!get('isRobot')) {
        return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none'})
      }
      sendTemplateText({
        target,
        params,
        label: valid_operation
      })
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
