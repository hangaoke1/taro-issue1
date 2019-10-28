import Taro from '@tarojs/taro';
import { filterHtml, text2emoji } from '../../utils';
import { unescape } from '../../utils/xss';
import './parserRichText.less';

/**
 * ParserRichText 富文本组件
 * cover from https://github.com/jin-yufeng/Parser
 */
class ParserRichText extends Taro.Component {
  config = {
    usingComponents: {
      parser: './Parser/index'
    }
  };

  handleLinkpress = event => {
    let url = unescape(event.detail)
    if (this.props.autocopy && event.detail) {
      if (url !== 'qiyu://action.qiyukf.com?command=applyHumanStaff') {
        wx.setClipboardData({
          data: url,
          success() {
            wx.showToast({
              title: '链接已复制',
            })
          }
        })
      }
    }
    this.props.onLinkpress && this.props.onLinkpress({ type: event.type, detail: url });
  };

  handleError = error => {
    console.log('error:', error)
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
      isRich,
      customerTagStyle
    } = this.props;

    if (!isRich) {
      html = filterHtml(html);
    }

    html = text2emoji(html);

    const style = Object.assign({}, tagStyle, customerTagStyle)

    return (
      <parser
        html={html}
        autocopy={autocopy}
        autopause={autopause}
        autosetTitle={autosetTitle}
        selectable={selectable}
        tag-style={style}
        img-mode={imgMode}
        show-with-animation={showWithAnimation}
        animation-duration={animationDuration}
        onLinkpress={this.handleLinkpress}
        onError={this.handleError}
      />
    )
  }
}

ParserRichText.defaultProps = {
  html: '',
  autocopy: true,
  autopause: true,
  autosetTitle: true,
  showWithAnimation: false,
  animationDuration: 400,
  selectable: true,
  tagStyle: {
    img: 'width: auto; height: auto;max-width: 100%;',
    video: 'width: auto; height: auto;max-width: 100%;max-height: 500px;'
  },
  customerTagStyle: {},
  imgMode: 'aspectFit',
  isRich: true
};

export default ParserRichText;
