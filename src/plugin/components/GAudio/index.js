import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import Iconfont from '../../../plugin/components/Iconfont';
import './index.less';

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
    duration: 0,
    error: false
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
      this.setState({ error: true });
    });
    audioCtx.onTimeUpdate(() => {
      this.setState({
        currentTime: audioCtx.currentTime
      });
    });

    this.audioCtx = audioCtx;
  }

  componentWillUnmount() {
    console.log('卸载');
    if (this.audioCtx) {
      this.audioCtx.offPlay();
      this.audioCtx.offStop();
      this.audioCtx.offPause();
      this.audioCtx.offTimeUpdate();
      this.audioCtx.offError();
      this.audioCtx.destroy();
      this.audioCtx = null;
    }
  }

  handleClick = () => {
    if (!this.audioCtx) return;

    if (!this.state.playing) {
      console.log('播放');
      this.audioCtx.play();
    } else {
      console.log('暂停');
      this.audioCtx.pause();
    }
  };

  restart = () => {
    if (!this.audioCtx) return;
    this.audioCtx.stop();
    setTimeout(() => {
      this.audioCtx.play();
    }, 500);
  };

  render() {
    const { currentTime, error, playing } = this.state;
    const { name = '未知歌曲' } = this.props;
    return (
      <View className="g-audio">
        <View className="u-left" onClick={this.handleClick}>
          <Image
            className="u-post"
            src="http://nos.netease.com/ysf/3d58ec398e905d6ab67ae4721e7b1b7c.png"
          ></Image>
          <View className="u-status">
            {playing ? (
              <Iconfont
                type="icon-stop-circlex"
                color="#000"
                size="20"
              ></Iconfont>
            ) : (
              <Iconfont
                type="icon-play-circlex"
                color="#000"
                size="20"
              ></Iconfont>
            )}
          </View>
        </View>
        <View className="u-info">
          <View>{name}</View>
          <View className="u-error">
            {error ? '音频异常，请复制链接到浏览器下载' : ''}
          </View>
        </View>
        <View className="u-duration">
          <View>{time2Str(currentTime)}</View>
          <View onClick={this.restart}>重放</View>
        </View>
      </View>
    );
  }
}

export default GAudio;
