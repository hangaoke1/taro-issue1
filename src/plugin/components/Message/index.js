import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import SysTipView from './im-systip/systip';
import TextView from './im-text/text';
import ActionView from './im-action/action';
import ImgView from './im-img/index';
import AudioView from './im-audio/index';
import VideoView from './im-video/index';
import RobotView from './im-robot/index';
import BotView from './im-bot/index';
import CardView from './im-card';

import './index.less';

export default function MessageView(props) {
    const { Message } = props;

    function handleImgClick (item) {
        props.onImgClick(item)
    }

    return (
        <View className='message-view'>
            {
                Message ?
                Message.map( (it) => {
                    return(
                        <View key={it.uuid}>
                            {
                                it.type === 'systip' ? <SysTipView item={it}></SysTipView> : null
                            }

                            {
                                ['text', 'rich'].includes(it.type) ? <TextView item={it}></TextView> : null
                            }

                            {
                                ['action', 'entries'].includes(it.type) ? <ActionView item={it}></ActionView> : null
                            }
                            {
                                it.type === 'image' ? <ImgView onClick={handleImgClick} item={it}></ImgView> : null
                            }
                            {
                                it.type === 'audio' ? <AudioView item={it}></AudioView> : null
                            }
                            {
                                it.type === 'video' ? <VideoView item={it}></VideoView> : null
                            }
                            {
                                ['qa-list', 'qa'].includes(it.type) ? <RobotView item={it}></RobotView> : null
                            }
                            {
                                it.type === 'bot' ? <BotView item={it}></BotView> : null
                            }
                            {
                              ['product', 'order-card'].includes(it.type) ? <CardView item={it}></CardView> : null
                            }
                        </View>
                    )
                })
                : null
            }
        </View>
    )
}
