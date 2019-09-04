import Taro from '@tarojs/taro';

export const setClipboardData = url => {
  Taro.setClipboardData({
    data: url,
    success: () => {
      Taro.hideToast();
      Taro.showToast({
        title: '链接已复制',
        icon: 'success'
      });
    }
  });
};
