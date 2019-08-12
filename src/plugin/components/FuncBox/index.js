/**
 * 底部功能面板
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import Iconfont from '../Iconfont';

import './index.less';

/**
 * 
 * @param {array} list 功能操作列表
 */
export default function FuncBox(props) {
    const handleClick = (v) => {
        props.onFuncClick(v)
    }

    const list = props.list || [];

    return (
        <View className='m-FuncBox'>
            { list.map(item => {
                return (
                <View className='m-FuncBox__item' key={item.type} onClick={() => handleClick(item)}>
                    <View className='item__icon'>
                        <Iconfont type={item.icon} color='#666' size='28'></Iconfont>
                    </View>
                    <View className='item__name'>{item.name}</View>
                </View>)
            })}
        </View>
    )
}