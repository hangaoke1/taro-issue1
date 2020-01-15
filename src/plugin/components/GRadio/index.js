import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from '@tarojs/redux';
import PropTypes from "prop-types";
import classNames from 'classnames';
import Iconfont from "@/components/Iconfont";

import "./index.less";

@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
class GRadio extends Component {
  componentWillMount() {}

  componentDidMount() {}

  handleClick = (option, event) => {
    this.props.onClick(option.value, event)
  }

  render() {
    const { options, value, Setting } = this.props;
    const themeColor = Setting.themeColor;
    return (
      <View className="u-radio">
        {options.map(option => {
          return (
            <View className="u-option" key={option.label} onClick={this.handleClick.bind(this, option)}>
              <View className="u-label">{option.label}</View>
              <View className={
                classNames({
                  'u-icon': true,
                  'u-checked': option.value === value
                })
              }
              >
                <Iconfont type="icon-correct" color={themeColor} size={24}></Iconfont>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

GRadio.defaultProps = {
  options: []
};

GRadio.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.string,
  options: PropTypes.array,
  onClick: PropTypes.func
};

export default GRadio;
