// discovery.js
// 引入复制链接工具
const clipboard = require('../../utils/clipboard');
// 引入API配置
const { API, request } = require('../../utils/api');

// 获取应用实例
const app = getApp();

Page({
  data: {
    updateTime: '00:00',
    refreshing: false,
    searchText: '',
    discoveryList: [],
    // 保存原始数据列表，用于搜索后恢复
    originalList: []
  },

  onLoad: function() {
    this.updateTime();
    // 初始化数据
    this.generateDiscoveryData();
  },

  onShow: function() {
    // 每次显示页面时更新数据
    this.generateDiscoveryData();
  },

  onPullDownRefresh: function() {
    this.onRefresh();
  },

  onRefresh: function() {
    this.setData({
      refreshing: true
    });
    this.generateDiscoveryData();
    this.updateTime();
    this.setData({
      refreshing: false
    });
    wx.stopPullDownRefresh();
  },

  // 从首页数据生成发现页数据
  generateDiscoveryData: function() {
    wx.showLoading({
      title: '加载中',
    });
    
    // 更新时间
    this.updateTime();
    
    try {
      // 获取首页实例
      const indexPage = this.getIndexPage();
      
      if (indexPage && indexPage.data && indexPage.data.data) {
        // 首页数据可用，合并所有平台的数据
        const allItems = this.mergeDataFromIndex(indexPage.data.data);
        
        // 随机排序
        const shuffled = allItems.sort(() => 0.5 - Math.random());
        
        this.setData({
          discoveryList: shuffled,
          originalList: shuffled
        });
        
        console.log("从首页生成发现页数据:", shuffled.length, "条");
      } else {
        // 首页数据不可用，使用默认数据
        this.useDefaultData();
      }
    } catch (error) {
      console.error('生成发现页数据出错', error);
      this.useDefaultData();
    }
    
    wx.hideLoading();
  },
  
  // 获取首页实例
  getIndexPage: function() {
    const pages = getCurrentPages();
    return pages.find(page => page.route === 'pages/index/index') || null;
  },
  
  // 合并首页各平台数据
  mergeDataFromIndex: function(indexData) {
    let allItems = [];
    
    // 处理各平台数据
    if (indexData.weibo && indexData.weibo.list) {
      const weiboItems = indexData.weibo.list.map(item => ({
        title: item.title,
        source: '微博',
        hot: item.hot || '热度未知',
        url: item.url || '',
        icon: '📱'
      }));
      allItems = allItems.concat(weiboItems);
    }
    
    if (indexData.zhihu && indexData.zhihu.list) {
      const zhihuItems = indexData.zhihu.list.map(item => ({
        title: item.title,
        source: '知乎',
        hot: item.hot || '热度未知',
        url: item.url || '',
        icon: '📚'
      }));
      allItems = allItems.concat(zhihuItems);
    }
    
    if (indexData.douyin && indexData.douyin.list) {
      const douyinItems = indexData.douyin.list.map(item => ({
        title: item.title,
        source: '抖音',
        hot: item.hot || '热度未知',
        url: item.url || '',
        icon: '🎵'
      }));
      allItems = allItems.concat(douyinItems);
    }
    
    if (indexData.douban && indexData.douban.list) {
      const doubanItems = indexData.douban.list.map(item => ({
        title: item.title,
        source: '豆瓣',
        hot: item.hot || '热度未知',
        url: item.url || '',
        icon: '🎬'
      }));
      allItems = allItems.concat(doubanItems);
    }
    
    if (indexData.tieba && indexData.tieba.list) {
      const tiebaItems = indexData.tieba.list.map(item => ({
        title: item.title,
        source: '贴吧',
        hot: item.hot || '热度未知',
        url: item.url || '',
        icon: '💬'
      }));
      allItems = allItems.concat(tiebaItems);
    }
    
    if (indexData.toutiao && indexData.toutiao.list) {
      const toutiaoItems = indexData.toutiao.list.map(item => ({
        title: item.title,
        source: '头条',
        hot: item.hot || '热度未知',
        url: item.url || '',
        icon: '📰'
      }));
      allItems = allItems.concat(toutiaoItems);
    }
    
    if (indexData.hupu && indexData.hupu.list) {
      const hupuItems = indexData.hupu.list.map(item => ({
        title: item.title,
        source: '虎扑',
        hot: item.hot || '热度未知',
        url: item.url || '',
        icon: '🏀'
      }));
      allItems = allItems.concat(hupuItems);
    }
    
    return allItems;
  },
  
  // 使用默认数据
  useDefaultData: function() {
    const defaultData = [
      {
        title: '2023年度热门电影排行榜',
        source: '豆瓣',
        hot: '热度 99',
        icon: '🎬'
      },
      {
        title: '如何看待最近的科技发展趋势？',
        source: '知乎',
        hot: '热度 95',
        icon: '📚'
      },
      {
        title: '今日NBA比赛精彩集锦',
        source: '虎扑',
        hot: '热度 92',
        icon: '🏀'
      },
      {
        title: '最新流行音乐排行榜',
        source: '抖音',
        hot: '热度 90',
        icon: '🎵'
      },
      {
        title: '今日国际新闻热点',
        source: '头条',
        hot: '热度 88',
        icon: '📰'
      },
      {
        title: '最近热门话题讨论',
        source: '贴吧',
        hot: '热度 85',
        icon: '💬'
      },
      {
        title: '今日热搜榜单',
        source: '微博',
        hot: '热度 82',
        icon: '📱'
      }
    ];
    
    // 随机排序
    const shuffled = [...defaultData].sort(() => 0.5 - Math.random());
    
    this.setData({
      discoveryList: shuffled,
      originalList: shuffled
    });
    
    console.log("使用默认数据");
  },

  onSearchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  clearSearch: function() {
    this.setData({
      searchText: '',
      discoveryList: this.data.originalList
    });
  },

  onSearch: function(e) {
    const searchText = e.detail.value || this.data.searchText;
    if (!searchText.trim()) {
      return;
    }
    
    wx.showLoading({
      title: '搜索中',
    });
    
    // 在已加载的数据中进行本地搜索
    this.performLocalSearch(searchText);
    
    // 确保hideLoading被调用
    wx.hideLoading();
  },
  
  // 在本地数据中执行搜索
  performLocalSearch: function(searchText) {
    // 确保searchText不区分大小写
    const keyword = searchText.toLowerCase();
    
    // 在原始数据中进行搜索
    const filteredList = this.data.originalList.filter(item => 
      item.title.toLowerCase().includes(keyword) || 
      item.source.toLowerCase().includes(keyword)
    );
    
    this.setData({
      discoveryList: filteredList.length > 0 ? filteredList : this.data.originalList
    });
    
    if (filteredList.length === 0) {
      wx.showToast({
        title: '未找到相关内容',
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: `找到${filteredList.length}条结果`,
        icon: 'success'
      });
    }
  },

  navigateToPlatform: function(e) {
    const platform = e.currentTarget.dataset.platform;
    
    // 记录浏览历史
    this.addToHistory(platform);
    
    // 导航到对应平台页面
    wx.navigateTo({
      url: `/pages/${platform}/${platform}`
    });
  },

  navigateToDetail: function(e) {
    const item = e.currentTarget.dataset.item;
    
    // 记录浏览历史
    this.addToHistory(item.source.toLowerCase());
    
    // 根据来源跳转到不同页面
    switch(item.source) {
      case '微博':
        wx.navigateTo({
          url: '/pages/weibo/weibo'
        });
        break;
      case '知乎':
        wx.navigateTo({
          url: '/pages/zhihu/zhihu'
        });
        break;
      case '抖音':
        wx.navigateTo({
          url: '/pages/douyin/douyin'
        });
        break;
      case '豆瓣':
        wx.navigateTo({
          url: '/pages/douban/douban'
        });
        break;
      case '贴吧':
        wx.navigateTo({
          url: '/pages/tieba/tieba'
        });
        break;
      case '头条':
        wx.navigateTo({
          url: '/pages/toutiao/toutiao'
        });
        break;
      case '虎扑':
        wx.navigateTo({
          url: '/pages/hupu/hupu'
        });
        break;
      default:
        wx.navigateTo({
          url: '/pages/index/index'
        });
    }
  },

  // 添加复制链接功能
  copyContentLink: function(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.discoveryList[index];
    
    // 复制链接
    clipboard.copyContentLink(item, '/pages');
  },

  addToHistory: function(platform) {
    // 获取当前历史记录
    let history = wx.getStorageSync('browsing_history') || [];
    
    // 创建新的历史记录项
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    let icon = '📱';
    let source = '未知';
    
    // 根据平台设置图标和来源
    switch(platform) {
      case 'weibo':
        icon = '📱';
        source = '微博';
        break;
      case 'zhihu':
        icon = '📚';
        source = '知乎';
        break;
      case 'douyin':
        icon = '🎵';
        source = '抖音';
        break;
      case 'douban':
        icon = '🎬';
        source = '豆瓣';
        break;
      case 'tieba':
        icon = '💬';
        source = '贴吧';
        break;
      case 'toutiao':
        icon = '📰';
        source = '头条';
        break;
      case 'hupu':
        icon = '🏀';
        source = '虎扑';
        break;
    }
    
    const historyItem = {
      title: `浏览了${source}热榜`,
      source: source,
      time: `${hours}:${minutes}`,
      icon: icon
    };
    
    // 添加到历史记录开头
    history.unshift(historyItem);
    
    // 限制历史记录数量
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    // 保存到本地存储
    wx.setStorageSync('browsing_history', history);
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

  // 添加复制功能 - 使用copyTitleAndUrl代替
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
  
  // 导航至指定页面
  navigateToOriginal: function(e) {
    const platform = e.currentTarget.dataset.source.toLowerCase();
    let url = '';
    
    // 根据平台确定跳转路径
    switch(platform) {
      case '微博':
        url = '../weibo/weibo';
        break;
      case '知乎':
        url = '../zhihu/zhihu';
        break;
      case '抖音':
        url = '../douyin/douyin';
        break;
      case '豆瓣':
        url = '../douban/douban';
        break;
      case '贴吧':
        url = '../tieba/tieba';
        break;
      case '头条':
        url = '../toutiao/toutiao';
        break;
      case '虎扑':
        url = '../hupu/hupu';
        break;
      default:
        url = '../index/index';
    }
    
    if (url) {
      wx.navigateTo({
        url: url
      });
    }
  },
  
  onShareAppMessage: function() {
    return {
      title: 'iHot热榜发现页',
      path: '/pages/discovery/discovery'
    };
  }
}); 