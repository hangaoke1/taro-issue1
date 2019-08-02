import { View, Button } from '@tarojs/components'
import TextView from './text';
import './action.less';

export default function ActionView(props){
    const item = props.item;

    return(
        <TextView item={item}></TextView>
    )
} 