import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import PropTypes from 'prop-types';

import './index.less'

class GImg extends Component {
  static propTypes = {
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    src: PropTypes.string,
    mode: PropTypes.string,
    lazyLoad: PropTypes.bool,
    onLoad: PropTypes.func
  };

  static defaultProps = {
    mode: 'scaleToFill'
  }

  state = {
    width: 0,
    height: 0
  }

  componentDidMount () { }

  handleLoad (event) {
    const { maxWidth } =  this.props;
    const { width, height } = event.detail;
    const ratio = width / height;
    const calWidth = width < maxWidth ? width : maxWidth;
    const calHeight= calWidth / ratio;
    this.setState({
      width: calWidth,
      height: calHeight
    })
  }

  render () {
    const { src, mode } = this.props;
    const { width, height } = this.state;
    return (
      <Image src={src} mode={mode} onLoad={this.handleLoad} style={`width: ${width}px;height: ${height}px`}>
      </Image>
    )
  }
}

export default GImg