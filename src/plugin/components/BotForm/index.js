import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import FloatLayout from '@/components/FloatLayout';
import eventbus from '@/lib/eventbus';
import { sendBotForm, changeMessageByUUID } from '@/actions/chat';

import MImg from './m-img'

import './index.less';

@connect(
  ({ Message, Setting }) => ({
    Message,
    Setting
  }),
  dispatch => ({
    changeMessageByUUID(newMessage) {
      dispatch(changeMessageByUUID(newMessage));
    }
  })
)
export default class BotForm extends Component {
  static propTypes = {};

  static defaultProps = {};

  state = {
    uuid: '',
    visible: false,
    forms: [],
    errors: {}
  };

  componentDidMount() {
    eventbus.on('bot_show_bot_form', uuid => {
      eventbus.trigger('hide_keyboard');

      setTimeout(() => {
        if (this.state.uuid === uuid) {
          this.setState({ visible: true });
          return;
        }
        const { Message } = this.props;
        const message = Message.filter(item => item.uuid === uuid)[0];
        const forms = _get(message, 'content.template.forms', []);
        forms.forEach(form => (form.value = ''));
        this.setState({ uuid, visible: true, forms, message }, () => {});
      }, 600)
    });
    eventbus.on('bot_close_bot_form', () => {
      this.handleClose();
    });
  }

  handleClose = () => {
    this.setState({
      visible: false
    });
  };

  handleChange = (index, event) => {
    this.setState({
      forms: this.state.forms.map((item, subIndex) => {
        if (index === subIndex) {
          item.value = event.target.value;
        }
        return item;
      })
    });
  };

  handleImgChange = (index, file) => {
    this.setState({
      forms: this.state.forms.map((item, subIndex) => {
        if (index === subIndex) {
          item.value = file;
        }
        return item;
      })
    });
  }

  validate = () => {
    const errors = {}
    let hasError = false;
    this.state.forms.forEach(form => {
      if (+form.required === 1 && !form.value) {
        errors[form.id] = true
        hasError = true
      }
    })
    this.setState({
      errors
    })
    return hasError
  }

  // 表单提交
  handleSubmit = () => {
    const hasError = this.validate();
    if (hasError) { console.warn('表单验证失败'); return; }

    sendBotForm(this.state.forms, this.state.message).then(res => {
      let newMessage = _cloneDeep(this.state.message);
      newMessage.content.template.submitted = 1;
      this.props.changeMessageByUUID(newMessage);
      this.setState({
        visible: false
      })
    });
  };

  render() {
    const { Setting } = this.props;
    const { visible, forms, message } = this.state;
    const tpl = _get(message, 'content.template', {});
    return message ? (
      <FloatLayout
        visible={visible}
        maskClosable
        title="填写信息"
        bodyPadding={0}
        onClose={this.handleClose}
      >
        <View className="m-form">
          <View className="u-label">{tpl.label}</View>
          <View className="u-form">
            {forms.map((form, index) => {
              return (
                <View className="u-form-item" key={form.id}>
                  <View
                    className={`u-form-label`}
                  >
                    {form.label}  {Number(form.required) === 1?<Text className="z-required">*</Text>:null}
                  </View>
                  <View className="u-form-content">
                    { 
                      {
                      'input': <Input
                                className="u-form-input"
                                placeholder="请输入内容"
                                value={form.value}
                                onChange={this.handleChange.bind(this, index)}
                              ></Input>,
                      'image': <MImg value={form.value} onAdd={this.handleImgChange.bind(this, index)} onDel={this.handleImgChange.bind(this, index)}></MImg>
                    }[form.type] }
                    { errors[form.id] ? <View className="u-form-input__error">该选项必填</View> : null }
                  </View>
                </View>
              );
            })}
          </View>
          <Button className="u-submit" onClick={this.handleSubmit} style={Setting.themeButton}>
            提交
          </Button>
        </View>
      </FloatLayout>
    ) : null;
  }
}
