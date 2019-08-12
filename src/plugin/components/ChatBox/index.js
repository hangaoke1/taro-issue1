import { useSelector, useDispatch } from '@tarojs/redux';
import Taro, { useState, useEffect } from '@tarojs/taro';
import { Input, View } from '@tarojs/components';
import Iconfont from '../Iconfont';
import eventbus from '../../lib/eventbus';
import { hideAction } from '../../actions/options'

import './index.less';

export default function ChatBox(props) {
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);
  const options = useSelector(state => state.Options);
  const dispatch = useDispatch()

  // 发送文本
  const handleConfirm = event => {
    setValue('');
    props.handleConfirm(event);
  };

  // 处理用户输入
  const handleInput = event => {
    setValue(event.detail.value);
  };

  // 点击表情
  const handlePortraitClick = event => {
    props.onPortraitClick(event);
  };

  // 点击加号
  const handlePlusClick = event => {
      props.onPlusClick(event);
  };

  // 处理聚焦
  const handleFocus = (event) => {
    dispatch(hideAction());
    setTimeout(() => { setFocus(true) }, 100)
    props.onFocus(event)
  };

  // 处理失去焦点
  const handleBlur = (event) => {
    setFocus(false)
    props.onBlur(event)
  };


  useEffect(() => {
    // 处理点击表情
    eventbus.on('emoji_click', item => {
        setValue(value + item.tag);
    });
    return () => {
      eventbus.off('emoji_click');
    };
  });

  return (
    <View className='m-ChatBox'>
      <View className='u-voice-icon'>
        <Iconfont type='icon-chat-voice-btn' className='u-voice-icon' />
      </View>
      <Input
        type='text'
        value={value}
        focus={focus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder='请输入您要咨询的问题'
        className='u-edtior'
        onInput={handleInput}
        onConfirm={handleConfirm}
        confirmType='send'
        confirmHold
        adjustPosition={false}
        cursorSpacing={999}
      />
      <View className='u-portrait' onClick={handlePortraitClick}>
        <Iconfont type='icon-chat-portraitmobile' color='#666' size='28' />
      </View>
      <View
        className={`u-plus-icon ${options.showFunc ? 'u-show' : ''}`}
        onClick={handlePlusClick}
      >
        <Iconfont type='icon-chat-more-plusx' color='#fff' size='22' />
      </View>
    </View>
  );
}
