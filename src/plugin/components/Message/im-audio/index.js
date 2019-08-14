import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import eventbus from '../../../lib/eventbus';

import './index.less';

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
    const audioInfo = item ? JSON.parse(item.content) : {};

    audioCtx.autoplay = false;
    audioCtx.src = audioInfo.url;
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
    const audioInfo = item ? JSON.parse(item.content) : {};

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
        <View className='u-text' onClick={this.handleClick}>
          { item.fromUser ? null : <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View>}
          {Math.ceil(audioInfo.dur / 1000)}&quot;
          { item.fromUser ? <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View> : null}
        </View>
      </View>
    ) : null;
  }
}