import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import Avatar from '../u-avatar';
import ParserRichText from '../../ParserRichText/parserRichText';

import './text.less';

export default function TextView(props) {
  const item = props.item;
  const { content, type } = item;
  const isRich = type === 'rich';

  function handleLinkpress (href) {
    // TODO: 处理富文本a标签点击事件
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
        <ParserRichText html={content} onLinkpress={handleLinkpress} isRich={isRich}></ParserRichText>
        {item.actionText ? (
          <View className='m-action'>
            <View className={item.disabled ? 'u-action-btn u-action-btn-disabled' : 'u-action-btn'} 
                  onClick={(ev) => {props.actionFun(ev)}}>{item.actionText}
            </View>
          </View>
        ) : null}
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
