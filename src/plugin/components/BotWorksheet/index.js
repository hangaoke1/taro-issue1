import Taro, { Component } from "@tarojs/taro";
import { View, Image, Block } from "@tarojs/components";
import { connect } from '@tarojs/redux';
import FloatLayout from "@/components/FloatLayout";
import Iconfont from "@/components/Iconfont";
import { previewFile, sendWorksheet } from "@/actions/chat";
import GImg from "@/components/GImg";
import GRadio from "@/components/GRadio";
import GCheckBox from "@/components/GCheckBox";
import eventbus from '@/lib/eventbus';
import _get from 'lodash/get';

import "./index.less";

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
class BotWorksheet extends Component {
  state = {
    visible: false,
    previewIndex: -1,
    windowHeight: wx.getSystemInfoSync()["windowHeight"],
    forms: [],
    files: []
  };

  componentWillMount() {}

  componentDidMount() {
    eventbus.on('bot_show_auto_worksheet', uuid => {
      eventbus.trigger('hide_keyboard');

      setTimeout(() => {
        if (this.state.uuid === uuid) {
          this.setState({ visible: true });
          return;
        }
        const { Message } = this.props;
        const message = Message.filter(item => item.uuid === uuid)[0];
        const forms = _get(message, 'content.template.forms', []);
        // 0-文本输入 1-单选 2-多选,3-附件,
        forms.forEach(form => {
          if (form.type === '0') {
            form.value = form.prefill || ''
          }
          if (form.type === '1') {
            form.value = form.prefill || ''
          }
          if (form.type === '2') {
            form.value = form.prefill ? form.prefill.split(';') : []
          }
          if (form.type === '3') {
            form.value = []
          }
        });
        this.setState({ uuid, visible: true, forms, message, files: [], previewIndex: -1 });
      }, 300)
    })
  }

  handleClose = () => {
    this.setState({
      visible: false
    });
  };

