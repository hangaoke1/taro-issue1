import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import _get from 'lodash/get';
import './index.less';

export default function MGroup(props) {
  const item = _get(props, 'item', {});

  return (
    <View className="m-group">
      {item.p_img ? <Image className="u-img" src={item.p_img}></Image> : null}
      <View className="u-title">{item.p_title}</View>
    </View>
  );
}
