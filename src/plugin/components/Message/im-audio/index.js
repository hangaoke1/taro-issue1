import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import eventbus from '../../../lib/eventbus';
import Avatar from '../u-avatar';

import './index.less';

// const mock = {
//   autoreply: 0,
//   content: {"size":4518,"ext":"amr","dur":2820,"url":"http://6661.qytest.netease.com/prd/res/audio/message_92be25847e14e832622bc76761f393e9.mp3","md5":"3d040401aa828fd9611c71b2e4c55860"},
//   fromUser: 0,
//   time: "1565752835763",
//   type: "audio"
// }
// const mock2 = {
//   autoreply: 0,
//   content: {"size":4518,"ext":"amr","dur":2820,"url":"http://qytest.netease.com/sdk/res/audio/message.mp3","md5":"3d040401aa828fd9611c71b2e4c55860"},
//   fromUser: 1,
//   time: "1565752835763",
//   type: "audio"
// }
export default class ImAudio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      audioCtx: null
    }
  }
  
  handleClick = () => {
    if (!this.state.audioCtx) return;

    if (!this.state.playing) {
      eventbus.trigger('audio_stop');
      this.state.audioCtx.play();
    } else {
      this.state.audioCtx.stop();
    }
  }

  play = () => {
    if (this.state.audioCtx) {
      this.state.audioCtx.play();
    }
  }
  
  stop = () => {
    if (this.state.audioCtx) {
      this.state.audioCtx.stop();
    }
  }
 
  componentWillMount () { }

  componentDidMount () {
    const audioCtx = Taro.createInnerAudioContext();
    const item = this.props.item;
    const audioInfo = item ? item.content : {};

    audioCtx.autoplay = false;
    audioCtx.src = audioInfo.mp3Url;
    audioCtx.onPlay(() => {
      this.setState({ playing: true })
    })
    audioCtx.onStop(() => {
      this.setState({ playing: false })
    })
    audioCtx.onEnded(() => {
      this.setState({ playing: false })
    })
    audioCtx.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    this.setState({
      audioCtx
    })

    eventbus.on('audio_stop', this.stop)
  }

  componentWillUnmount () {
    eventbus.off('audio_stop', this.stop)
  }

  render () {
    const { item } = this.props;
    const { playing } = this.state;
    const audioInfo = item ? item.content : {};

    return item ? (
      <View
        className={
          item.fromUser ? 'm-audio m-audio-right' : 'm-audio m-audio-left'
        }
      >
        <Avatar fromUser={item.fromUser} />
        <View className='u-text-arrow' />
        <View className='u-text' onClick={this.handleClick}>
          { item.fromUser ? null : <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View>}
          {Math.round(audioInfo.dur / 1000)}&quot;
          { item.fromUser ? <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View> : null}
        </View>
      </View>
    ) : null;
  }
}