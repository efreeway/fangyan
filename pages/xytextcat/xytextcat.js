// xytextcat.js
// 引入配置
var config = require('../../config');
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');


var themesRequest = (options) => {
  //getHttpHeader会把所有键名转为大写，所有者客户端取键名的时候一定要大写，最终SDK会给键名加上一个HTTP_的前缀
  // 请求精选数据
  // 测试的请求地址，用于测试会话
  var url = config.service.themesUrl;
  qcloud.request({
    // 要请求的地址
    url: url,
    //自定义的头部信息
    // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
    //login: true,

    success(result) {
      //showSuccess('请求成功完成');
      console.log('request success', result);
      var arr = result.data;

      // 获取当前现有数据进行保存
      var list = options.data.dataThemes;
      for (var key in arr) {
        //key是属性,object[key]是值
        list.push(arr[key]);//往数组中放属性
      }

      // 重新写入数据
      options.setData({
        dataThemes: list
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    /**
     * 页面配置
     */
    winWidth: 0,
    winHeight: 0,

    // tab切换
    currentTab: 0,

    // 幻灯片数据
    topStories: [],
    // 精选数据
    datalist: [{ 'name': 'gudianwenx', 'description':'1233556'}],
    // 日报数据
    dataThemes: [],

    dataListDateCurrent: 0,      // 当前日期current
    dataListDateCount: 0,      // 请求次数

    // 显示加载更多 loading
    hothidden: true,

    // loading
    hidden: true,

    /**
     * 滑动面板参数配置
     */
    indicatorDots: false,    // 是否显示面板指示点
    autoplay: false,    // 是否自动切换
    interval: 5000,     // 自动切换时间间隔
    duration: 1000,     // 滑动动画时长

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    themesRequest(that);
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

  wxSearchKeyTap: function (e) {
    //回调
    var temData = e.target.dataset.key.type;
    var temName = e.target.dataset.key.name;
    try {
      wx.setStorageSync('langtype', temData);
    } catch (e) {
      console.log('langMaterial Type set error:', temData);
    }
    try {
      wx.setStorageSync('langtypeName', temName);
    } catch (e) {
      console.log('langMaterial Type set error:', temName);
    }
    wx.navigateTo({
      url: '../xytexttopic/xytexttopic',
    })
  }
})