import { useDispatch, useSelector } from '@tarojs/redux';
import Taro, { useState, useCallback } from '@tarojs/taro'
import { Input,View } from '@tarojs/components'
import Iconfont from '../Iconfont';

import { hideAction } from '../../actions/options';

import './index.less';


export default function ChatBox(props){
    const [value, setValue] = useState('');
    const [focus, setFocus] = useState(false);
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

    // 点击表情
    const handlePortraitClick = event => {
        if (options.showPortrait && !focus) {
            setFocus(true);
        }
        props.onPortraitClick(event);
    }

    // 点击加号
    const handlePlusClick = event => {
        if (options.showFunc && !focus) {
            setFocus(true);
        }
        props.onPlusClick(event);
    }

    const handleFocus = () => {
        setFocus(true);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setFocus(false);
        }, 100)
    }

    return(
        <View className='m-ChatBox'>
            <View className='u-voice-icon'>
                <Iconfont type='icon-chat-voice-btn' className='u-voice-icon'></Iconfont>
            </View>
            <Input type='text' value={value}
              focus={focus}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder='请输入您要咨询的问题' 
              className='u-edtior'
              onInput={handleInput}
              onConfirm={handleConfirm} 
              confirmType='send' confirmHold
            ></Input>
            <View className='u-portrait' onClick={handlePortraitClick}>
                <Iconfont type='icon-chat-portraitmobile' color='#666' size='28'></Iconfont>
            </View>
            <View className={`u-plus-icon ${options.showFunc ? 'u-show' : ''}`} onClick={handlePlusClick}>
                <Iconfont type='icon-chat-more-plusx' color='#fff' size='22'></Iconfont>
            </View>
        </View>
    )
}