import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './systip.less';


export default function SysTipView(props) {
    const item = props.item;

    return(
        <View className='m-systip'> 
            <Text className='u-tip'>{item.content}</Text>
        </View>
    )
}
