import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
// import Iconfont from '../../../plugin/components/Iconfont';

function time2Str(time) {
  let seconds = time % 60;
  let minutes = (time - seconds) / 60;
  seconds = parseInt(seconds);
  minutes = parseInt(minutes);
  seconds = seconds < 10 ? '0' + seconds : seconds;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return minutes + ':' + seconds;
}
class GAudio extends Component {
  state = {
    playing: false,
    currentTime: 0,
    duration: 0
  };

  componentDidMount() {
    const audioCtx = Taro.createInnerAudioContext();
    const item = this.props;
    const src = item.src;

    audioCtx.autoplay = false;

    audioCtx.src = src;

    audioCtx.onPlay(() => {
      this.setState({ playing: true });
    });
    audioCtx.onStop(() => {
      this.setState({ playing: false });
    });
    audioCtx.onPause(() => {
      this.setState({ playing: false });
    });
    audioCtx.onEnded(() => {
      this.setState({ playing: false });
    });
    audioCtx.onError(error => {
      console.error(error);
    });
    audioCtx.onTimeUpdate(res => {
      this.setState({
        currentTime: audioCtx.currentTime,
        duration: audioCtx.duration
      });
    });

    this.audioCtx = audioCtx;
  }

  componentWillUnmount () {
    this.audioCtx && this.audioCtx.destroy();
    this.audioCtx = null
  }

  handleClick = () => {
    if (!this.audioCtx) return;

    if (!this.state.playing) {
      console.log('播放')
      this.audioCtx.play();
    } else {
      console.log('暂停')
      this.audioCtx.pause();
    }
  };

  restart = () => {
    if (!this.audioCtx) return;
    this.audioCtx.stop()
    setTimeout(() => {
      this.audioCtx.play()
    }, 500)
  }

  render() {
    const { currentTime, duration } = this.state;
    const { name = '未知歌曲' } = this.props;
    return (
      <View className="g-audio">
        <View className="u-left" onClick={this.handleClick}>
          <Image
            className="u-post"
            src="http://nos.netease.com/ysf/3d58ec398e905d6ab67ae4721e7b1b7c.png"
          ></Image>
          <View className="u-status">
            {/* <Iconfont
              type="icon-play-circlex"
              color="#fff"
              size="20"
            ></Iconfont> */}
          </View>
        </View>
        <View className="u-info">
          <Text>{name}</Text>
        </View>
        <View className="u-duration">
          <View>{time2Str(currentTime)}/{time2Str(duration)}</View>
          <View onClick={this.restart}>重放</View>
        </View>
      </View>
    );
  }
}

export default GAudio;
