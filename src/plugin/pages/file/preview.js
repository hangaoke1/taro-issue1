import Taro, { Component } from '@tarojs/taro';
import { View, Block, Video, Audio, Progress } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import eventbus from '@/lib/eventbus';
import { changeMessageByUUID } from '@/plugin//actions/chat';
import extIconMap from '@/plugin/constants/extIcon';
import { setClipboardData } from '@/utils/extendTaro';
import { size2String } from '@/utils/index';
import { get } from '@/plugin/global_config';
import './preview.less';

import GImg from '@/components/GImg';
import GAudio from '@/components/GAudio';
import Iconfont from '@/components/Iconfont';

@connect(
  ({ Message }) => ({
    Message
  }),
  dispatch => ({
    updateMessage(newMessage) {
      dispatch(changeMessageByUUID(newMessage));
    }
  })
)
class FilePreview extends Component {
  config = {
    navigationBarTitleText: '文件预览'
  };

  state = {
    item: null,
    progress: 0,
    totalBytesWritten: 0,
    totalBytesExpectedToWrite: 0,
    download: false,
    custom: false // 用户是否有自定义处理函数
  };

  componentWillMount() {
    const uuid = this.$router.params.uuid;
    const item = this.props.Message.filter(message => message.uuid === uuid)[0];
    this.setState({
      item,
      custom: get('file_open_action')
    });
  }

  componentDidMount() {}

  handleCopy = () => {
    const message = _cloneDeep(this.state.item);
    const url = _get(message, 'content.url');
    setClipboardData(url);
  };

  handleAbort = () => {
    console.log('取消下载');
    this.downloadTask && this.downloadTask.abort();
  };

  handleClick = () => {
    const vm = this;
    const message = _cloneDeep(this.state.item);
    const url = _get(message, 'content.url');
    const tempFilePath = _get(message, 'content.tempFilePath');
    if (tempFilePath) {
      /**
       * 插件不支持直接调用openDocument，文件转发给插件调用方
       * 1. 修改消息
       * 2. 发送文件打开事件
       */
      eventbus.trigger('file_open_action', _cloneDeep(message.content));
    } else {
      this.downloadTask = Taro.downloadFile({
        url: url,
        success: function(res) {
          const filePath = res.tempFilePath;
          message.content.tempFilePath = filePath;
          vm.props.updateMessage(message);
          vm.setState({
            item: message
          });
        },
        complete: () => {
          this.setState({
            download: false
          });
        }
      });
      this.downloadTask.progress(res => {
        this.setState({
          progress: res.progress,
          totalBytesWritten: res.totalBytesWritten,
          totalBytesExpectedToWrite: res.totalBytesExpectedToWrite,
          download: true
        });
      });
    }
  };

  handleImgClick = url => {
    Taro.previewImage({
      current: url,
      urls: [url]
    });
  };

  render() {
    const {
      item,
      progress,
      totalBytesWritten,
      totalBytesExpectedToWrite,
      download,
      custom
    } = this.state;
    const size = _get(item, 'content.size') || 0;
    const name = _get(item, 'content.name') || '';
    const nameArr = name.split('.');
    const ext = (nameArr[nameArr.length - 1] || '').toLocaleLowerCase();
    const tempFilePath = _get(item, 'content.tempFilePath');
    const icon = extIconMap[ext] || extIconMap.other;
    let type = 'other';
    // 图片
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      type = 'image';
    }
    // 音频
    if (['wav', 'mp3', 'aac'].includes(ext)) {
      type = 'audio';
    }
    // 视频
    if (['mp4', '3gp'].includes(ext)) {
      type = 'video';
    }

    let layout = null;
    if (download) {
      layout = (
        <Block>
          <View className="u-progress-info">
            正在下载...（{size2String(totalBytesWritten)}/
            {size2String(totalBytesExpectedToWrite)}）
          </View>
          <View className="u-progress">
            <Progress className="u-progress-bar" percent={progress}></Progress>
            <View className="u-progress-cancel" onClick={this.handleAbort}>
              <Iconfont
                type="icon-hints-error"
                color="#fb4050"
                size="20"
              ></Iconfont>
            </View>
          </View>
        </Block>
      );
    } else {
      layout = (
        <Block>
          <View className="u-size">文件大小：{size2String(size)}</View>
          { !tempFilePath ? <Button type="primary" className="u-action" onClick={this.handleClick}>点击下载</Button> : ''}
          { tempFilePath && custom ? <Button type="primary" className="u-action" onClick={this.handleClick}>打开文件</Button> : ''}
        </Block>
      );
    }

    return item ? (
      <View className="m-file-preview">
        {tempFilePath && type === 'image' ? (
          <View className="u-wrap">
            <GImg
              maxWidth={375}
              src={tempFilePath}
              onClick={this.handleImgClick.bind(this, tempFilePath)}
            ></GImg>
          </View>
        ) : (
          ''
        )}
        {tempFilePath && type === 'audio' ? (
          <View className="u-wrap">
            <GAudio src={tempFilePath} name={name}></GAudio>
          </View>
        ) : (
          ''
        )}
        {tempFilePath && type === 'video' ? (
          <View className="u-wrap">
            <Video src={tempFilePath}></Video>
          </View>
        ) : (
          ''
        )}

        {!tempFilePath || type === 'other' ? (
          <Block>
            <Image className="u-icon" src={icon}></Image>
            <View className="u-name">{name}</View>
            { layout }
          </Block>
        ) : (
          ''
        )}

        <Button
          type="primary"
          className="u-action"
          plain
          onClick={this.handleCopy}
        >
          复制下载链接
        </Button>
      </View>
    ) : null;
  }
}

export default FilePreview;
