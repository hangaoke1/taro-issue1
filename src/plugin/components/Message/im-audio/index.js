import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image } from '@tarojs/components';
import _get from 'lodash/get';
import eventbus from '../../../lib/eventbus';
import Avatar from '../u-avatar';
import Iconfont from '@/components/Iconfont';
import { resendMessage } from '@/actions/chat';
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

@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
export default class ImAudio extends Component {

  state = {
    playing: false
  }

  handleClick = () => {
    if (!this.audioCtx) return;

    if (!this.state.playing) {
      eventbus.trigger('audio_stop');
      this.audioCtx.play();
    } else {
      this.audioCtx.stop();
    }
  }

  play = () => {
    if (this.audioCtx) {
      this.audioCtx.play();
    }
  }

  stop = () => {
    if (this.audioCtx) {
      this.audioCtx.stop();
    }
  }

  handleResend = (item, e) => {
    e.stopPropagation();
    resendMessage(item);
  }

  componentWillMount () { }


  componentDidUpdate(prevProps){
    if (this.audioCtx && !this.audioCtx.src) {
      const item = this.props.item;
      const audioInfo = item ? item.content : {};
      if (audioInfo.url) {
        this.audioCtx.src = audioInfo.url;
      }
    }
  }

  componentDidMount () {
    const audioCtx = Taro.createInnerAudioContext();
    const item = this.props.item;
    const audioInfo = item ? item.content : {};

    audioCtx.autoplay = false;

    audioCtx.src = audioInfo.url || '';

    audioCtx.onPlay(() => {
      this.setState({ playing: true })
    })
    audioCtx.onStop(() => {
      this.setState({ playing: false })
    })
    audioCtx.onEnded(() => {
      this.setState({ playing: false })
    })
    audioCtx.onError((error) => {
      console.error(error)
    })

    this.audioCtx = audioCtx

    eventbus.on('audio_stop', this.stop)
  }

  componentWillUnmount () {
    eventbus.off('audio_stop', this.stop)
  }

  render () {
    const { item, Setting } = this.props;
    const { playing } = this.state;
    const audioInfo = item ? item.content : {};
    const themeColor = item && item.fromUser ? _get(Setting, 'themeColor') : '';
    const status = _get(item, 'status', 0);

    return item ? (
      <View
        className={
          item.fromUser ? 'm-audio m-audio-right' : 'm-audio m-audio-left'
        }
      >
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className='u-text-arrow' style={`${item.fromUser ? 'border-left-color: ' + themeColor : ''}`} />
        <View className='u-text' style={`${item.fromUser ? 'background-color: ' + themeColor : ''}`} onClick={this.handleClick}>
          { item.fromUser ? null : <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View>}
          {Math.round(audioInfo.dur / 1000) || 1}&quot;
          { item.fromUser ? <View className={`u-voice-icon ${playing ? 'z-audio-playing' : ''}`}></View> : null}

          {status === 1 && item.fromUser ? (
            <View className="u-status">
              <Image
                style="width: 25px;height:25px;"
                src="https://qiyukf.nosdn.127.net/sdk/res/default/loading_3782900ab9d04a1465e574a7d50af408.gif"
              />
            </View>
          ) : null}
          {status === -1 && item.fromUser ? (
            <View className="u-status" onClick={this.handleResend.bind(this, item)}>
              <Iconfont type="icon-tishixinxi" color="red" size="25" />
            </View>
          ) : null}
        </View>
      </View>
    ) : null;
  }
}
