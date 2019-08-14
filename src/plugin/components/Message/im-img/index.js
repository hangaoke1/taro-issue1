/**
 * 图片消息
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.less';

const MAX_SIZE = 120;
const MIN_SIZE = 20;

export default function ImgView(props) {
  const item = props.item;
  const imgInfo = item ? JSON.parse(item.content) : {};
  const { w = MIN_SIZE, h = MIN_SIZE } = imgInfo;
  const ratio = w / h
  let nWidth;
  let nHeight;
  if (ratio > 1) {
    nWidth = w > MAX_SIZE ? MAX_SIZE : w;
    nHeight = nWidth / ratio;
  } else {
    nHeight = h > MAX_SIZE ? MAX_SIZE : h;
    nWidth = nHeight * ratio;
  }
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
        <Image className='u-img' mode='scaleToFill' style={`width: ${nWidth}px;height: ${nHeight}px`} src={imgInfo.url + extendQuery} lazy-load onClick={handleClick} />
      </View>
    </View>
  ) : null;
}
