import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import FloatLayout from "@/components/FloatLayout";
import Iconfont from "@/components/Iconfont";
import { previewFile } from "@/actions/chat";
import GImg from "@/components/GImg";
import "./index.less";

class BotWorksheet extends Component {
  state = {
    visible: true,
    previewIndex: -1,
    files: [],
    windowHeight: wx.getSystemInfoSync()["windowHeight"],
    showChoose: false
  };

  componentWillMount() {}

  componentDidMount() {}

  handleClose = () => {
    this.setState({
      visible: false
    });
  };

  // 选择上传
  handleChoose = () => {
    console.log(">>>> 点击上传");
    Taro.showActionSheet({
      itemList: ["上传图片", "上传视频"],
      success: res => {
        if (res.tapIndex === 0) {
          Taro.chooseImage({
            sourceType: ["album"],
            count: 1
          })
            .then(res => {
              console.log(">>> 选择相册", res);
              previewFile(res.tempFilePaths[0]).then(file => {
                console.log(">>> 上传成功", file);
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
              console.log(">>> 选择视频", res);
              previewFile(res.tempFilePath, "video").then(file => {
                console.log(">>> 上传成功", file);
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
    // TODO: 删除文件
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

  showChoose = () => {
    this.setState({
      showChoose: true
    });
  };

  handleChooseClose = () => {
    this.setState({
      showChoose: false
    });
  };
  render() {
    const {
      visible,
      previewIndex,
      files,
      windowHeight,
      showChoose
    } = this.state;
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
                <View className="u-label">手机</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">微博账号</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">选项表单</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">选项表单</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">选项表单</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">选项表单</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">选项表单</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">选项表单</View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label" onClick={this.showChoose}>
                  单项选择
                </View>
                <Input
                  className="u-input"
                  placeholder="提示暗纹"
                  placeholder-style="color: #ccc"
                />

                <View className="u-label">附件</View>
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
                      <View className="u-box-item" onClick={this.handleChoose}>
                        <View className="u-upload">
                          <Iconfont type="icon-add" color="#999" size="28" />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            <View className="u-confirm">提交</View>
          </View>
        </FloatLayout>
        {/* 文件预览 */}
        {previewIndex > -1 && (
          <View className="u-preview">
            <View className="u-preview-header">
              <View className="u-back" onClick={this.closePreview}>
                <Iconfont type="icon-arrowleft" color="#fff" size="24" />
              </View>
              <View className="u-name">asdf.jpg</View>
              <View className="u-delete" onClick={this.deleteFile}>
                <Iconfont type="icon-delete" color="#fff" size="24" />
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
        {/* 单选/多选 */}
        <FloatLayout
          showBack
          visible={showChoose}
          maskClosable
          title="单项选择"
          bodyPadding={0}
          position="right"
          mask={false}
          onClose={this.handleChooseClose}
          onTitleClick={this.handleChooseClose}
        >
          <View className="u-choose-wrap">
            <View className="u-choose">
              <View className="u-choose-item">选项1</View>
              <View className="u-choose-item">选项2</View>
              <View className="u-choose-item">选项3</View>
              <View className="u-choose-item">选项4</View>
              <View className="u-choose-item">选项5</View>
              <View className="u-choose-item">选项1</View>
              <View className="u-choose-item">选项2</View>
              <View className="u-choose-item">选项3</View>
              <View className="u-choose-item">选项4</View>
              <View className="u-choose-item">选项5</View>
              <View className="u-choose-item">选项1</View>
              <View className="u-choose-item">选项2</View>
              <View className="u-choose-item">选项3</View>
              <View className="u-choose-item">选项4</View>
              <View className="u-choose-item">选项5</View>
              <View className="u-choose-item">选项1</View>
              <View className="u-choose-item">选项2</View>
              <View className="u-choose-item">选项3</View>
              <View className="u-choose-item">选项4</View>
              <View className="u-choose-item">选项5</View>
            </View>
            <View className="u-confirm">确认</View>
          </View>
        </FloatLayout>
      </View>
    );
  }
}

export default BotWorksheet;
