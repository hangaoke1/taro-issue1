import Taro, { Component } from '@tarojs/taro';
import { Input, View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Iconfont from '../Iconfont';
import eventbus from '../../lib/eventbus';
import { hideAction } from '../../actions/options';

import './index.less'

@connect(
  ({ Options }) => ({
    options: Options
  }),
  dispatch => ({
    hideAction() {
      dispatch(hideAction());
    }
  })
)
class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      focus: ''
    };
  }

  componentWillMount() {}

  componentDidMount() {
    eventbus.on('emoji_click', item => {
      this.setState(state => ({
        value: state.value + item.tag
      }));
    });
  }

  componentWillUnmount() {
    eventbus.off('emoji_click');
  }

  handleConfirm = event => {
    this.props.handleConfirm(event);
    this.setState({
      value: ''
    });
  };

  handleInput = event => {
    this.setState({
      value: event.detail.value
    });
  };

  // 点击表情
  handlePortraitClick = event => {
    if (this.focus) {
      setTimeout(() => {
        this.props.onPortraitClick(event);
      }, 400);
    } else {
      this.props.onPortraitClick(event);
    }
  };

  // 点击加号
  handlePlusClick = event => {
    if (this.focus) {
      setTimeout(() => {
        this.props.onPlusClick(event);
      }, 400);
    } else {
      this.props.onPlusClick(event);
    }
  };

  // 处理聚焦
  handleFocus = () => {
    this.props.hideAction();
    setTimeout(() => {
      this.setState({ focus: true });
    }, 100);
  };

  // 处理失去焦点
  handleBlur = () => {
    this.setState({ focus: false });
  };

  render() {
    const { value, focus } = this.state;
    const { options } = this.props;
    return (
      <View className='m-ChatBox'>
        <View className='u-voice-icon'>
          <Iconfont type='icon-chat-voice-btn' className='u-voice-icon' />
        </View>
        <Input
          type='text'
          value={value}
          focus={focus}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder='请输入您要咨询的问题'
          className='u-edtior'
          onInput={this.handleInput}
          onConfirm={this.handleConfirm}
          confirmType='send'
          confirmHold
          cursorSpacing={999}
        />
        <View className='u-portrait' onClick={this.handlePortraitClick}>
          <Iconfont type='icon-chat-portraitmobile' color='#666' size='28' />
        </View>
        <View
          className={`u-plus-icon ${options.showFunc ? 'u-show' : ''}`}
          onClick={this.handlePlusClick}
        >
          <Iconfont type='icon-chat-more-plusx' color='#fff' size='22' />
        </View>
      </View>
    );
  }
}

export default ChatBox;
