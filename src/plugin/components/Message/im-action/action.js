import Taro from '@tarojs/taro';
import TextView from '../im-text/text';
import { anctionHandle } from '../../../actions/actionHandle';

import './action.less';

export default function ActionView(props) {
    const item = props.item;

    const actionFun = (ev) => {
        anctionHandle(item.action);
    }

    const richProps = {
        ...item,
        type: 'rich'
    }

    return (
        <TextView item={richProps} actionFun={actionFun}></TextView>
    )
}
