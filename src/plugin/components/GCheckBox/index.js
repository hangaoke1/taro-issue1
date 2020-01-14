import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import PropTypes from "prop-types";
import classNames from 'classnames';
import Iconfont from "@/components/Iconfont";

import "./index.less";

class GRadio extends Component {
  componentWillMount() {}

  componentDidMount() {}

  handleClick = (option, event) => {
    this.props.onClick(option.value, event)
  }

  render() {
    const { options, value } = this.props;
    const themeColor = "#337EFF";
    return (
      <View className="u-radio">
        {options.map(option => {
          return (
            <View className="u-option" key={option.label} onClick={this.handleClick.bind(this, option)}>
              <View className="u-label">{option.label}</View>
              <View className={
                classNames({
                  'u-icon': true,
                  'u-checked': value.includes(option.value)
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
  value: PropTypes.array,
  options: PropTypes.array,
  onClick: PropTypes.func
};

export default GRadio;
