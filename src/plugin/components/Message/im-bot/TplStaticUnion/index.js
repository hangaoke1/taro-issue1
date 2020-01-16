import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Block } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import ParserRichText from '@/components/ParserRichText/parserRichText';
import { sendTemplateText, parseUrlAction } from '@/actions/chat';
import { setClipboardData, showActionTel, showWakeTel } from '@/utils/extendTaro';
import GImg from '@/components/GImg';
import { get } from '@/plugin/global_config';

import './index.less';
@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
class StaticUnion extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };
  
  state = {
    disableList: []
  }

  componentWillMount() {}

  componentDidMount() {}

  handleLinkpress = (event) => {
    const { detail } = event;
    const { transferRgType } = this.props.item;
    parseUrlAction(detail, transferRgType);
  }

  handleLinklongpress = (item) => {
    console.log('aaaaaaaa')
    const { type, target } = item;
    if (type === 'tel') {
      showActionTel(target);
    }
  }

  handleLinkClick = (item) => {
    const { type, target, params, label } = item;
    if (type === 'url') {
      setClipboardData(target);
    }
    if (type === 'tel') {
      showWakeTel(target)
    }
    // TODO: 人工判断
    if (type === 'block') {
      if (this.state.disableList.includes(label)) { return }
      // 判断是否是机器人
      if (!get('isRobot')) {
        this.setState((state) => ({
          disableList: [...state.disableList, label]
        }))
        return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none'})
      }

      sendTemplateText({
        target,
        params,
        label
      })
    }
  }

  previewImage = (url) => {
    Taro.previewImage({
      current: url,
      urls: [url]
    })
  }

  render() {
    // image、text、richText、link
    const { disableList } = this.state;
    const { item, tpl, Setting } = this.props;
    const list = _get(tpl, 'unions', []);
    return item ? (
      <View className="m-static-union">
        {list.map(union => {
          return (
            <Block>
              {
                {
                  'image': <GImg maxWidth={220} src={union.detail.url} onClick={this.previewImage.bind(this, union.detail.url)}></GImg>,
                  'text': <View className="u-text">{union.detail.label}</View>,
                  'richText': <View className="u-richText"><ParserRichText html={union.detail.label} onLinkpress={this.handleLinkpress}></ParserRichText></View>,
                  'link': <View 
                          style={disableList.includes(union.detail.label) ? '' : Setting.themeButton} 
                          className={`u-link ${disableList.includes(union.detail.label)? 'z-disabled' : ''}`}
                          onClick={this.handleLinkClick.bind(this, union.detail)}
                          onLongPress={this.handleLinklongpress.bind(this, union.detail)}>{union.detail.label}</View>
                }[
                  union.type
                ]
              }
            </Block>
          );
        })}
      </View>
    ) : null;
  }
}

export default StaticUnion;
