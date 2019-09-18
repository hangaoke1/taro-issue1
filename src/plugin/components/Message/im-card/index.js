import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import Avatar from '../u-avatar';
import { sendProductCardByUser } from '../../../actions/chat';

import './index.less';

export default function CardView(props) {
  const item = props.item;
  const { content } = item;

  const actionFun = () => {
    sendProductCardByUser();
  }

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className='u-text-arrow' />
      <View className='m-product-card_content'>
        <View className='m-product-card'>
          <View className="m-product-card_pic">
            <Image src={content.picture} className="m-product-card_pic_img"></Image>
          </View>
          <View className="m-product-card_right">
            <View className="m-product-card_right_title">
              {content.title}
            </View>
            <View className="m-product-card_right_desc">
              {content.desc}
            </View>
            <View className="m-product-card_right_note">
              {content.note}
            </View>
          </View>
        </View>
        {
          content.sendByUser ?
            <View className="m-product-card_action" onClick={(ev) => { actionFun() }}>
              {content.actionText || '发送'}
            </View>
            : null
        }
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
