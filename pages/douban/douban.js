// pages/douban/douban.js
// 引入API配置
const { API, request } = require('../../utils/api');
// 引入复制工具
const { copyTitleAndUrl } = require('../../utils/copyUtil');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    updateTime: '--:--',
    refreshing: false,
    doubanList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshDouban();
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
    
    this.refreshDouban(() => {
      this.setData({ 
        refreshing: false 
      });
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 刷新豆瓣数据
   */
  refreshDouban: function (callback) {
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
      url: API.douban,
      complete: () => {
        wx.hideLoading();
        if (callback && typeof callback === 'function') callback();
      }
    })
    .then(data => {
      if (data && data.data) {
        this.setData({
          doubanList: data.data
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
    // 豆瓣榜单目前没有分页加载，此方法仅作为示例
    // 如果后续API支持分页，可在此处实现
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '豆瓣电影榜单 - 今日热榜',
      path: '/pages/douban/douban'
    };
  },

  // 添加复制方法
  copyTitleAndUrl,
}) 