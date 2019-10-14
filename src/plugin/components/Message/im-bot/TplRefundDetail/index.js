import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import Iconfont from '@/components/Iconfont';

import './index.less';

class RefundDetail extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  render() {
    const { item, tpl } = this.props;
    const list = _get(tpl, 'list', []);
    const name = _get(tpl, 'state.name');
    const type = _get(tpl, 'state.type');
    return item ? (
      <View className="m-refund-detail">
        <View className="u-label">{tpl.label}</View>
        <View className="u-content">
          <View
            className="u-state"
            style={type === 'success' ? `color: #23b566` : `color: #f0404d`}
          >
            <Iconfont
              type={
                type === 'success'
                  ? `icon-hints-success-o`
                  : `icon-kfzt-xx-qtx`
              }
              size="16"
              color={type === 'success' ? `#23b566` : `#f0404d`}
            ></Iconfont>
            <Text className="u-state-text">{name}</Text>
          </View>
          <View className="u-list">
            {list.map(msg => {
              return <View className="u-list-item">{msg}</View>;
            })}
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default RefundDetail;
