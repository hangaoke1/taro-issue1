import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import './index.less';

export default function MCard(props) {

  function handleClick () {
    props.onClick && props.onClick();
  }

  const item = _get(props, 'item', {});

  return (
    <View className="m-card" onClick={handleClick}>
      <View className="u-left">
        <Image
          className="u-img"
          src={item.p_img}
        ></Image>
      </View>
      <View className="u-right">
        <View className="u-right-top">
          <View className="u-title">
            {item.p_title}
          </View>
          <View className="u-info">
            <View className="u-attr1">{item.p_attr_1}</View>
            <View className="u-attr2">{item.p_attr_2}</View>
          </View>
        </View>
        <View className="u-right-bottom">
          <View className="u-subTitle">{item.p_sub_title}</View>
          <View className="u-attr3">{item.p_attr_3}</View>
        </View>
      </View>
    </View>
  );
}

MCard.propTypes = {
  onClick: PropTypes.func
}
