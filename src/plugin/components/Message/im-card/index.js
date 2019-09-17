import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import Avatar from '../u-avatar';

import './index.less';

export default function CardView(props) {
  const item = props.item;
  const { content, type } = item;

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className='u-text-arrow' />
      <View className='u-text'>
        商品链接
      </View>
    </View>
  );
}

CardView.defaultProps = {
  item: {}
}

CardView.propTypes = {
  item: PropTypes.object
}
