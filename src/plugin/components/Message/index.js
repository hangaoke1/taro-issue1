import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import SysTipView from './systip';
import TextView from './text';
import ActionView from './action';

export default function MessageView(props) {
    const { Message } = props;
    return (
        <View>
            {   
                Message ? 
                Message.map( (it, index) => {
                    return(
                        <View key={index}>
                            {
                                it.type === 'systip' ? <SysTipView item={it}></SysTipView> : null
                            }

                            {
                                it.type === 'text' ? <TextView item={it}></TextView> : null
                            }

                            {
                                it.type === 'action' ? <ActionView item={it}></ActionView> : null
                            }
                        </View>
                    )
                })
                : null
            }
        </View>
    )
}