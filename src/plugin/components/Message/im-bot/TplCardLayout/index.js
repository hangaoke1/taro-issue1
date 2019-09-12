import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { valueAtBit } from '@/utils';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';

import './index.less';

class CardLayout extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  handleCardClick = (action) => {
    if (action.type === 'url') {
      setClipboardData(action.target);
    }
    if (action.type === 'block') {
      sendTemplateText({
        label: action.label,
        target: action.target,
        params: action.params
      })
    }
    if (action.type === 'popup') {
      // TODO:
    }
    if (action.type === 'float') {
      // TODO:
    }
  }

  handleActionClick = () => {
    const action = _get(this, 'props.tpl.action', {});
    if (action.type === 'url') {
      setClipboardData(action.target);
    }
    if (action.type === 'block') {
      sendTemplateText({
        label: action.label,
        target: action.target,
        params: action.params
      })
    }
    if (action.type === 'popup') {
      // TODO:
    }
    if (action.type === 'float') {
      // TODO:
    }
  }

  render() {
    const { item, tpl } = this.props;

    return item ? (
      <View className="m-card-layout">
        <View className="u-label">{tpl.label}</View>
        <View className="u-list">
          {tpl.list.map(subItem => {
            return (
              <View>
                {subItem.list.map(itemList => {
                  return (
                    <View className="u-list-item-wrap">
                      {itemList.map(row => {
                        const width = 100 / (itemList.length || 1);
                        const bit1 = valueAtBit(+row.flag); // 粗体
                        const bit2 = valueAtBit(+row.flag); // 斜体
                        const bit3 = valueAtBit(+row.flag); // 下划线
                        const bit4 = valueAtBit(+row.flag); // 文本类型 0: 多行文本 1: 单行超出隐藏
                        const style = `width: ${width}%;text-align: ${row.align};color: ${row.color}`;
                        let customerClass = ''
                        if (bit1) { customerClass += ' z-bold' }
                        if (bit2) { customerClass += ' z-italic' }
                        if (bit3) { customerClass += ' z-underline' }
                        if (bit4) { customerClass += ' z-ellipsis' }
                        if (row.type === 'image') {
                          return (
                            <View className={`u-list-item${customerClass}`} style={style}>
                              <Image
                                className="u-image"
                                style="width: 16px;"
                                mode="widthFix"
                                src={row.value}
                              ></Image>
                            </View>
                          );
                        }
                        return (
                          <View className={`u-list-item${customerClass}`} style={style}>
                            <Text className="u-text">{row.value}</Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View className="u-action" onClick={this.handleActionClick}>{tpl.action.label}</View>
      </View>
    ) : null;
  }
}

export default CardLayout;
