import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import Avatar from '../u-avatar';
import ParserRichText from '../../ParserRichText/parserRichText';
import { parseUrlAction } from '../../../actions/chat';

import './text.less';

export default function TextView(props) {
  const item = props.item;
  const { content, type } = item;
  const isRich = type === 'rich';

  function handleLinkpress (event) {
    const { detail } = event;
    parseUrlAction(detail);
  }

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className='u-text-arrow' />
      <View className='u-text'>
        <ParserRichText html={content} onLinkpress={handleLinkpress} isRich={isRich}></ParserRichText>
        {props.children}
      </View>
    </View>
  );
}

TextView.defaultProps = {
  item: {}
}

TextView.propTypes = {
  item: PropTypes.object
}
