import { View,Image,Text } from '@tarojs/components'
import './text.less';


export default function TextView(props) {
    const item = props.item;

    return(
        <View className={item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'}>
            <View>
                <Image className="u-avatar" src="http://qytest.netease.com/sdk/res/default/robot_portrait.png"></Image>
            </View>
            <View className="u-text-arrow"></View>
            <View className="u-text">
                <Text>{item.content}</Text>
            </View>
        </View>
    )
}