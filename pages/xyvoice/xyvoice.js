// xyvoice.js

// 引入配置
var config = require('../../config');
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

//提交评论（review），主要是为了可以快速禁止有问题的声音文件的播放，有些重复提交的，也可以通过这个方面把重复的部分禁止放音，只留一条可以播放
var reviewRequest = (options) => {
  //getHttpHeader会把所有键名转为大写，所有者客户端取键名的时候一定要大写，最终SDK会给键名加上一个HTTP_的前缀
  // 请求精选数据
  // 测试的请求地址，用于测试会话
  qcloud.request({
    // 要请求的地址
    url: config.service.reviewUrl,
    method: 'POST',
    //自定义的头部信息
    data: {
      reviewID: options.data.TextForListen.id,
      reviewScore: options.data.reviewScore,
      antiReason: options.data.antiReason
    },
    // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
    //login: true,

    success(result) {
      //showSuccess('请求成功完成');
      console.log('review submit success', result);
      wx.navigateBack({})
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



Page({

  /**
   * 页面的初始数据
   */
  data: {
    TextForListen: '',
    playState: 0,
    playOrPause: '播放录音',
    voiceFilePath: '',
    marks: [
      { name: '1', value: '走音了' },
      { name: '3', value: '还行啊' },
      { name: '5', value: '非常好' },
    ],
    questions: [
      { name: '6', value: '不是该地方言' },
      { name: '7', value: '别捣乱' },
    ],
    btn01:'primary',
    btn02:'default',
    btn03:'default',
    voiceReview: 0,
    reviewScore: '',
    antiReason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tempdata = wx.getStorageSync('TextForVoice');

    var filename = tempdata.rec_file_name;
    var fileUrl = config.service.voicesDownloadUrl + filename;

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

    console.log("fileurl: ", fileUrl);

    wx.downloadFile({
      url: fileUrl, //仅为示例，并非真实的资源
      success: function (res) {
        console.log("tempFilePath: ", res.tempFilePath);
        var tempFilePath = res.tempFilePath;
        that.setData({
          TextForListen: tempdata,
          voiceFilePath: tempFilePath
        })
      }
    })

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
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


  radioReviewChange: function (e) {
    this.setData({
      reviewScore: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  radioAntiChange: function (e) {
    this.setData({
      antiReason: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

//提交评分
  onReview: function () {
    var that = this;

    reviewRequest(that);
  }, 
//提交管理意见，可以直接禁止声音文件播放
  onAnti: function () {
    var that = this;

    reviewRequest(that);
  },

  onVoicePause: function () {
    var that = this;
    if (that.data.playState == 0) {
      wx.playVoice({
        filePath: that.data.voiceFilePath,
        complete: function () {
          that.setData({
            playState: 0,
            playOrPause: '播放录音'
          })
        }
      });
      that.setData({
        playState: 1,
        playOrPause: '暂停播放',
        btn01: 'default' ,
        btn02: 'primary',
        btn03: 'primary',
        voiceReview: 1       
      })
    } else {
      wx.pauseVoice()
      that.setData({
        playState: 0,
        playOrPause: '播放录音'
      })
    }
  }
})