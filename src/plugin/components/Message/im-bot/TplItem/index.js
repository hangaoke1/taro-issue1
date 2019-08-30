import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';

import MCard from '@/components/Bot/m-card';

import './index.less';

export default function TplItem(props) {
  const item = _get(props, 'item');
  const tpl = _get(props, 'tpl');

  // 重新选择
  function handleReselect () {
    eventbus.trigger(`bot_show_${ _get(props, 'item.content.relatedTplId')}`, _get(props, 'item.content.relatedUUID'))
  }

  return (
    <View className="m-item">
      <MCard item={tpl} message={item} disabled></MCard>
      <View className="u-reselect" onClick={handleReselect}>重新选择</View>
    </View>
  );
}

TplItem.PropTypes = {};
