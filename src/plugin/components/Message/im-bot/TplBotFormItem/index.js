import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import './index.less';

function byte2kb(size = 0) {
  return Math.ceil(size / 1024);
}

class TplBotFormItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}

  previewImg = (url) => {
    Taro.previewImage({
      current: url,
      urls: [url]
    })
  }

  render() {
    const { tpl } = this.props;
    const forms = _get(tpl, 'forms', []);
    return (
      <View className="m-form-item">
        {forms.map(form => {
          return (
            <View className="u-item">
              <View className="u-label">{form.label}</View>
              {form.type === 'input' && form.value ? <View className="u-input">{form.value}</View> : null}
              {form.type === 'image' && form.value ? (
                <View className="u-img" onClick={this.previewImg.bind(this, form.value.url)}>
                  <View className="u-icon"></View>
                  <View className="u-info">
                    <View className="u-name">file.{form.value.ext}</View>
                    <View className="u-size">{byte2kb(form.value.size)} KB</View>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }
}

export default TplBotFormItem;
