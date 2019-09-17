import Taro, { Component } from '@tarojs/taro';
import { View, CoverView } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { genClassAndStyle } from '@/utils';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';

import FloatLayout from '@/components/FloatLayout';
import MDetailViewList from '@/components/Bot/m-detail-view-list';

import './index.less';

class DetailView extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  state = {
    visible: false
  };

  componentWillMount() {}

  componentDidMount() {}

  handleClose = () => {
    this.setState({ visible: false });
  };

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
      // 底部浮层弹窗
      this.setState({ visible: true });
    }
    if (action.type === 'popup') {
      // TODO: 需要请求数据
      Taro.navigateTo({
        url: `plugin://myPlugin/detailView?uuid=${this.props.item.uuid}`
      });
    }
  };

  render() {
    const { item, tpl } = this.props;
    const { visible } = this.state;
    return item ? (
      <View className="m-detail-view">
        <FloatLayout
          visible={visible}
          maskClosable
          title={tpl.detail.label}
          onClose={this.handleClose}
          bodyPadding={12}
          contentHeight={200}
        >
          <MDetailViewList list={tpl.detail.list}></MDetailViewList>
        </FloatLayout>
        <View className="u-list">
          {tpl.thumbnail.list.map(rows => {
            return (
              <View className="u-list-item-wrap" key={JSON.stringify(rows)}>
                {rows.map(row => {
                  const len = rows.length;
                  const { style, customerClass } = genClassAndStyle(row, len);
                  return (
                    <View
                      className={`u-list-item${customerClass}`}
                      style={style}
                      key={row.value}
                    >
                      {row.type === 'image' ? (
                        <Image
                          className="u-image"
                          style="width: 16px;"
                          mode="widthFix"
                          src={row.value}
                        ></Image>
                      ) : (
                        <Text className="u-text">{row.value}</Text>
                      )}
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
