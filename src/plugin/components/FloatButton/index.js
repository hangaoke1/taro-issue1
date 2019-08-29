import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
import Iconfont from '../Iconfont';

import './index.less';


export default class FloatButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  handleClick = (visible) => {
    this.setState({
      visible: !visible
    })
  }

  render() {
    const { icon, contentWidth, children, entryConfig } = this.props;
    const { visible } = this.state;

    return (
      <View className="m-FloatButton" style={{ right: `${visible ? '0px' : -contentWidth + 'px'}` }}>
        <View className="m-FloatButton_trigger" onClick={this.handleClick.bind(this, visible)}>
          <View className="u-trigger-icon">
            <Iconfont type={icon} color='#337EFF' size='12'></Iconfont>
          </View>
        </View>
        <View className='m-FloatButton_content' style={{ width: contentWidth + 'px' }}>
          <View className="m-FloatButton_action">
            {
              entryConfig.map(item => {
                return (
                  <View className="m-FloatButton_action_item">
                    <View className='m-FloatButton_action_icon'>
                      <Iconfont type={item.icon} color='#666' size='12'></Iconfont>
                    </View>
                    <View className='m-FloatButton_action_text'>{item.text}</View>
                  </View>
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }
}

FloatButton.defaultProps = {
  icon: 'icon-liebiao',
  contentWidth: 80,
  entryConfig: [{
    icon: 'icon-star-linex',
    text: '评价'
  }, {
    icon: 'icon-dropoutx',
    text: '退出'
  }]
}