  // 选择上传
  handleChoose = () => {
    Taro.showActionSheet({
      itemList: ["上传图片", "上传视频"],
      success: res => {
        if (res.tapIndex === 0) {
          Taro.chooseImage({
            sourceType: ["album"],
            count: 1
          })
            .then(res => {
              previewFile(res.tempFilePaths[0]).then(file => {
                this.setState(state => {
                  return {
                    files: [...state.files, file]
                  };
                });
              });
            })
            .catch(err => {});
        }
        if (res.tapIndex === 1) {
          Taro.chooseVideo({
            sourceType: ["album"]
          })
            .then(res => {
              previewFile(res.tempFilePath, "video").then(file => {
                this.setState(state => {
                  return {
                    files: [...state.files, file]
                  };
                });
              });
            })
            .catch(err => {});
        }
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  };

  clickFile = index => {
    this.setState({
      previewIndex: index
    });
  };

  // 关闭预览
  closePreview = () => {
    this.setState({
      previewIndex: -1
    });
  };

  // 删除文件
  deleteFile = () => {
    const index = this.state.previewIndex;
    this.setState(state => {
      return {
        files: [
          ...state.files.slice(0, index),
          ...state.files.slice(index + 1)
        ],
        previewIndex: -1
      };
    });
  };

  showChoose = index => {
    this.setState({
      forms: this.state.forms.map((item, subIndex) => {
        if (index === subIndex) {
          item.show = true;
        }
        return item;
      })
    });
  };

  handleChooseClose = index => {
    this.setState({
      forms: this.state.forms.map((item, subIndex) => {
        if (index === subIndex) {
          item.show = false;
        }
        return item;
      })
    });
  };

  handleInputChange = (index, event) => {
    this.setState({
      forms: this.state.forms.map((item, subIndex) => {
        if (index === subIndex) {
          item.value = event.target.value;
        }
        return item;
      })
    });
  };

  handleSingleChange = (index, value) => {
    this.setState({
      forms: this.state.forms.map((item, subIndex) => {
        if (index === subIndex) {
          item.value = value;
        }
        return item;
      })
    });
  };

  handleMultiChange = (index, value) => {
    this.setState({
      forms: this.state.forms.map((item, subIndex) => {
        if (index === subIndex) {
          // 如果没有则push，反之删除
          if (item.value.includes(value)) {
            item.value = item.value.filter(v => v !== value);
          } else {
            item.value = [...item.value, value];
          }
        }
        return item;
      })
    });
  };

  checkForm = (forms, cb) => {
    for (let i = 0; i < forms.length; i++) {
      let { label, required, value, id } = forms[i]
      if (id === 'uploadFile') {
        label = label || '附件'
        value = this.state.files
      } else {
        label = label || '选项'
      }
      // 必须填写
      if (required === '1') {
        // 如果是数组
        if (Array.isArray(value)) {
          if (value.length === 0) { return cb(label + '未填') }
        } else {
          if (!value) { return cb(label + '未填') }
        }
      }
    }
    return cb('')
  }

  handleSubmit = () => {
    // TODO: 表单校验
    console.log(this.state.forms);
    this.checkForm(this.state.forms, error => {
      if (error) {
        console.log('>>> 表单验证失败', error)
        Taro.showToast({
          title: error,
          icon: 'none'
        })
      } else {
        // 参数拼接，表单提交
        let forms = this.state.forms.map(form => {
          if (form.id === 'uploadFile') {
            return {
              key: form.id,
              label: form.label,
              value: this.state.files.map((item, index) => {
                return {
                  name: '附件_' + (index + 1) + '.' + item.ext,
                  url: item.url,
                  size: item.size
                }
              })
            }
          } else {
            return {
              key: form.id,
              label: form.label,
              value: form.type === '2' ? form.value.join(';') : form.value
            }
          }
        })
        console.log('>>> 表单提交', forms)
        sendWorksheet(forms, this.state.message).then(res => {
          this.setState({
            visible: false
          })
        })
      }
    })
  };

  render() {
    const { visible, previewIndex, files, windowHeight, forms } = this.state;
    const currentFile = files[previewIndex];
    return (
      <View>
        <FloatLayout
          visible={visible}
          maskClosable
          title="填写信息"
          bodyPadding={0}
          onClose={this.handleClose}
        >
          <View className="u-form-wrap">
            <View className="u-form">
              <View className="u-title">
                尊敬的客户，当前为非工作时间，有问题请留言。
              </View>

              {forms.map((form, index) => {
                let layout = null
                if (form.type === "0") {
                  layout = (
                    <View key={form.id}>
                      <View className="u-label">
                        {form.label}
                        {form.required === "1" ? "(必填)" : ""}
                      </View>
                      <Input
                        value={form.value}
                        className="u-input"
                        placeholder={form.hint}
                        placeholder-style="color: #ccc"
                        onChange={this.handleInputChange.bind(this, index)}
                      />
                    </View>
                  );
                }
                if (form.type === "1") {
                  layout = (
                    <View key={form.id}>
                      <View className="u-label">
                        {form.label}
                        {form.required === "1" ? "(必填)" : ""}
                      </View>
                      <View className="u-select">
                        <Input
                          onClick={this.showChoose.bind(this, index)}
                          value={form.value}
                          disabled
                          className="u-input"
                          placeholder={form.hint}
                          placeholder-style="color: #ccc"
                        />
                        <View className="u-arrow">
                          <Iconfont type="icon-arrowright" size="23"></Iconfont>
                        </View>
                      </View>
                    </View>
                  );
                }
                if (form.type === "2") {
                  layout = (
                    <View key={form.id}>
                      <View className="u-label">
                        {form.label}
                        {form.required === "1" ? "(必填)" : ""}
                      </View>
                      <View className="u-select">
                        <Input
                          onClick={this.showChoose.bind(this, index)}
                          value={form.value.join("、")}
                          disabled
                          className="u-input"
                          placeholder={form.hint}
                          placeholder-style="color: #ccc"
                        />
                        <View className="u-arrow">
                          <Iconfont type="icon-arrowright" size="23"></Iconfont>
                        </View>
                      </View>
                    </View>
                  );
                }
                if (form.type === "3") {
                  layout = (
                    <View key={form.id}>
                      <View className="u-label">附件{form.required === "1" ? "(必填)" : ""}</View>
                      <View className="u-box">
                        <View className="u-box-wrap">
                          {files.map((file, index) => {
                            return (
                              <View
                                className="u-box-item"
                                onClick={this.clickFile.bind(this, index)}
                                key={file.url}
                              >
                                {file.dur ? (
                                  <View className="u-video">
                                    <Iconfont type="icon-play-circlex" />
                                  </View>
                                ) : (
                                  <View className="u-image">
                                    <Image mode="center" src={file.url}></Image>
                                  </View>
                                )}
                              </View>
                            );
                          })}
                          {files.length < 5 && (
                            <View
                              className="u-box-item"
                              onClick={this.handleChoose}
                            >
                              <View className="u-upload">
                                <Iconfont
                                  type="icon-add"
                                  color="#999"
                                  size="28"
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    )
                }
                return layout
              })}
            </View>
            <View className="u-confirm" onClick={this.handleSubmit}>
              提交
            </View>
          </View>
        </FloatLayout>
        {/* 多选单选 */}
        {forms.map((form, index) => {
          // 单选
          if (form.type === "1") {
            let options = JSON.parse(form.details);
            options = options.map(item => {
              return {
                label: item.text,
                value: item.text
              };
            });
            return (
              <FloatLayout
                showBack
                visible={form.show}
                maskClosable
                title="单项选择"
                bodyPadding={0}
                position="right"
                mask={false}
                onClose={this.handleChooseClose.bind(this, index)}
                onTitleClick={this.handleChooseClose.bind(this, index)}
              >
                <View className="u-choose-wrap">
                  <View className="u-choose" style="width: 100%;">
                    <GRadio
                      value={form.value}
                      options={options}
                      onClick={this.handleSingleChange.bind(this, index)}
                    ></GRadio>
                  </View>
                  <View
                    className="u-confirm"
                    onClick={this.handleChooseClose.bind(this, index)}
                  >
                    确认
                  </View>
                </View>
              </FloatLayout>
            );
          }
          // 多选
          if (form.type === "2") {
            let options = JSON.parse(form.details);
            options = options.map(item => {
              return {
                label: item.text,
                value: item.text
              };
            });
            return (
              <FloatLayout
                showBack
                visible={form.show}
                maskClosable
                title="多项选择"
                bodyPadding={0}
                position="right"
                mask={false}
                onClose={this.handleChooseClose.bind(this, index)}
                onTitleClick={this.handleChooseClose.bind(this, index)}
              >
                <View className="u-choose-wrap">
                  <View className="u-choose" style="width: 100%;">
                    <GCheckBox
                      value={form.value}
                      options={options}
                      onClick={this.handleMultiChange.bind(this, index)}
                    ></GCheckBox>
                  </View>
                  <View
                    className="u-confirm"
                    onClick={this.handleChooseClose.bind(this, index)}
                  >
                    确认
                  </View>
                </View>
              </FloatLayout>
            );
          }
        })}
        {/* 文件预览 */}
        {previewIndex > -1 && (
          <View className="u-preview">
            <View className="u-preview-header">
              <View className="u-back" onClick={this.closePreview}>
                <Iconfont type="icon-arrowleft" color="#fff" size="24" />
              </View>
              <View className="u-name">{`附件_${previewIndex + 1}.${currentFile.ext}`}</View>
              <View className="u-delete" onClick={this.deleteFile}>
                <Iconfont type="icon-delete-linex" color="#fff" size="24" />
              </View>
            </View>
            {currentFile.dur ? (
              <Video
                className="u-preview-video"
                src={currentFile.url}
                controls
                enablePlayGesture
                playBtnPosition="center"
              ></Video>
            ) : (
              <View
                className="u-preview-image"
                style={{ lineHeight: windowHeight + "px" }}
              >
                <GImg
                  maxWidth={375}
                  mode="aspectFit"
                  src={currentFile.url}
                ></GImg>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

export default BotWorksheet;
