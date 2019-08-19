import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import SysTipView from './im-systip/systip';
import TextView from './im-text/text';
import ActionView from './im-action/action';
import ImgView from './im-img/index';
import AudioView from './im-audio/index';
import VideoView from './im-video/index';

import './index.less';

export default function MessageView(props) {
    const { Message } = props;

    function handleImgClick (item) {
        props.onImgClick(item)
    }

    return (
        <View className="message-view">
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
                            {   it.type === 'video' ? <VideoView item={it}></VideoView> : null}
                        </View>
                    )
                })
                : null
            }
        </View>
    )
}