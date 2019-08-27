import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.less';

export default function UCard(props) {
  return <View className='m-card'>
    <View className='u-left'>
      <Image className='u-img' src='https://img.alicdn.com/imgextra/i2/497332855/O1CN01yqsaRH1WxdITlk5cg_!!497332855.jpg_430x430q90.jpg'></Image>
    </View>
    <View className='u-right'>
      <View className='u-right-top'>
        <View className='u-title'>OPPO Reno 10倍变焦版 全面屏拍照手机 6G+128G 雾海绿 全网通…</View>
        <View className='u-info'>
          <View className='u-attr1'>¥99.9</View>
          <View className='u-attr2'>x1</View>
        </View>
      </View>
      <View className='u-right-bottom'>
        <View className='u-subTitle'>副标题文本样式副标题文本</View>
        <View className='u-attr3'>卖家已发货</View>
      </View>
    </View>
  </View>;
}
