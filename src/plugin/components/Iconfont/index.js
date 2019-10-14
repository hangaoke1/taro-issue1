import { View } from '@tarojs/components'

import '../../assets/font.less';

export default function Iconfont(props) {
    const { size = 28, color = '#ccc' } = props;

    return <View className={'u-iconfont iconfont ' + props.type} style={{
        display: 'flex',
        color: color,
        fontSize: size + 'px'
    }}
    ></View>
}
