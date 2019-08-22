import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import Iconfont from '../Iconfont';

import './index.less';

export default function Render345Level(props) {
    const { list,selectValue } = props;

    return(
        <View className="m-evaluation_icon_345level">
            {
                list.map(item => {
                    return(
                        <View className="m-evaluation_icon_content">
                            <View className="u-evaluation-icon">
                                <Iconfont type="icon-star-offx" color={"#666"} size='26' />
                            </View>
                        </View>
                    )
                })
            }
        </View>
    )
}

Render345Level.defaultProps = {
    list: []
}