import Taro from '@tarojs/taro'


export const cachePromises = {}; //缓存请求的实例。key为url+params，所以当请求的参数一样时，不需要再次发送请求。

/**
 *  @param {Object}  config  https://nervjs.github.io/taro/docs/apis/network/request/request.html
 * @param {Boolean} configEx.cache 是否缓存结果，如果缓存了，当下次请求时，如果参数一样，直接返回结果
 * @param {Boolean} configEx.json  是否使用json方式提交数据 仅用于POST请求，此参数为true会指定Content-Type 为application/json
 * @return {Promise}
 */
export const request = (
    { url = "", method = "GET", data = {}, json = true }
) => {
    return new Promise((resolve, reject) => {
        const success = response => {
            const data = response.data;
            const code = data.code;
            if (code == 200) {
                resolve(data);
            } else {
                reject(data);
            }
        };
        const fail = error => {
            reject({
                code: -1,
                message: error,
                httpError: true
            });
        };

        let header =  {
            "content-type": "application/json"
        }

        if (!json) {
            header["content-type"] = "application/x-www-form-urlencoded";
        }

        let config = {
            url,
            method,
            data,
            header
        }

        Taro.request(config).then(success, fail)

    });
}
