import { useSelector, useDispatch } from '@tarojs/redux';
import Taro, { useState, useEffect } from '@tarojs/taro';
import { Input, View } from '@tarojs/components';
import _isFunction from 'lodash/isFunction';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import { hideAction } from '@/actions/options';
import {
  canSendMessage,
  applyKefu,
  isShuntEntriesStatus
} from '@/actions/chat';

import Iconfont from '../Iconfont';
import UVoice from './u-voice';

import './index.less';

export default function ChatBox(props) {
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);
  const [lock, setLock] = useState(false); // HACK: 防止键盘弹起动画过程中点击表情从而出现键盘遮挡bug
  const [type, setType] = useState('keyboard'); // voice 语音 keyboard键盘
  const options = useSelector(state => state.Options);
  const Setting = useSelector(state => state.Setting);
  const placeholder = _get(Setting, 'setting.placeHolder');
  const Session = useSelector(state => state.Session);
  const dispatch = useDispatch();

  const corpStatus = useSelector(state => state.CorpStatus);

  // 发送文本
  const handleConfirm = event => {
    if (isShuntEntriesStatus()) {
      Taro.showToast({
        title: '为了给您提供更专业的服务，请您选择要咨询的内容类型',
        icon: 'none',
        duration: 2000
      });

      return;
    }

    // 如果会话或者云信状态不对
    if (!canSendMessage()) {
      Taro.showToast({
        title: '请等待连线成功后，再发送消息',
        icon: 'none',
        duration: 2000
      });

      applyKefu();
      return;
    }

    if (_isFunction(props.onConfirm) && value) {
      props.onConfirm(value);
    }
    setValue('');
  };

  // 处理用户输入
  const handleInput = event => {
    setValue(event.detail.value);

    if (_isFunction(props.onInput)) {
      props.onInput(event.detail.value);
    }
  };

  // 点击表情
  const handlePortraitClick = event => {
    if (lock) return;
    event.stopPropagation();
    props.onPortraitClick(event);
  };

  // 点击加号
  const handlePlusClick = event => {
    if (lock) return;
    event.stopPropagation();
    props.onPlusClick(event);
  };

  // 处理聚焦
  const handleFocus = event => {
    if (!lock) {
      setLock(true);
      setTimeout(() => {
        setLock(false);
      }, 500);
    }
    dispatch(hideAction());
    setFocus(true);
    props.onFocus(event);
  };

  // 处理失去焦点
  const handleBlur = event => {
    setFocus(false);
    props.onBlur(event);
  };

  const handleLeftClick = () => {
    const newType = type === 'voice' ? 'keyboard' : 'voice';
    setType(newType);
  };

  useEffect(() => {
    // 处理点击表情
    eventbus.on('emoji_click', item => {
      setValue(v => v + item.tag);
    });
    // 监听input重置
    eventbus.on('reset_input', () => {
      setValue('');
      setFocus(false);
    });
    eventbus.on('hide_keyboard', () => {
      setFocus(false);
    });
    return () => {
      eventbus.off('emoji_click');
      eventbus.off('reset_input');
      eventbus.off('hide_keyboard');
    };
  }, []);

  function preventTouchMove(e) {
    e.stopPropagation();
    return;
  }

  const isKefuOnline = Session.stafftype === 0 && Session.code === 200; // 客服在线状态

  return (
    <View className="m-ChatBox" onTouchMove={preventTouchMove}>
      {this.props.children}
      {isKefuOnline ? (
        <View className="u-voice-icon" onClick={handleLeftClick}>
          {type === 'keyboard' ? (
            <Iconfont
              type="icon-chat-voice-btn"
              className="u-voice-icon"
              color="#666"
            />
          ) : null}
          {type === 'voice' ? (
            <Iconfont
              type="icon-chat-keyboard"
              className="u-voice-icon"
              color="#666"
            />
          ) : null}
        </View>
      ) : (
        <View style="width: 10px;"></View>
      )}
      {type === 'voice' && isKefuOnline ? (
        <View style="flex: 1;">
          <UVoice></UVoice>
        </View>
      ) : (
        <Block>
          <Input
            type="text"
            value={value}
            focus={focus}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder || corpStatus.chatInputPlaceHolder}
            disabled={corpStatus.chatInputDisabled}
            className="u-edtior"
            onInput={handleInput}
            onConfirm={handleConfirm}
            confirmType="send"
            confirmHold
            adjustPosition={false}
          />
          <View className="u-portrait" onTouchStart={handlePortraitClick}>
            <Iconfont type="icon-chat-portraitmobile" color="#666" size="28" />
          </View>
        </Block>
      )}
      <View
        className={`u-plus-icon ${options.showFunc ? 'u-show' : ''}`}
        onTouchStart={handlePlusClick}
      >
        <Iconfont
          type="icon-plus-circlex"
          color={Setting.themeColor}
          size="28"
        />
      </View>
    </View>
  );
}
