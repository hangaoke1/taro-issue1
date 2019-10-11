import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction'
import { previewFile } from '@/actions/chat';

import Iconfont from '@/components/Iconfont';
import './index.less';

export default function MImg(props) {
  const value = _get(props, 'value');

  function handleUpload() {
    Taro.chooseImage({
      count: 1,
      sourceType: ['album', 'camera']
    }).then(res => {
      previewFile(res.tempFilePaths[0]).then(file => {
        if (_isFunction(props.onAdd)) {
          props.onAdd(file)
        }
      });
    });
  }

  function handleDel () {
    if(_isFunction(props.onDel)) {
      props.onDel('')
    }
  }

  function byte2kb(size = 0) {
    return Math.ceil(size / 1024);
  }

  return (
    <View className="m-img">
      {value ? (
        <View className="u-item">
          <View className="u-icon"></View>
          <View className="u-info">
            <View className="u-name">file.{value.ext}</View>
            <View className="u-size">{byte2kb(value.size)} KB</View>
          </View>
          <View className="u-del" onClick={handleDel}>
            <Iconfont
              type="icon-hints-error"
              className="u-del-icon"
              color="red"
              size="20"
            />
          </View>
        </View>
      ) : (
        <View className="u-action" onClick={handleUpload}>
          上传图片
        </View>
      )}
    </View>
  );
}

MImg.PropTypes = {
  value: PropTypes.object,
  onAdd: PropTypes.func,
  onDel: PropTypes.onDel
};
