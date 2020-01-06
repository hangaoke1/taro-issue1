import Taro from '@tarojs/taro';
import eventbus from '@/lib/eventbus';
import { get } from '../global_config';


export const setClipboardData = url => {
  if (get('autoCopy') && url) {
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

export const showWakeTel = url => {
  // 特殊处理电话号码
  if (url.startsWith('tel:')) {
    const tel = url.split('tel:')[1];
    Taro.makePhoneCall({
      phoneNumber: tel
    })
    return;
  }
}

/**
 * 处理长按唤起电话
 * @param {string} 链接地址 
 */
export const showActionTel = url => {
  if (url.startsWith('tel:')) {
    const tel = url.split('tel:')[1];
    Taro.showActionSheet({
      itemList: ['呼叫', '复制号码', '添加到手机通讯录'],
      success (res) {
        if (res.tapIndex === 0) {
          Taro.makePhoneCall({
            phoneNumber: tel
          })
        }
        if (res.tapIndex === 1) {
          Taro.setClipboardData({
            data: tel,
            success() {
              Taro.showToast({
                title: '号码已复制',
              })
            }
          })
        }
        if (res.tapIndex === 2) {
          Taro.addPhoneContact({
            mobilePhoneNumber: tel
          })
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
    return false;
  }
}
