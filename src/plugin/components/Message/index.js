import { View,Image,Text } from '@tarojs/components'
import SysTipView from './systip';
import TextView from './text';
import ActionView from './action';



export default function MessageView(props) {
    const { Message } = props;

    return (
        <View>
            {   
                Message ? 
                Message.map( it => {
                    return(
                        <View>
                            {
                                it.type === 'systip' ? <SysTipView item={it}></SysTipView> : null
                            }

                            {
                                it.type === 'text' ? <TextView item={it}></TextView> : null
                            }

                            {
                                it.type === 'action' ? <ActionView item = {it}></ActionView> : null
                            }
                        </View>
                    )
                })
                : null
            }
        </View>
    )
}