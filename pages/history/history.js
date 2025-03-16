// history.js - 历史上的今天
// 引入API配置
const { API, request } = require('../../utils/api');
// 引入复制工具
const { copyTitleAndUrl } = require('../../utils/copyUtil');

Page({
  data: {
    updateTime: '00:00',
    refreshing: false,
    historyList: [], // 历史上的今天数据
    month: '',
    day: ''
  },

  onLoad: function() {
    // 获取当前日期
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    this.setData({
      month: month,
      day: day
    });
    
    // 加载历史上的今天数据
    this.loadHistoricalEvents();
    this.updateTime();
  },

  onPullDownRefresh: function() {
    this.onRefresh();
  },

  onRefresh: function() {
    this.setData({
      refreshing: true
    });
    
    this.loadHistoricalEvents(() => {
      this.updateTime();
      this.setData({
        refreshing: false
      });
      wx.stopPullDownRefresh();
    });
  },

  loadHistoricalEvents: function(callback) {
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
    });
    
    const { month, day } = this.data;
    
    // 使用API配置中的请求方法获取历史上的今天数据
    request({
      url: API.history,
      data: { month, day },
      complete: () => {
        wx.hideLoading();
        if (callback && typeof callback === 'function') callback();
      }
    })
    .then(data => {
      console.log('历史上的今天数据:', data);
      
      if (data && data.data) {
        this.setData({
          historyList: data.data
        });
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
    })
    .catch(error => {
      console.error('请求失败', error);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  viewDetail: function(e) {
    const item = e.currentTarget.dataset.item;
    
    // 如果有链接，打开webview
    if (item.url) {
      wx.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(item.url)}&title=历史上的今天`
      });
    }
  },

  navigateToIndex: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  updateTime: function() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      updateTime: `${hours}:${minutes}`
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: `${this.data.month}月${this.data.day}日 - 历史上的今天`,
      path: '/pages/history/history'
    };
  },

  // 添加复制方法
  copyTitleAndUrl,
}); 