import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import SysTipView from './im-systip/systip';
import TextView from './im-text/text';
import ActionView from './im-action/action';
import ImgView from './im-img/index';

export default function MessageView(props) {
    const { Message } = props;

    function handleImgClick (item) {
        props.onImgClick(item)
    }

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
                            {
                                it.type === 'image' ? <ImgView onClick={handleImgClick} item={it}></ImgView> : null
                            }
                        </View>
                    )
                })
                : null
            }
        </View>
    )
}