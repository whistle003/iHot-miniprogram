// index.js
// 引入API配置
const { API, request } = require('../../utils/api');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    updateTime: '加载中...',
    data: {
      weibo: {
        updateTime: '--:--',
        list: []
      },
      zhihu: {
        updateTime: '--:--',
        list: []
      },
      douyin: {
        updateTime: '--:--',
        list: []
      },
      douban: {
        updateTime: '--:--',
        list: []
      },
      tieba: {
        updateTime: '--:--',
        list: []
      },
      toutiao: {
        updateTime: '--:--',
        list: []
      },
      hupu: {
        updateTime: '--:--',
        list: []
      },
      history: {
        updateTime: '--:--',
        list: []
      }
    }
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad() {
    this.updateStatusBarTime();
    this.refreshAll();
    
    // 定时更新状态栏时间
    setInterval(() => {
      this.updateStatusBarTime();
    }, 60000); // 每分钟更新一次
  },
  onPullDownRefresh() {
    this.refreshAll(() => {
      wx.stopPullDownRefresh();
    });
  },
  updateStatusBarTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    this.setData({
      updateTime: timeStr
    });
    
    return timeStr;
  },
  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    return timeStr;
  },
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    console.log('准备跳转到:', url);
    
    if (!url) {
      console.error('跳转URL为空');
      return;
    }
    
    wx.navigateTo({ 
      url,
      success: () => {
        console.log('跳转成功:', url);
      },
      fail: (err) => {
        console.error('跳转失败:', url, err);
        // 尝试使用switchTab，防止是tabBar页面
        wx.switchTab({
          url,
          success: () => {
            console.log('switchTab成功:', url);
          },
          fail: (switchErr) => {
            console.error('switchTab也失败了:', url, switchErr);
            wx.showToast({
              title: '页面跳转失败，请稍后再试',
              icon: 'none'
            });
          }
        });
      }
    });
  },
  refreshAll(callback) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    
    const promises = [
      this.refreshWeiboData(),
      this.refreshZhihuData(),
      this.refreshDouyinData(),
      this.refreshDoubanData(),
      this.refreshTiebaData(),
      this.refreshToutiaoData(),
      this.refreshHupuData(),
      this.refreshHistoryData()
    ];
    
    Promise.all(promises).then(() => {
      wx.hideLoading();
      if (callback) {
        callback();
      }
    }).catch(() => {
      wx.hideLoading();
      if (callback) {
        callback();
      }
    });
  },
  refreshWeibo(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshWeiboData();
  },
  refreshWeiboData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.weibo.updateTime': timeStr
    });
    
    return new Promise((resolve) => {
      request({
        url: API.weibo,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.weibo.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('微博数据请求失败', error);
      });
    });
  },
  refreshZhihu(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshZhihuData();
  },
  refreshZhihuData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.zhihu.updateTime': timeStr
    });
    
    return new Promise((resolve) => {
      request({
        url: API.zhihu,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.zhihu.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('知乎数据请求失败', error);
      });
    });
  },
  refreshDouyin(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshDouyinData();
  },
  refreshDouyinData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.douyin.updateTime': timeStr
    });
    
    return new Promise((resolve) => {
      request({
        url: API.douyin,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.douyin.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('抖音数据请求失败', error);
      });
    });
  },
  refreshDouban(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshDoubanData();
  },
  refreshDoubanData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.douban.updateTime': timeStr
    });
    
    return new Promise((resolve) => {
      request({
        url: API.douban,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.douban.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('豆瓣数据请求失败', error);
      });
    });
  },
  refreshTieba(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshTiebaData();
  },
  refreshTiebaData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.tieba.updateTime': timeStr
    });
    
    return new Promise((resolve) => {
      request({
        url: API.tieba,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.tieba.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('贴吧数据请求失败', error);
      });
    });
  },
  refreshToutiao(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshToutiaoData();
  },
  refreshToutiaoData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.toutiao.updateTime': timeStr
    });
    
    return new Promise((resolve) => {
      request({
        url: API.toutiao,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.toutiao.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('头条数据请求失败', error);
      });
    });
  },
  refreshHupu(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshHupuData();
  },
  refreshHupuData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.hupu.updateTime': timeStr
    });
    
    return new Promise((resolve) => {
      request({
        url: API.hupu,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.hupu.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('虎扑数据请求失败', error);
      });
    });
  },
  refreshHistory(e) {
    // 确保e是事件对象且有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
    
    this.refreshHistoryData();
  },
  refreshHistoryData() {
    const timeStr = this.updateTime();
    this.setData({
      'data.history.updateTime': timeStr
    });
    
    const now = new Date();
    const month = (now.getMonth() + 1).toString();
    const day = now.getDate().toString();
    
    return new Promise((resolve) => {
      request({
        url: `${API.history}?month=${month}&day=${day}`,
        complete: () => {
          resolve();
        }
      })
      .then(data => {
        if (data && data.data) {
          this.setData({
            'data.history.list': data.data
          });
        }
      })
      .catch(error => {
        console.error('历史上的今天数据请求失败', error);
      });
    });
  },
  onShareAppMessage() {
    return {
      title: 'iHot - 今日热榜',
      path: '/pages/index/index'
    };
  }
})
