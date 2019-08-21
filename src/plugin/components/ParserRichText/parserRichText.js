import Taro from '@tarojs/taro';
import { escape, text2emoji } from '../../utils';

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

  handleLinkpress = (event) => {
    this.props.onLinkpress && this.props.onLinkpress(event);
  }

  render() {
    let {
      html,
      autocopy,
      autopause,
      autosetTitle,
      selectable,
      tagStyle,
      imgMode,
      showWithAnimation,
      animationDuration,
      isRich
    } = this.props;
    
    if (!isRich) {
      html = escape(html);
    }

    html = text2emoji(html);

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
        onLinkpress={this.handleLinkpress}
      />
    );
  }
}

ParserRichText.defaultProps = {
  html: '',
  autocopy: true,
  autopause: true,
  autosetTitle: true,
  showWithAnimation: false,
  animationDuration: 400,
  selectable: false,
  tagStyle: { img: 'width: auto; height: auto;max-width: 220px;max-height: 400px;'},
  imgMode: 'aspectFit',
  isRich: true
}

export default ParserRichText;
