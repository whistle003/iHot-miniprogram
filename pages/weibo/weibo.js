// pages/weibo/weibo.js
// 引入API配置
const { API, request } = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    updateTime: '--:--',
    refreshing: false,
    weiboList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshWeibo();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onRefresh();
  },

  /**
   * 下拉刷新事件
   */
  onRefresh: function () {
    this.setData({ 
      refreshing: true 
    });
    
    this.refreshWeibo(() => {
      this.setData({ 
        refreshing: false 
      });
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 刷新微博数据
   */
  refreshWeibo: function (callback) {
    // 更新时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    this.setData({
      updateTime: timeStr
    });
    
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
    });
    
    // 使用API配置中的请求方法
    request({
      url: API.weibo,
      complete: () => {
        wx.hideLoading();
        if (callback && typeof callback === 'function') callback();
      }
    })
    .then(data => {
      if (data && data.data) {
        this.setData({
          weiboList: data.data
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

  /**
   * 加载更多数据 (目前API不支持分页，此方法仅作占位)
   */
  loadMore: function () {
    // 热搜榜目前没有分页加载，此方法仅作为示例
    // 如果后续API支持分页，可在此处实现
  },

  /**
   * 复制微博标题到剪贴板
   */
  copyTitle: function(e) {
    const title = e.currentTarget.dataset.title;
    wx.setClipboardData({
      data: title,
      success: function() {
        wx.showToast({
          title: '已复制标题',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  /**
   * 同时复制微博标题和URL到剪贴板
   */
  copyTitleAndUrl: function(e) {
    const title = e.currentTarget.dataset.title;
    const url = e.currentTarget.dataset.url || '';
    
    // 处理URL不存在的情况
    if (!url) {
      wx.showToast({
        title: '该条目无链接',
        icon: 'none',
        duration: 1500
      });
      // 至少复制标题
      wx.setClipboardData({
        data: title,
        success: function() {
          wx.showToast({
            title: '已复制标题',
            icon: 'success',
            duration: 1500
          });
        }
      });
      return;
    }
    
    // 组合标题和URL
    const copyText = `${title}\n${url}`;
    
    wx.setClipboardData({
      data: copyText,
      success: function() {
        wx.showToast({
          title: '已复制标题和链接',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '微博热搜榜 - 今日热榜',
      path: '/pages/weibo/weibo'
    };
  },

  navigateBack: function() {
    wx.navigateBack();
  },
}) 