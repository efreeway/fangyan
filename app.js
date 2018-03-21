/**
 * @fileOverview 微信小程序的入口文件
 */

var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config');

App({
    /**
     * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
     */
    onLaunch() {

      wx.setStorageSync('openid', '');

      /**
       * 加了showToast反而慢
       */
      /*
      wx.showToast({
        title: "请稍候！",
        icon: 'loading',
        duration: 1000
      });
      qcloud.setLoginUrl(config.service.loginUrl);
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          qcloud.request({
            // 要请求的地址
            url: config.service.getOpenidUrl,
            method: 'POST',
            //自定义的头部信息
            data: {
              jscode: res.code
            },
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录

            success(result) {
              //showSuccess('请求成功完成');
              //console.log('login success', result['data']['openid']);
              wx.setStorageSync('openid', result['data']['openid']);
              //      wx.navigateBack({})
            },

            fail(error) {
              //showModel('请求失败', error);
              console.log('request fail', error);
            },

            complete() {
              //console.log('request complete');
            }
          })
        }
      })
      */

    },
    onShow: function (options) {
      // Do something when show.
    },
    onHide: function () {
      // Do something when hide.
    },
    onError: function (msg) {
      console.log(msg)
    },
});