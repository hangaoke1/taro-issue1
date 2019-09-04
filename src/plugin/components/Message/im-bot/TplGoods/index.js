import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import MGood from '@/components/Bot/m-good';

import './index.less';

export default function Index(props) {
  const tpl = _get(props, 'tpl');
  return tpl ? (
    <View className="m-goods">
      <MGood item={tpl} disabled></MGood>
    </View>
  ) : null;
}

Index.PropTypes = {};
