/**
 * 图片消息
 */
import Taro from '@tarojs/taro';
import _get from 'lodash/get';
import { View, Image } from '@tarojs/components';
import { calcMsg } from '@/utils/index';
import { resendMessage } from '@/actions/chat';
import Avatar from '../u-avatar';
import Iconfont from '@/components/Iconfont';

import './index.less';

const DEFAULT_SIZE = 140;

export default function ImgView(props) {
  const item = props.item;
  const imgInfo = _get(item, 'content', {});
  const status = _get(item, 'status', 0);

  const { w = DEFAULT_SIZE, h = DEFAULT_SIZE } = imgInfo;
  const { width, height } = calcMsg(w, h);
  let extendQuery = (imgInfo.url || '').indexOf('?') === -1 ? '?' : '&';
  extendQuery += 'imageView&thumbnail=1500x15000';

  const imgUrl = imgInfo.url + extendQuery

  function handleClick() {
    props.onClick(props.item);
  }

  // 重新发送消息
  function handleResend() {
    resendMessage(item);
  }

  return item ? (
    <View className={item.fromUser ? 'm-img m-img-right' : 'm-img m-img-left'}>
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className="u-space" />
      <View className="u-content">
        {status === 0 ? (
          <Image
            className="u-img"
            mode="scaleToFill"
            style={`width: ${width}px;height: ${height}px`}
            src={imgUrl}
            lazy-load
            onClick={handleClick}
          />
        ) : (
          <Image src="http://qytest.netease.com/sdk/res/default/robot_portrait.png" class="u-progress"></Image>
          // <View class="u-progress"></View>
        )}

        {status === 1 && item.fromUser ? (
          <View className="u-status">
            <Image
              style="width: 25px;height:25px;"
              src="https://qiyukf.nosdn.127.net/sdk/res/default/loading_3782900ab9d04a1465e574a7d50af408.gif"
              // src="http://veralsp.qytest.netease.com/prd/res/img/loading_03ce3dcc84af110e9da8699a841e5200.gif"
            />
          </View>
        ) : null}
        {status === -1 && item.fromUser ? (
          <View className="u-status" onClick={handleResend}>
            <Iconfont type="icon-tishixinxi" color="red" size="25" />
          </View>
        ) : null}
      </View>
    </View>
  ) : null;
}
