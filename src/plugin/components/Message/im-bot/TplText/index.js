import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import './index.less';

export default function TplItem(props) {
  const item = _get(props, 'item');
  const tpl = _get(props, 'tpl');

  return (
    <View className="m-text">
      {tpl.label}
    </View>
  );
}

TplItem.PropTypes = {};
