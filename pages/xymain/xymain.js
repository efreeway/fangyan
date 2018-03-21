// xymain.js

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

// 引入配置
var config = require('../../config');
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');


//最新录音和搜索虽然用的是同一个表，提交的时候也可以用同一个controller，但是由于返回后的目的数据列表不一样，还是分开为宜。
var voicesRequest = (options) => {
  //getHttpHeader会把所有键名转为大写，所有者客户端取键名的时候一定要大写，最终SDK会给键名加上一个HTTP_的前缀
  var header = {};
  header['XYLISTSTART'] = options.data.voiceliststart.toString();
  header['XYLISTNUM'] = options.data.listnum.toString();
 
  // 请求精选数据
  // 测试的请求地址，用于测试会话
  qcloud.request({
    // 要请求的地址
    url: options.data.voicesUrl,
    method: 'POST',
    //自定义的头部信息
    header: header,
    data: {
      searchText: options.data.textSearch,
      searchArea: options.data.areaSearch,
      searchOrnot: options.data.activeIndex.toString()
    },
    // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
    //login: true,

    success(result) {
      //showSuccess('请求成功完成');
      console.log('request success', result);
      var arr = result.data;

      // 获取当前现有数据进行保存
      var list = options.data.voiceslist;
      var datanum=0;
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


var bestListRequest = (options) => {
  //getHttpHeader会把所有键名转为大写，所有者客户端取键名的时候一定要大写，最终SDK会给键名加上一个HTTP_的前缀
  var header = {};
  header['XYLISTSTART'] = options.data.bestliststart.toString();
  header['XYLISTNUM'] = options.data.listnum.toString();

  // 请求精选数据
  // 测试的请求地址，用于测试会话
  qcloud.request({
    // 要请求的地址
    url: options.data.voicesUrl,
    method: 'POST',
    //自定义的头部信息
    header: header,
    data: {
      searchText: options.data.textSearch,
      searchArea: options.data.areaSearch,
      searchOrnot: options.data.activeIndex.toString()
    },
    // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
    //login: true,

    success(result) {
      //showSuccess('请求成功完成');
      console.log('request success', result);
      var arr = result.data;

      // 获取当前现有数据进行保存
      var list = options.data.bestlist;
      var datanum = 0;
      for (var key in arr) {
        //key是属性,object[key]是值
        list.push(arr[key]);//往数组中放属性
        datanum++;
      }

      // 重新写入数据
      options.setData({
        bestlist: list,
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

//搜索查询函数
var searchRequest = (options) => {
  //getHttpHeader会把所有键名转为大写，所有者客户端取键名的时候一定要大写，最终SDK会给键名加上一个HTTP_的前缀
  var header = {};
  header['XYLISTSTART'] = options.data.searchliststart.toString();
  header['XYLISTNUM'] = options.data.listnum.toString();

  // 请求精选数据
  // 测试的请求地址，用于测试会话
  qcloud.request({
    // 要请求的地址
    url: options.data.voicesUrl,

    //自定义的头部信息
    header: header,
    data: {
      searchText: options.data.textSearch,
      searchArea: options.data.areaSearch,
      searchOrnot: options.data.activeIndex.toString()
    },
    method:'POST',
    // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
    //login: true,

    success(result) {
      //showSuccess('请求成功完成');
      console.log('request success', result);
      var arr = result.data;

      // 获取当前现有数据进行保存
      var list = options.data.searchlist;
      var datanum = 0;
      for (var key in arr) {
        //key是属性,object[key]是值
        list.push(arr[key]);//往数组中放属性
        datanum++;
      }

      // 重新写入数据
      options.setData({
        searchlist: list,
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


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["最新", "最佳", "搜索", "我要录音"],//！！！注意，一旦这里改了，所有的跟activeIndex相关部分都需要做相应的变化。
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 10,
    voicesUrl: config.service.voicesUrl,
    voiceslist: [],
    bestlist: [],
    searchlist: [],
    voiceliststart: 0,
    bestliststart: 0,
    searchliststart:0,
    listnum: 10,  //一次取多少数目
    FYType:'primary',
    textType: 'default',
    searchValue:'',
    textSearch:'',
    areaSearch:'',
    searchTaped: 0,
    returnedDataNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    //调取最新录音列表
    voicesRequest(that);
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
    var that = this;
    if (that.data.activeIndex == 0) {
      var that = this;
      this.data.voiceliststart = 0;
      this.data.voiceslist = [];
      // this.setData({
      //   voiceliststart: 0,
      //   voiceslist: []
      // })
      console.log('onPullDownRefresh:', that.data.voiceliststart);
      wx.showToast({
        title: '数据正在更新！',
      })
      voicesRequest(that);
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.activeIndex == 0) {
      var voiceliststart = that.data.voiceliststart + that.data.listnum;
      this.setData({ voiceliststart: voiceliststart });
      voicesRequest(that);
      console.log('onReachBottom:', that.data.voiceliststart);
      if (that.data.returnedDataNum == 0) {
        wx.showToast({
          title: '只有这些数据了！',
        })
      }
    }

    if (that.data.activeIndex == 1) {//最佳录音列表
      this.data.bestliststart = that.data.bestliststart + that.data.listnum;
      bestListRequest(that);
      console.log('onReachBottom:', that.data.bestliststart);
      if (that.data.returnedDataNum == 0) {
        wx.showToast({
          title: '没更多数据啦，您来录一段吧！',
        })
      }
    }

    if (that.data.activeIndex == 2) {//搜索tab的index是2
      this.data.searchliststart = that.data.searchliststart + that.data.listnum;
      searchRequest(that);
      console.log('onReachBottom:', that.data.searchliststart);
      if (that.data.returnedDataNum == 0) {
        wx.showToast({
          title: '没更多数据啦，您来录一段吧！',
        })
      }
    }

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

  tabClick: function (e) {
    var that = this;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 1 && that.data.bestlist.length ==0 ){//最佳列表
      bestListRequest(that)
    }
    if (e.currentTarget.id == 3 ) {//我要录音
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
    }
  },

  selectDistrict: function (){
    this.setData({
      FYType: 'default',
      textType: 'primary'
    })
    wx.navigateTo({
      url: '../xypicker/xypicker',
    })
  },

  selectTextType: function () {
    wx.navigateTo({
      url: '../xytextcat/xytextcat',
    })
  },

  wxVoiceTap: function (e) {
    var temData = e.target.dataset.key;
    //console.log('id', e.target.dataset.index);
    //console.log('e.target.dataset', e.target.dataset);
    try {
      if (this.data.activeIndex == 0){
        wx.setStorageSync('ArrayForVoice', this.data.voiceslist)
      }
      else if (this.data.activeIndex == 2){
        wx.setStorageSync('ArrayForVoice', this.data.searchlist)
      }
      wx.setStorageSync('IndexForVoice', e.target.dataset.index);
      wx.setStorageSync('TextForVoice', temData);
    } catch (e) {
      console.log('langMaterial Type set error:', temData)
    }
    wx.navigateTo({
      url: '../xyvoice/xyvoice',
    })
    //console.log('navigateTo:', 'xyrecorder')
  },

  bindSearch: function (){
    //setTimeout(function () {
    //}, 1000);
    var that = this;
    that.setData({
       searchlist: [], 
       searchliststart: 0,
       returnedDataNum: 0, 
       searchTaped:1
       });
    if (that.data.textSearch == '' && that.data.areaSearch == ''){
      wx.showToast({
        title: '请输入查询内容',
      })
    }else {
      searchRequest(that);
      setTimeout(function(){
        if(that.data.returnedDataNum == 0) {
          wx.showToast({
            title: '还没数据呢，您来录一段吧！',
          })
        }}, 1000);

    }
  },

  bindTextInput: function(e) {
    console.log('bindTextInput', e.detail.value);
    this.setData({
      textSearch: e.detail.value
    })
  },

  bindAreaInput: function (e) {
    this.setData({
      areaSearch: e.detail.value
    })
  },
})