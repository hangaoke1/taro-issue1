import Taro, { Component } from '@tarojs/taro';
import { View, Block } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import ParserRichText from '@/components/ParserRichText/parserRichText';
import { sendTemplateText, parseUrlAction } from '@/actions/chat';
import { setClipboardData } from '@/utils/extendTaro';
import GImg from '@/components/GImg';

import './index.less';

class StaticUnion extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  handleLinkpress = (event) => {
    const { detail } = event;
    parseUrlAction(detail);
  }

  handleLinkClick = (item) => {
    const { type, target, params, label } = item;
    if (type === 'url') {
      setClipboardData(target);
    }
    if (type === 'block') {
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
    const { item, tpl } = this.props;
    const list = _get(tpl, 'unions', []);
    return item ? (
      <View className="m-static-union">
        {list.map(union => {
          return (
            <Block>
              {
                {
                  image: <GImg maxWidth={220} src={union.detail.url} onClick={this.previewImage.bind(this, union.detail.url)}></GImg>,
                  text: <View className="u-text">{union.detail.label}</View>,
                  richText: <View className="u-richText"><ParserRichText html={union.detail.label} onLinkpress={this.handleLinkpress}></ParserRichText></View>,
                  link: <View className="u-link" onClick={this.handleLinkClick.bind(this, union.detail)}>{union.detail.label}</View>
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
