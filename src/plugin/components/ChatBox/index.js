import { useDispatch, useSelector } from '@tarojs/redux';
import Taro, { useState, useCallback } from '@tarojs/taro'
import { Input,View } from '@tarojs/components'
import Iconfont from '../Iconfont';

import { hideAction } from '../../actions/options';

import './index.less';


export default function ChatBox(props){
    const [value, setValue] = useState('');
    const options = useSelector(state => state.Options)
    const dispatch = useDispatch()
    const onHideAction = useCallback(
        () => dispatch(hideAction()),
        [dispatch]
    )

    const handleConfirm = (event) => {
        props.handleConfirm(event);
        setValue('');
    }

    const handleInput = (event) => {
        setValue(event.detail.value);
    }

    const handlePortraitClick = event => {
        props.onPortraitClick(event);
    }

    const handlePlusClick = event => {
        props.onPlusClick(event);
    }

    return(
        <View className='m-ChatBox'>
            <View className='u-voice-icon'>
                <Iconfont type='icon-chat-voice-btn' className='u-voice-icon'></Iconfont>
            </View>
            <Input type='text' value={value} 
              placeholder='请输入您要咨询的问题' 
              className='u-edtior'
              onInput={handleInput}
              onConfirm={handleConfirm} 
              confirmType='send' confirmHold
            ></Input>
            <View className='u-portrait' onClick={handlePortraitClick}>
                <Iconfont type='icon-chat-sadx' color='#666' size='28'></Iconfont>
            </View>
            <View className={`u-plus-icon ${options.showFunc ? 'u-show' : ''}`} onClick={handlePlusClick}>
                <Iconfont type='icon-chat-more-plusx' color='#fff' size='22'></Iconfont>
            </View>
        </View>
    )
}