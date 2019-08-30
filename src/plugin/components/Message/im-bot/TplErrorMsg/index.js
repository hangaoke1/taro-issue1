import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import './index.less';

export default function TplErrorMsg(props) {
  const tpl = _get(props, 'tpl');

  return <View className="m-error-msg">{tpl.label}</View>
}

TplErrorMsg.PropTypes = {}
