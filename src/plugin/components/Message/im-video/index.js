import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { calcMsg, calcTime } from '../../../utils/index';
import eventbus from '../../../lib/eventbus';
import Iconfont from '../../Iconfont';

import './index.less'

const MIN_SIZE = 20;

// const mock = {
//   autoreply: 0,
//   content: JSON.stringify({"ext":"MP4","dur":5238,"size":2500103,"w":360,"show_name":"视频发送于2019-08-14 15:14","expire":1566371662530,"name":"1cd68faa28b18ec1d2d3c7d20c587323.MP4","h":640,"url":"https://nim.nosdn.127.net/NzE4MTkzOTQ=/bmltYV83NzMzMTcxMF8xNTY1NzUwMTc2ODMwXzdmMWE4NzVlLWFiZjItNDY0ZC1iNTA3LTAyZWRlNDNlOWRhOQ==","md5":"1cd68faa28b18ec1d2d3c7d20c587323"}),
//   fromUser: 1,
//   time: "1565752835763",
//   type: "audio"
// }

export default class ImVideo extends Component {

  componentWillMount () { }

  componentDidMount () {}

  handleClick = () => {
    const { item } = this.props;
    const videoInfo = item ? JSON.parse(item.content) : {};
    eventbus.trigger('video_click', videoInfo.url)
  }
 
  render () {
    const {} = this.state;
    const { item } = this.props;
    const videoInfo = item ? JSON.parse(item.content) : {};
    const { w = MIN_SIZE, h = MIN_SIZE, dur = 0 } = videoInfo;
    const { width, height }  = calcMsg(w, h, 140, 140);
  
    return item ? (
      <View className={item.fromUser ? 'm-video m-video-right' : 'm-video m-video-left'}>
        <View>
          <Image
            className='u-avatar'
            src='http://qytest.netease.com/sdk/res/default/robot_portrait.png'
          />
        </View>
        <View className='u-space' />
        <View className='u-content' onClick={this.handleClick}>
          <View
            className='u-video'
            style={`width: ${width}px;height: ${height}px;`}
          >
            <Iconfont type='icon-play-circlex' className='u-play-icon' />
            <View className='u-video-info'>{calcTime(dur)}</View>
          </View>
        </View>
      </View>
    ) : null;
  }
}

ImVideo.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number
}

ImVideo.defaultProps = {
  index: 0
}
