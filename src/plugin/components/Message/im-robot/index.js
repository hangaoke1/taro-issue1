import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import Avatar from '../u-avatar';
import ParserRichText from '../../ParserRichText/parserRichText';

import './index.less';

/**
 * 机器人消息解析
 */
export default function RobotView(props) {
  const item = props.item;
  let { content } = item;

  function handleLinkpress (href) {
    console.log('----点击富文本a标签----', href);
  }

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} />
      <View className='u-text-arrow' />
      <View className='u-text'>
        <ParserRichText html={content} onLinkpress={handleLinkpress}></ParserRichText>
        <View className='u-action'>
          <View className='u-button'>有用</View>
          <View className='u-button'>没用</View>
        </View>
      </View>
    </View>
  );
}

RobotView.defaultProps = {
  item: {}
}

RobotView.propTypes = {
  item: PropTypes.object
}
