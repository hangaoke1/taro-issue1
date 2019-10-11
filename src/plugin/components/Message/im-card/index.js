import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import Avatar from '../u-avatar';
import { sendProductCardByUser } from '../../../actions/chat';
import { clickAction } from '../../../utils';

import './index.less';

export default function CardView(props) {
  const item = props.item;
  const { content } = item;

  const actionFun = () => {
    sendProductCardByUser();
  }

  const clickProductAction = (ev, url) => {
    clickAction({
      type: 'click',
      event: ev,
      url,
      from: 'qiyu_product_card'
    })
  }

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className='u-text-arrow' />
      {
        item.type == 'product' ?
          <View className='m-product-card_content'>
            <View className='m-product-card' onClick={(ev) => { clickProductAction(ev, content.url, 'qiyu_product_card') }}>
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
          : null
      }

      {
        item.type == 'order-card' ?
          <View className='m-product-card_content'>
            <View className='m-product-card' onClick={(ev) => { clickProductAction(ev, content.url, 'qiyu_product_card') }}>
              <View className="m-product-card_pic">
                <Image src={content.picture} className="m-product-card_pic_img"></Image>
              </View>
              <View className="m-product-card_right">
                <View className="m-order-card_right_title">
                  <View className="m-order-card_right_title_left">
                    {content.title}
                  </View>
                  {
                    content.payMoney ?
                      <View className="m-order-card_right_title_right">
                        {content.payMoney}
                      </View>
                      : null
                  }
                </View>
                <View className="m-order-card_right_desc">
                  <View className="m-order-card_right_desc_left">
                    {content.desc}
                  </View>
                  {
                    content.orderCount ?
                      <View className="m-order-card_right_desc_right">
                        {content.orderCount}
                      </View>
                      : null
                  }
                </View>
                <View className="m-order-card_right_note">
                  {
                    content.orderStatus ?
                      <View className="m-order-card_right_note_left">
                        {content.orderSku}
                      </View>
                      : null
                  }
                  <View className="m-order-card_right_note_right">
                    {content.orderStatus || content.price}
                  </View>
                </View>
              </View>
            </View>
            {
              content.orderId || content.orderTime ?
                <View className="m-order-card_time">
                  {
                    content.orderId ?
                      <View>订单编号：{content.orderId}</View>
                      : null
                  }
                  {
                    content.orderTime ?
                      <View>下单时间：{content.orderTime}</View>
                      : null
                  }
                </View>
                : null
            }
            {
              content.activity ?
                <View className="m-order-card_activity" onClick={(ev) => { clickProductAction(ev, content.activityHref, 'qiyu_product_card_activity') }}>
                  {content.activity}
                </View>
                : null
            }
            {
              content.tags && content.tags.length ?
                <View className="m-order-card_tags">
                  {
                    content.tags.map(it => {
                      return <View className="m-order-card_tags_btn"
                        onClick={(ev) => { clickProductAction(ev, it.url, 'qiyu_product_card_tag') }}>
                        {it.label}
                      </View>
                    })
                  }
                </View>
                : null
            }
          </View>
          : null
      }
    </View>
  );
}

CardView.defaultProps = {
  item: {
    content: {}
  }
}

CardView.propTypes = {
  item: PropTypes.object
}
