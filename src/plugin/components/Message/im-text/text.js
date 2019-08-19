import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View, Image, RichText } from '@tarojs/components';
import Avatar from '../im-avatar';
import { text2emoji } from '../../../utils/index';

import './text.less';

export default function TextView(props) {
  const item = props.item;
  let { content } = item
  content = text2emoji(content)
  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser}/>
      <View className='u-text-arrow' />
      <View className='u-text'>
        <RichText nodes={content}></RichText>
        {item.actionText ? (
          <View className='m-action'>
            <View className='u-action-btn' onClick={(ev) => {props.actionFun(ev)}}>{item.actionText}</View>
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
