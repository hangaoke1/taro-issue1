import { useState,useReducer } from '@tarojs/taro'
import { Input,View } from '@tarojs/components'
import Iconfont from '../Iconfont';

import './index.less';


export default function ChatBox(props){
    const [value, setValue] = useState('');

    const handleConfirm = (event) => {
        props.handleConfirm(event);
        setValue('');
    }

    const handleInput = (event) => {
        setValue(event.detail.value);
    }

    return(
        <View className='m-ChatBox'>
            <View className='u-voice-icon'>
                <Iconfont type='icon-chat-voice-btn' className='u-voice-icon'></Iconfont>
            </View>
            <Input type="text" value={value} placeholder='请输入您要咨询的问题' 
            className='u-edtior' onInput={handleInput}
            onConfirm={handleConfirm}></Input>
        </View>
    )
}