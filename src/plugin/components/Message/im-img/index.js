/**
 * 图片消息
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { calcMsg } from '../../../utils/index'
import Avatar from '../u-avatar';

import './index.less';

const DEFAULT_SIZE = 140;

export default function ImgView(props) {
  const item = props.item;
  const imgInfo = item ? item.content : {};
  const { w = DEFAULT_SIZE, h = DEFAULT_SIZE } = imgInfo;
  const { width, height }  = calcMsg(w, h);
  let extendQuery = (imgInfo.url || '').indexOf('?') === -1 ? '?' : '&';
  extendQuery += 'imageView&thumbnail=1500x15000';

  function handleClick () {
    props.onClick(props.item);
  };

  return item ? (
    <View className={item.fromUser ? 'm-img m-img-right' : 'm-img m-img-left'}>
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className='u-space' />
      <View className='u-content'>
        {imgInfo.url ?
        <Image className='u-img' mode='scaleToFill' style={`width: ${width}px;height: ${height}px`} src={imgInfo.url + extendQuery} lazy-load onClick={handleClick} />
        : <View class='u-progress'>
            <Image style="width: 50px;height:50px;" src='https://qiyukf.nosdn.127.net/sdk/res/default/loading_3782900ab9d04a1465e574a7d50af408.gif' />
          </View>
        }
      </View>
    </View>
  ) : null;
}
