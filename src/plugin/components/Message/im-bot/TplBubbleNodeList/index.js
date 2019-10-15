import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import './index.less';

export default function TplBubbleNodeList(props) {
  const [show, setShow] = useState(false);
  const tpl = _get(props, 'item.content.template', {});
  const nodeLen = _get(tpl, 'list.length', 0);
  const nodeList = show
    ? _get(tpl, 'list', [])
    : _get(tpl, 'list', []).slice(0, 4);

  function handleClick() {
    setShow(true);
  }

  return (
    <View className="m-bubble-node">
      <View className="u-label">{_get(tpl, 'label')}</View>
      <View className="u-title">{_get(tpl, 'title.label')}</View>
      {nodeList.length ? (
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
