import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, Text } from '@tarojs/components';
import Avatar from '../u-avatar';
import _get from 'lodash/get';
import './index.less';

const iconMap = {
  audio: 'http://nos.netease.com/ysf/3d58ec398e905d6ab67ae4721e7b1b7c.png',
  excel: 'http://nos.netease.com/ysf/4081417037318bde5264012de94dfa16.png',
  image: 'http://nos.netease.com/ysf/f9fcc0433ac0aec91a95655c77ea2741.png',
  keynote: 'http://nos.netease.com/ysf/f83d94e12b75d16a4115185f6c587d93.png',
  pdf: 'http://nos.netease.com/ysf/8a7d079c602c385a5ce5bd99c0e966cd.png',
  ppt: 'http://nos.netease.com/ysf/c3cf42370fd84525f5f949fb0befa16c.png',
  txt: 'http://nos.netease.com/ysf/cf857c3bacd1015ea598c793b0bf660e.png',
  video: 'http://nos.netease.com/ysf/a75dcdb375f0484abb390c70dbdc9412.png',
  word: 'http://nos.netease.com/ysf/c17b2fcce8cae902925f04faa2533678.png',
  zip: 'http://nos.netease.com/ysf/9ce7e284b44005e8fb6e43a147dbb2ba.png',
  other: 'http://nos.netease.com/ysf/9985883c55944ab74ef240497e309e4e.png'
}

@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
class ImFile extends Component {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    const { item, Setting } = this.props;
    const themeColor = item && item.fromUser ? _get(Setting, 'setting.dialogColor') : '';
    const ext = _get(item, 'content.ext');
    let icon = iconMap.other;
    
    if (['gif', 'png', 'jpg', 'jpeg'].includes(ext)) {
      icon = iconMap.image
    }
    if (['mp3']) {}

    return item ? (
      <View
        className={
          item.fromUser ? 'm-file m-file-right' : 'm-file m-file-left'
        }
      >
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className='u-text-arrow' style={`${item.fromUser ? 'border-left-color: ' + themeColor : ''}`} />
        <View className='u-text' style={`${item.fromUser ? 'background-color: ' + themeColor : ''}`} onClick={this.handleClick}>
          <View className='u-info'>
            <View className='u-left'>
              <View className="u-left-top">开发规范.md</View>
              <View className="u-left-bottom">
                <Text>6.4kb</Text>
                <Text>未下载</Text>
              </View>
            </View>
            <Image className='u-icon' src={icon}></Image>
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default ImFile;
