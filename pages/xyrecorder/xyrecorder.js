// xyrecorder.js
// recorder.js
var app = getApp();
var pageHandle = this;
var config = require('../../config');
var constants = require('../../vendor/qcloud-weapp-client-sdk/lib/constants');
var Session = require('../../vendor/qcloud-weapp-client-sdk/lib/session');

var buildAuthHeader = function buildAuthHeader(session) {
  var header = {};
  if (session && session.id && session.skey) {
    header[constants.WX_HEADER_ID] = session.id;
    header[constants.WX_HEADER_SKEY] = session.skey;
  }
  return header;
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话
    restext: '请按住录音按钮，用您的方言朗读下列文字：',
    recState: 0,//如果为0，尚未录音；如果为1，已经录音，可以上传；
    recFilePath: '',
    imageFile: '../../images/voice_icon_speech_sound_5.png',
    TextForRecord: [],
    sub_type: 'default',
    rec_type: 'primary',
    playState:0,
    playOrPause:'播放录音'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tempdata = wx.getStorageSync('TextForRecord');
    this.setData({
      TextForRecord: tempdata
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

  //手指按下
  touchdown: function () {
    console.log("手指按下了...")
    console.log("new date : " + new Date)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    //开始录音
    wx.startRecord({
      success: function (res) {
        //临时路径,下次进入小程序时无法正常使用
        var tempFilePath = res.tempFilePath
        console.log("tempFilePath: " + tempFilePath)
        //持久保存
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            //持久路径
            //本地文件存储的大小限制为 100M
            var savedFilePath = res.savedFilePath;
            _this.setData({
              recState: 1, 
              recFilePath: savedFilePath, 
              sub_type: 'primary',
              rec_type: 'default'});
            console.log("savedFilePath: " + savedFilePath)
          }
        })
        wx.showToast({
          title: '恭喜!录音成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function (res) {
        //录音失败
        wx.showModal({
          title: '提示',
          content: '录音的姿势不对!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              return
            }
          }
        })
      }
    })
  },
  //手指抬起
  touchup: function () {
    console.log("手指抬起了...")
    this.setData({
      isSpeaking: false,
    })
    clearInterval(this.timer)
    wx.stopRecord()
  },
  //点击播放录音
  testRec: function () {
    var filePath = this.data.recFilePath;
    //点击开始播放
    if (filePath != ''){
      if (this.data.playState == 0) {
        wx.playVoice({
          filePath: filePath,
          complete: function () {
            that.setData({
              playState: 0,
              playOrPause: '播放录音'
            })
          }
        });
        this.setData({
          playState: 1,
          playOrPause: '暂停播放'
        })
      } else {
        wx.pauseVoice()
        this.setData({
          playState: 0,
          playOrPause: '播放录音'
        })
      }
    }
  },

  submitRec: function () {

    var areaInfo = wx.getStorageSync('areaInfo');
    var langTypeName = wx.getStorageSync('langtypeName');
    var authHeader = buildAuthHeader(Session.get());
    var openid = wx.getStorageSync('openid');
    var url = config.service.recSubmitUrl;
    console.log("upload ready:" + authHeader);

   
    if (this.data.recState == 1 && this.data.sub_type=='primary') {
      //避免重复上传同一文件或者上传空文件
      this.setData({
        recState: 0,
        sub_type: 'default'
      });
       wx.uploadFile({
        //url: config.service.recSubmitUrl, //仅为示例，非真实的接口地址
        url: 'https://44053209.qcloud.la/index.php/upload',//此处必须用字符串？
        //url: url,
        header: authHeader,
        filePath: this.data.recFilePath,
        name: 'userfile',
        formData: {
          'openid': openid,
          'areaInfo': areaInfo,
          'topic': this.data.TextForRecord.topic,
          'material': this.data.TextForRecord.material,
          'lang_type_name': langTypeName,
          'langcode': this.data.TextForRecord.langcode
        },
        success: function (res) {
          var data = res.data
          console.log("upload success: " + data)
          //do something
          setTimeout(
            wx.showToast({
              title: '文件成功上传,在主页面下拉页面即可刷新',
              icon: 'success',
              duration: 10000
            })
          )
          wx.navigateBack();
        },
        fail: function (res) {
          var data = res.data
          console.log("upload fail: " + data)
          //do something
        }
      })
    } else{
      wx.showModal({
        title: '没有录音文件',
        content: '前先用方言录音吧!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('录音-上传错误')
            return
          }
        }
      })
    }
  },
})

//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}

