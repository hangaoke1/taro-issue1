import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View, Image } from '@tarojs/components';
import _get from 'lodash/get';
import Avatar from '../u-avatar';
import ParserRichText from '../../ParserRichText/parserRichText';
import Iconfont from '@/components/Iconfont';
import { parseUrlAction, resendMessage } from '@/actions/chat';

import './text.less';

export default function TextView(props) {
  const item = props.item;
  const status = _get(item, 'status', 0);
  const { content, type } = item;
  const isRich = type === 'rich';

  function handleLinkpress(event) {
    const { detail } = event;
    parseUrlAction(detail);
  }

  // 重新发送消息
  function handleResend() {
    resendMessage(item);
  }

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className="u-text-arrow" />
      <View className="u-text">
        <ParserRichText
          html={content}
          onLinkpress={handleLinkpress}
          isRich={isRich}
          customerTagStyle={{a: item.fromUser ? 'color: #fff;': 'color: #1069d6;'}}
        ></ParserRichText>
        {props.children}

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
  );
}

TextView.defaultProps = {
  item: {}
};

TextView.propTypes = {
  item: PropTypes.object
};
