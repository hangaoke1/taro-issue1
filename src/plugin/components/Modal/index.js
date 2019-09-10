import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isFunction from 'lodash/isFunction';
import Iconfont from '../Iconfont';

import './index.less';

export default class WeModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    isOpened: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
    content: PropTypes.string,
    closeOnClickOverlay: PropTypes.bool,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string
  }

  static defaultProps = {
    isOpened: false
  }

  constructor(props) {
    super(...arguments);

    const { isOpened } = props;
    this.state = {
      _isOpened: isOpened
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { isOpened } = nextProps;

    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened
      });
    }
  }

  handleClickOverlay = () => {
    if (this.props.closeOnClickOverlay) {
      this.setState(
        {
          _isOpened: false
        },
        this.handleClose
      );
    }
  }

  handleClose = () => {
    if (_isFunction(this.props.onClose)) {
      this.props.onClose();
    }
  }

  handleCancel = () => {
    if (_isFunction(this.props.onCancel)) {
      this.props.onCancel()
    }
  }

  handleConfirm = () => {
    if (_isFunction(this.props.onConfirm)) {
      this.props.onConfirm()
    }
  }

  render() {
    const { _isOpened } = this.state;
    const { title, cancelText, confirmText } = this.props;
    const showFooter = cancelText || confirmText

    const rootClass = classNames(
      'we-modal',
      {
        'we-modal--active': _isOpened
      },
      this.props.className
    );

    let btnCount = 0;
    if (cancelText || confirmText) { btnCount = 1 }
    if (cancelText && confirmText) { btnCount = 2 }

    return (
      <View className={rootClass}>
        <View className="we-modal__overlay" onClick={this.handleClickOverlay} />
        <View className="we-modal__container">
          {title ? (
            <View className="we-modal__title">
              <Text>{title}</Text>
              <View className="we-modal__close" onClick={this.handleClose}>
                <Iconfont type='icon-close' color='#666' size='36'></Iconfont>
              </View>
            </View>
          ) : null}
          <View className="we-modal__content">{this.props.children}</View>
          { showFooter ? <View className="we-modal__footer">
            {cancelText ? <View className={`we-modal__cancel ${btnCount === 1 ? 'we-modal__large' : ''}`} onClick={this.handleCancel}>{cancelText}</View> : null}
            {confirmText ? <View className={`we-modal__confirm ${btnCount === 1 ? 'we-modal__large' : ''}`} onClick={this.handleConfirm}>{confirmText}</View> : null}
          </View>:null }
        </View>
      </View>
    );
  }
}
