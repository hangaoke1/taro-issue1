import { useSelector, useDispatch } from '@tarojs/redux';
import Taro, { useState, useEffect } from '@tarojs/taro';
import { Input, View } from '@tarojs/components';
import _isFunction from 'lodash/isFunction';
import eventbus from '@/lib/eventbus';
import { hideAction } from '@/actions/options';
import {
  canSendMessage,
  applyKefu
} from '@/actions/chat';

import Iconfont from '../Iconfont';

import './index.less';

export default function ChatBox(props) {
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);
  const options = useSelector(state => state.Options);
  const dispatch = useDispatch();

  const corpStatus = useSelector(state => state.CorpStatus);

  // 发送文本
  const handleConfirm = event => {

    // 如果会话或者云信状态不对
    if(!canSendMessage()){
      Taro.showToast({
        title: '请等待连线成功后，再发送消息',
        icon: 'none',
        duration: 2000
      })

      applyKefu();
      return;
    }

    setValue('');
    if (_isFunction(props.onConfirm)) {
      props.onConfirm(event);
    }
  };

  // 处理用户输入
  const handleInput = event => {
    setValue(event.detail.value);

    if (_isFunction(props.onInput)) {
      props.onInput(event.detail.value)
    }
  };

  // 点击表情
  const handlePortraitClick = event => {
    setTimeout(() => {
      props.onPortraitClick(event);
      setFocus(false)
    }, 50)
  };

  // 点击加号
  const handlePlusClick = event => {
    // 设置延迟，优化体验，防止键盘弹出状态下点击加号图标导致界面闪动问题
    setTimeout(() => {
      props.onPlusClick(event);
      setFocus(false)
    }, 50)
  };

  // 处理聚焦
  const handleFocus = (event) => {
    dispatch(hideAction());
    setTimeout(() => { setFocus(true) }, 30)
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
      setValue(v => v + item.tag);
    });
    // 监听input重置
    eventbus.on('reset_input', () => {
      setValue('')
      setFocus(false)
    })
    return () => {
      eventbus.off('emoji_click');
      eventbus.off('reset_input');
    };
  }, []);

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
        placeholder={corpStatus.chatInputPlaceHolder}
        disabled={corpStatus.chatInputDisabled}
        className='u-edtior'
        onInput={handleInput}
        onConfirm={handleConfirm}
        confirmType='send'
        confirmHold
        adjustPosition={false}
      />
      <View className='u-portrait' onTouchStart={handlePortraitClick}>
        <Iconfont type='icon-chat-portraitmobile' color='#666' size='28' />
      </View>
      <View
        className={`u-plus-icon ${options.showFunc ? 'u-show' : ''}`}
        onTouchStart={handlePlusClick}
      >
        <Iconfont type='icon-chat-more-plusx' color='#fff' size='22' />
      </View>
    </View>
  );
}
