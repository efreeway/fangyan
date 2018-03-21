// user.js
//var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

// 引入配置
var config = require('../../config');
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
var Session = require('../../vendor/qcloud-weapp-client-sdk/lib/session');


//最新录音和搜索虽然用的是同一个表，提交的时候也可以用同一个controller，但是由于返回后的目的数据列表不一样，还是分开为宜。
var usrvoicesRequest = (options) => {
  //getHttpHeader会把所有键名转为大写，所有者客户端取键名的时候一定要大写，最终SDK会给键名加上一个HTTP_的前缀
  var header = {};
  var openid = wx.getStorageSync('openid');

  console.log('request success', header);


  // 请求精选数据
  // 测试的请求地址，用于测试会话
  qcloud.request({
    // 要请求的地址
    url: options.data.usrvoicesUrl,
    method: 'POST',
    //自定义的头部信息
    header: header,
    data: {
      openid: openid,
      usrListStart: options.data.voiceliststart.toString(),
      usrListNum: options.data.listnum.toString()
    },
    // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
    //login: true,

    success(result) {
      //showSuccess('请求成功完成');
      console.log('request success', result);
      var arr = result.data;

      // 获取当前现有数据进行保存
      var list = options.data.voiceslist;
      var datanum = 0;
      for (var key in arr) {
        //key是属性,object[key]是值
        list.push(arr[key]);//往数组中放属性
        datanum++;
      }

      // 重新写入数据
      options.setData({
        voiceslist: list,
        returnedDataNum: datanum
      });
    },

    fail(error) {
      //showModel('请求失败', error);
      console.log('request fail', error);
    },

    complete() {
      console.log('request complete');
    }
  })
};

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["我的信息", "我的录音", "我的建议"],
    sliderWidth: 96, // 需要设置slider的宽度，用于计算中间位置
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    usrvoicesUrl: config.service.usrvoicesUrl,
    voiceslist: [],
    voiceliststart: 0,
    searchliststart: 0,
    listnum: 10,  //一次取多少数目
    usrOpinion: '',
    returnedDataNum: 0,
    disabled:'',
    authorized:'如果得到您的授权，获得您的头像、昵称等公开信息，我们就能把方言的小程序做到更好。欢迎点击下面按钮授权。'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var openid = wx.getStorageSync('openid');
    if (openid == '') {
      /**
       * 在加载录音列表的同时，在后台做用户登录，减少用户的等待时间。
       */
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
              console.log('login success', result['data']['openid']);
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
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderLeft: (res.windowWidth / that.data.tabs.length- sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    var session = Session.get();
    console.log(session);

    if (session) {
      wx.checkSession({
        success: function () {
          that.setData({
            authorized: '您已经授权我们使用您的昵称、头像等公开信息，感谢您的授权！祝您愉快！',
            disabled: 'disabled'
          })
        },
        fail: function () {
        },
      });
    }
    usrvoicesRequest(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
 * 用户点击右上角分享，这个页面有一个自己的声音列表，可以分享自己的声音。
 */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '方言土语家乡话',
      path: '/pages/xymain/xymain',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    if (that.data.activeIndex == 1) {
      this.data.voiceliststart = 0;
      this.data.voiceslist = [];
      usrvoicesRequest(that);
      console.log('onPullDownRefresh:', that.data.voiceliststart);
      setTimeout(function () {
        if (that.data.returnedDataNum == 0) {
          wx.showToast({
            title: '只有这些数据了！',
          })
        }
      }, 1000);
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.activeIndex == 1) {
      var voiceliststart = that.data.voiceliststart + that.data.listnum;
      this.setData({ voiceliststart: voiceliststart });
      usrvoicesRequest(that);
      console.log('onReachBottom:', that.data.voiceliststart);
      setTimeout(function () {
        if (that.data.returnedDataNum == 0) {
          wx.showToast({
            title: '只有这些数据了！',
          })
        }
      }, 1000);
    }
  },

  /**
   * 
   */

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  wxVoiceTap: function (e) {
    var temData = e.target.dataset.key;
    try {
      wx.setStorageSync('TextForVoice', temData)
    } catch (e) {
      console.log('langMaterial Type set error:', temData)
    }
    wx.navigateTo({
      url: '../xyvoice/xyvoice',
    })
    //console.log('navigateTo:', 'xyrecorder')
  },

  doLogin() {
    showBusy('正在登录');

    // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
    wx.login({
      success(result) {
        setTimeout(function () {
          showSuccess('登录成功');
          console.log('登录成功', result);
        }, 1000);
      },
      fail(error) {
        showModel('登录失败', error);
        console.log('登录失败', error);
      }
    });
  },
})