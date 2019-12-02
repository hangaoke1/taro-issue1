import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import ParserRichText from '@/components/ParserRichText/parserRichText';
import './index.less';

export default function TplErrorMsg(props) {
  const label = _get(props, 'tpl.label');
  const { transferRgType } = props.item || {};

  function handleLinkpress(event) {
    const { detail } = event;
    parseUrlAction(detail, transferRgType);
  }

  return (
    <View className="m-error-msg">
      <ParserRichText
        html={label}
        onLinkpress={handleLinkpress}
      ></ParserRichText>
    </View>
  );
}

TplErrorMsg.PropTypes = {};
