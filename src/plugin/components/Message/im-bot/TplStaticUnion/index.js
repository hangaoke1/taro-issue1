import Taro, { Component } from '@tarojs/taro';
import { View, Block } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import ParserRichText from '@/components/ParserRichText/parserRichText';
import { parseUrlAction } from '@/actions/chat';

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
                  image: <View className="u-img">图片</View>,
                  text: <View className="u-text">普通文本</View>,
                  richText: <View className="u-richText"><ParserRichText html={union.detail.label} onLinkpress={this.handleLinkpress}></ParserRichText></View>,
                  link: <View className="u-link">{union.detail.label}</View>
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
