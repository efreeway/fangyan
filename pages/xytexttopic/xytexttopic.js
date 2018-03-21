// xytexttopic.js
const util = require('../../utils/util_lang.js');
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

var textRequest = (options) =>{
  //getHttpHeader会把所有键名转为大写，所有者客户端取键名的时候一定要大写，最终SDK会给键名加上一个HTTP_的前缀
  var header = {};
  header['XYLANGTYPE'] = options.data.langtype;
  header['XYLANGNUMSTART'] = options.data.liststart.toString();
  header['XYLANGNUMEND'] = options.data.listnum.toString();
  console.log('request success', header);


  // 请求精选数据
  // 测试的请求地址，用于测试会话
  qcloud.request({
    // 要请求的地址
    url: options.data.textUrl,

    //自定义的头部信息
    header: header,

    // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
    //login: true,

    success(result) {
      //showSuccess('请求成功完成');
      console.log('request success', result);
      var arr = result.data;

      // 获取当前现有数据进行保存
      var list = options.data.textlist;
      for (var key in arr) {
        //key是属性,object[key]是值
        list.push(arr[key]);//往数组中放属性
      }

      // 重新写入数据
      options.setData({
        textlist: list,
      });
      wx.setStorage({
        key: 'TextList',
        data: list,
      })
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

    textUrl: config.service.textUrl,
    textlist: [],
    langtype: '',
    liststart: 0,
    listnum: 10  //一次取多少数目

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    try {
      var langtype = wx.getStorageSync('langtype')
    } catch (e) {
      console.log('langMaterial Type get error:', langtype);
    }
    this.setData({
      langtype: langtype
    }),
      textRequest(that);
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
    var that = this;
    var liststart = that.data.liststart + that.data.listnum;
    this.setData({liststart : liststart});
    textRequest(that);
    console.log('onReachBottom:', that.data.liststart);
  },


  wxTopicTap: function (e) {
    //回调
    var temData = e.target.dataset.key;
    try {
      wx.setStorageSync('TextForRecord', temData)
    } catch (e) {
      console.log('langMaterial Type set error:', temData)
    }
    wx.navigateTo({
      url: '../xyrecorder/xyrecorder',
    })
    console.log('navigateTo:', 'xyrecorder')
  }
})