import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text } from '@tarojs/components';
import Iconfont from '@/components/Iconfont';
import {
  sendVoice
} from '../../../actions/chat';
import './index.less';

@connect(
  ({}) => ({}),
  dispatch => ({
    sendVoice(value) {
      dispatch(sendVoice(value));
    }
  })
)
class UVoice extends Component {
  state = {
    showToast: false,
    showCancel: false
  };

  constructor() {
    this.startTimer = null;
    this.startPos = 0;
    this.endPos = 0;
    this.RecorderManager = null;
    this.cancel = false;
  }

  componentWillMount() {}

  componentDidMount() {}

  handleTouchStart = (event) => {
    this.startTimer = setTimeout(() => {
      this.startPos = event.touches[0].clientY
      this.endPos = event.touches[0].clientY
      this.cancel = false
      this.setState({
        showToast: true
      });
      this.RecorderManager = Taro.getRecorderManager()
      this.RecorderManager.onStop((res) => {
        if (this.cancel) {
          console.log('取消发送')
        } else {
          console.log('录音完成', res)
          this.props.sendVoice(res)
        }
      })
      this.RecorderManager.start({
        format: 'mp3',
        duration: 600000 // 10分钟
      })
      
      console.log('开始录入');
    }, 300);
  };

  handleTouchMove = (event) => {
    this.endPos = event.touches[0].clientY
    const diff = this.startPos - this.endPos
    this.setState({
      showCancel: diff > 100 ? true : false
    })
    event.stopPropagation()
  }

  handleTouchEnd = (event) => {
    clearTimeout(this.startTimer);
    this.startTimer = null;
    this.setState({
      showToast: false,
      showCancel: false
    });
    const diff = this.startPos - this.endPos
    if (diff > 100) {
      this.cancel = true
      this.RecorderManager.stop()
    } else {
      this.RecorderManager.stop()
    }
  };

  handleTouchcancel = (event) => {
    clearTimeout(this.startTimer);
    this.startTimer = null;
    this.setState({
      showToast: false,
      showCancel: false
    });
    this.cancel = true
    this.RecorderManager.stop()
  }

  preventTouchMove = (e) => {
    e.stopPropagation()
    return
  }

  render() {
    const { showToast, showCancel } = this.state;
    let toast = null;
    if (showToast && !showCancel) {
      toast = (
        <View className="u-voice-wrap" onTouchMove={this.preventTouchMove}>
          <View className="u-voice">
            <Iconfont type="icon-chat-voice" color="#fff" size="90"></Iconfont>
            <Text className="u-tip">手指上滑，取消发送</Text>
          </View>
        </View>
      );
    }
    if (showToast && showCancel) {
      toast = (
        <View className="u-voice-wrap" onTouchMove={this.preventTouchMove}>
          <View className="u-voice">
            <Iconfont type="icon-chat-cancel" color="#fff" size="90"></Iconfont>
            <Text className="u-tip">松开手指，取消发送</Text>
          </View>
        </View>
      );
    }
    return (
      <Button
        className={`u-voice-input ${showToast ? 'z-active': ''}`}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onTouchMove={this.handleTouchMove}
        onTouchcancel={this.handleTouchcancel}
      >
        { showToast && !showCancel ? <Text>松开 结束</Text> : <Text>按住 说话</Text>}
        { toast }
      </Button>
    );
  }
}

export default UVoice;
