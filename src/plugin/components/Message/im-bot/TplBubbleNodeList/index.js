import Taro, { useState } from '@tarojs/taro';
import { View, Block } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { get } from '@/plugin/global_config';

import './index.less';

export default function TplBubbleNodeList(props) {
  const [show, setShow] = useState(false);
  const tpl = _get(props, 'item.content.template', {});
  const nodeLen = _get(tpl, 'list.length', 0);
  const nodeList = show
    ? _get(tpl, 'list', [])
    : _get(tpl, 'list', []).slice(0, 4);

  function handleClick() {
    // 判断是否是机器人
    if (!get('isRobot')) {
      return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none'})
    }
    setShow(true);
  }

  return (
    <View className="m-bubble-node">
      {nodeList.length ? (
        <Block>
          <View className="u-label">{_get(tpl, 'label')}</View>
          <View className="u-title">{_get(tpl, 'title.label')}</View>
          <View className="u-list">
          {nodeList.map((node, index) => {
            return (
              <View
                className={`u-list-item ${
                  Number(node.p_is_current) === 1 ? 'z-active' : ''
                }`}
              >
                <View
                  className={`u-p_title ${
                    Number(node.p_is_current) === 1 ? 'z-active' : ''
                  }`}
                >
                  {node.p_title}
                </View>
                <View
                  className={`u-p_desc ${
                    Number(node.p_is_current) === 1 ? 'z-active' : ''
                  }`}
                >
                  {node.p_desc}
                </View>
                {nodeList.length !== index + 1 ? (
                  <View className="u-line"></View>
                ) : null}
                <View className="u-dot"></View>
              </View>
            );
          })}
        </View>
        </Block>
      ) : (
        <View className="u-empty">{_get(tpl, 'empty_list_hint')}</View>
      )}
      {!show && nodeLen > 4 ? (
        <View className="u-action" onClick={handleClick}>
          查看更多
        </View>
      ) : null}
    </View>
  );
}

TplBubbleNodeList.PropTypes = {};
