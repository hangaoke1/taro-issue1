import Taro from '@tarojs/taro';
import { useSelector } from '@tarojs/redux'
import { View, Image } from '@tarojs/components';
import { DEFAULT_KEFU_AVATAR, DEFAULT_ROBOT_AVATAR } from '../../../constants/session';

import './index.less';

export default function Avatar(props) {

    const session = useSelector(state => state.Session);

    let avatarSrc = null;

    if(!props.fromUser){
        // 客服是机器人
        if(session.stafftype == 1 || session.robotInQueue == 1){
            avatarSrc = session.iconurl || DEFAULT_ROBOT_AVATAR;
        }else{
            avatarSrc = session.iconurl || DEFAULT_KEFU_AVATAR;
        }
    }else{
        avatarSrc = DEFAULT_KEFU_AVATAR
    }

    return (
        <View>
            <Image
                className='u-avatar'
                src={avatarSrc}
            />
        </View>
    )
}