import { View, Image } from '@tarojs/components';
import { DEFAULT_KEFU_AVATAR, DEFAULT_ROBOT_AVATAR } from '../../../constants/session';
import { get } from '../../../global_config';

import './index.less';

export default function Avatar(props) {

    const { staff } = props;

    let avatarSrc = null;

    if(!props.fromUser){
        // 客服是机器人
        if(staff.stafftype == 1 || staff.robotInQueue == 1){
            avatarSrc = staff.avatar || DEFAULT_ROBOT_AVATAR;
        }else{
            avatarSrc = staff.avatar || DEFAULT_KEFU_AVATAR;
        }
    }else{
        let userInfo = get('userInfo');
        let userImg;
        if(userInfo && userInfo.data && userInfo.data.length){
          userInfo.data.forEach(item => {
            if(item.key == 'avatar'){
              userImg = item.value;
            }
          })
        }
        avatarSrc = userImg || DEFAULT_KEFU_AVATAR
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


Avatar.defaultProps = {
  staff: {}
}
