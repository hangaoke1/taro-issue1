import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { sendTemplateText } from '@/actions/chat';
import {
  setClipboardData,
  showActionTel,
  showWakeTel
} from '@/utils/extendTaro';

import GImg from '@/components/GImg';

import './index.less';
@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
class ActivePage extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  handleLinklongpress = () => {
    const type = _get(this, 'props.tpl.action.type');
    const target = _get(this, 'props.tpl.action.target');
    if (type === 'tel') {
      showActionTel(target);
    }
  };

  handleActionClick = () => {
    const label = _get(this, 'props.tpl.action.label');
    const params = _get(this, 'props.tpl.action.params');
    const type = _get(this, 'props.tpl.action.type');
    const target = _get(this, 'props.tpl.action.target');
    const url = _get(this, 'props.tpl.action.url');

    // http://jira.netease.com/browse/YSF-30788
    if (type === 'url' || type === 'block') {
      setClipboardData(url);
    }
    if (type === 'tel') {
      showWakeTel(target);
    }
    // if (type === 'block') {
    //   sendTemplateText({
    //     label,
    //     target,
    //     params
    //   })
    // } else {
    //   setClipboardData(url);
    // }
  };

  render() {
    const { item, tpl, Setting } = this.props;
    const prefixCls = 'm-activePage';

    return item ? (
      <View className={prefixCls}>
        {tpl.content ? <View className="u-label">{tpl.content}</View> : null}
        {tpl.img ? (
          <View className="u-img">
            <GImg src={tpl.img} maxWidth={240}></GImg>
          </View>
        ) : null}
        <View
          className="u-action"
          onClick={this.handleActionClick}
          onLongPress={this.handleLinklongpress}
        >
          <View className="u-btn" style={Setting.themeTextButton}>
            {tpl.action.label}
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default ActivePage;
