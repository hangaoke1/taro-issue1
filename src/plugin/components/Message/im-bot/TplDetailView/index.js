import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { genClassAndStyle } from '@/utils';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';

import './index.less';

class DetailView extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  handleActionClick = action => {
    if (action.type === 'url') {
      setClipboardData(action.target);
    }
    if (action.type === 'block') {
      sendTemplateText({
        label: action.label,
        target: action.target,
        params: action.params
      });
    }
    if (action.type === 'float') {
      Taro.navigateTo({
        url: `plugin://myPlugin/detailView?uuid=${this.props.item.uuid}`
      });
    }
  };

  render() {
    const { item, tpl } = this.props;
    return item ? (
      <View className="m-detail-view">
        <View className="u-list">
          {tpl.thumbnail.list.map(rows => {
            return (
              <View className="u-list-item-wrap">
                {rows.map(row => {
                  const len = rows.length;
                  const {style, customerClass} = genClassAndStyle(row, len);
                  if (row.type === 'image') {
                    return (
                      <View
                        className={`u-list-item${customerClass}`}
                        style={style}
                        key={row.value}
                      >
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
                    <View
                      className={`u-list-item${customerClass}`}
                      style={style}
                      key={row.value}
                    >
                      <Text className="u-text">{row.value}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
        {tpl.thumbnail.action ? (
          <View
            className="u-action"
            onClick={this.handleActionClick.bind(this, tpl.thumbnail.action)}
          >
            {tpl.thumbnail.action.label}
          </View>
        ) : null}
      </View>
    ) : null;
  }
}

export default DetailView;
