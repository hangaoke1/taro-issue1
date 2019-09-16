import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { genClassAndStyle } from '@/utils';
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
                {subItem.list.map(rows => {
                  return (
                    <View className="u-list-item-wrap">
                      {rows.map(row => {
                        const len = rows.length;
                        const {style, customerClass} = genClassAndStyle(row, len)
                        
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
