import Taro from '@tarojs/taro';
import eventbus from '@/lib/eventbus';
import { get } from '../global_config';


export const setClipboardData = url => {
  if (get('autoCopy')) {
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
  }
  eventbus.trigger('click_action', { url });
};
