import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, Text } from '@tarojs/components';
import Avatar from '../u-avatar';
import _get from 'lodash/get';
import extIconMap from '@/plugin/constants/extIcon';
import { size2String } from '@/utils/index';
import './index.less';

@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
class ImFile extends Component {
  componentWillMount() {}

  componentDidMount() {}

  handleClick = () => {
    Taro.navigateTo({
      url: `plugin://myPlugin/filePreview?uuid=${this.props.item.uuid}`
    });
  }

  render() {
    const { item, Setting } = this.props;
    const themeColor = item && item.fromUser ? _get(Setting, 'themeColor') : '';
    const size = _get(item, 'content.size') || 0;
    const name = _get(item, 'content.name') || '';
    const nameArr = name.split('.');
    const ext = (nameArr[nameArr.length - 1] || '').toLocaleLowerCase();
    const icon = extIconMap[ext] || extIconMap.other;

    return item ? (
      <View
        className={
          item.fromUser ? 'm-file m-file-right' : 'm-file m-file-left'
        }
      >
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className='u-text-arrow' style={`${item.fromUser ? 'border-left-color: ' + themeColor : ''}`} />
        <View className='u-text' style={`${item.fromUser ? 'background-color: ' + themeColor : ''}`}>
          <View className='u-info' onClick={this.handleClick}>
            <View className='u-left'>
              <View className="u-left-top">{name}</View>
              <View className="u-left-bottom">
                <Text className="u-size">{size2String(size)}</Text>
                <Text className="u-status">{item.content.tempFilePath ? '已下载' : '未下载'}</Text>
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
