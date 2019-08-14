import Taro from '@tarojs/taro';
import TextView from '../im-text/text';

import './action.less';

export default function ActionView(props){
    const item = props.item;

    return(
        <TextView item={item}></TextView>
    )
}
