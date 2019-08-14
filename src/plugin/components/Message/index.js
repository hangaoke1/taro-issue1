import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import SysTipView from './im-systip/systip';
import TextView from './im-text/text';
import ActionView from './im-action/action';
import ImgView from './im-img/index';
import AudioView from './im-audio/index';

export default function MessageView(props) {
    const { Message } = props;

    function handleImgClick (item) {
        props.onImgClick(item)
    }

    const mock = {
        autoreply: 0,
        content: JSON.stringify({"size":4518,"ext":"amr","dur":2820,"url":"http://6661.qytest.netease.com/prd/res/audio/message_92be25847e14e832622bc76761f393e9.mp3","md5":"3d040401aa828fd9611c71b2e4c55860"}),
        fromUser: 0,
        time: "1565752835763",
        type: "audio"
    }
    const mock2 = {
        autoreply: 0,
        content: JSON.stringify({"size":4518,"ext":"amr","dur":2820,"url":"http://qytest.netease.com/sdk/res/audio/message.mp3","md5":"3d040401aa828fd9611c71b2e4c55860"}),
        fromUser: 1,
        time: "1565752835763",
        type: "audio"
    }
    return (
        <View>
            <AudioView item={mock}></AudioView>
            <AudioView item={mock2}></AudioView>
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
                            {
                                it.type === 'audio' ? <AudioView item={it}></AudioView> : null
                            }
                        </View>
                    )
                })
                : null
            }
        </View>
    )
}