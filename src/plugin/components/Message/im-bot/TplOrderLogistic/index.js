import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import { setClipboardData } from '@/utils/extendTaro';

import './index.less';

class OrderLogistic extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  // 查看完整物流
  handleMoreClick = () => {
    const url = _get(this, 'props.tpl.action.target', '');
    if (url) {
      setClipboardData(url);
    }
  };

  render() {
    const { item, tpl } = this.props;
    const list = _get(tpl, 'list', []);
    return item ? (
      <View className="m-order-logistic">
        <View className="u-label">{tpl.label}</View>
        <View className="u-title">{tpl.title.label}</View>
        <View className="u-list">
          {list.map((node, index) => {
            return (
              <View className={`u-list-item ${index === 0 ? 'z-active' : ''}`}>
                <View className="u-logistic">{node.logistic}</View>
                <View className="u-timestamp">{node.timestamp}</View>
                {list.length !== index + 1 ? (
                  <View className="u-line"></View>
                ) : null}
                <View className="u-dot"></View>
              </View>
            );
          })}
        </View>
        {tpl.action ? (
          <View className="u-action" onClick={this.handleMoreClick}>
            {tpl.action.p_name}
          </View>
        ) : null}
      </View>
    ) : null;
  }
}

export default OrderLogistic;