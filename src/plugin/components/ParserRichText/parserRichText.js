import Taro from '@tarojs/taro';

import './parserRichText.less';

/**
 * ParserRichText 富文本组件
 */
class ParserRichText extends Taro.Component {

  config = {
    usingComponents: {
      parser: './Parser/index'
    }
  };

  render() {
    const {
      html,
      autocopy,
      autopause,
      autosetTitle,
      selectable,
      tagStyle,
      imgMode,
      showWithAnimation,
      animationDuration
    } = this.props;
    return (
      <parser
        html={html}
        autocopy={autocopy}
        autopause={autopause}
        autosetTitle={autosetTitle}
        selectable={selectable}
        tag-style={tagStyle}
        img-mode={imgMode}
        show-with-animation={showWithAnimation}
        animation-duration={animationDuration}
      />
    );
  }
}

ParserRichText.defaultProps = {
  html: [],
  autocopy: true,
  autopause: true,
  autosetTitle: true,
  showWithAnimation: false,
  animationDuration: 400,
  selectable: false,
  tagStyle: {},
  imgMode: 'aspectFit'
}

export default ParserRichText;
