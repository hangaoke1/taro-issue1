import Taro from '@tarojs/taro';
import TextView from '../im-text/text';

import './action.less';

export default function ActionView(props){
    const item = props.item;

    const actionFun =  (ev) => {
        console.log('action.......')
    }

    return(
        <TextView item={item} actionFun = {actionFun}></TextView>
    )
}
