import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import './index.less';

export default function TplDrawerList(props) {
  const tpl = _get(props, 'tpl');
  return <View className="u-label">{tpl.label}</View>
}

TplDrawerList.PropTypes = {}
