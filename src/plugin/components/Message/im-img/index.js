/**
 * 图片消息
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { calcMsg } from '../../../utils/index'

import './index.less';

const MIN_SIZE = 20;

export default function ImgView(props) {
  const item = props.item;
  const imgInfo = item ? JSON.parse(item.content) : {};
  const { w = MIN_SIZE, h = MIN_SIZE } = imgInfo;
  const { width, height }  = calcMsg(w, h);
  let extendQuery = (imgInfo.url || '').indexOf('?') === -1 ? '?' : '&';
  extendQuery += 'imageView&thumbnail=1500x15000';

  function handleClick () {
    this.props.onClick(props.item);
  };

  return item ? (
    <View className={item.fromUser ? 'm-img m-img-right' : 'm-img m-img-left'}>
      <View>
        <Image
          className='u-avatar'
          src='http://qytest.netease.com/sdk/res/default/robot_portrait.png'
        />
      </View>
      <View className='u-space' />
      <View className='u-content'>
        <Image className='u-img' mode='scaleToFill' style={`width: ${width}px;height: ${height}px`} src={imgInfo.url + extendQuery} lazy-load onClick={handleClick} />
      </View>
    </View>
  ) : null;
}
