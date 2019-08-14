import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import eventbus from '../../../lib/eventbus';

import './index.less';

export default function ImAudio(props) {
  const { playing, setPlaying } = useState(false);
  const item = props.item;
  const audioInfo = item ? JSON.parse(item.content) : {};
  const audioCtx = Taro.createInnerAudioContext();

  audioCtx.autoplay = false;
  audioCtx.src = audioInfo.url;
  audioCtx.onPlay(() => {
    setPlaying(true)
  })
  audioCtx.onStop(() => {
    setPlaying(false)
  })
  audioCtx.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })

  function handleClick () {
    if (audioCtx.paused) {
      audioCtx.play();
    } else {
      audioCtx.stop();
    }
  }

  useEffect(() => {
    eventbus.on('audio_click', handleClick);
    return () => {
      eventbus.off('audio_click', handleClick);
      audioCtx.destroy();
    };
  });

  return item ? (
    <View
      className={
        item.fromUser ? 'm-audio m-audio-right' : 'm-audio m-audio-left'
      }
    >
      <View>
        <Image
          className='u-avatar'
          src='http://qytest.netease.com/sdk/res/default/robot_portrait.png'
        />
      </View>
      <View className='u-text-arrow' />
      <View className='u-text'>
        { item.fromUser ? null : <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View>}
        {Math.ceil(audioInfo.dur / 1000)}&quot;
        { item.fromUser ? <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View> : null}
      </View>
    </View>
  ) : null;
}
