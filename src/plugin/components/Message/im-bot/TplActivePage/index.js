import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { setClipboardData } from '@/utils/extendTaro';

import GImg from '@/components/GImg';

import './index.less';

class ActivePage extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  handleActionClick = () => {
    setClipboardData(_get(this, 'props.tpl.action.url'));
  };

  render() {
    const { item, tpl } = this.props;
    const prefixCls = 'm-activePage';

    return item ? (
      <View className={prefixCls}>
        {tpl.content ? <View className="u-label">{tpl.content}</View> : null}
        {tpl.img ? (
          <View className="u-img">
            <GImg src={tpl.img} maxWidth={240}></GImg>
          </View>
        ) : null}
        <View className="u-action" onClick={this.handleActionClick}>
          <View className="u-btn">{tpl.action.label}</View>
        </View>
      </View>
    ) : null;
  }
}

export default ActivePage;
