// toutiao.js
// 引入API配置
const { API, request } = require('../../utils/api');
// 引入复制工具
const { copyTitleAndUrl } = require('../../utils/copyUtil');

Page({
  data: {
    updateTime: '00:00',
    refreshing: false,
    toutiaoList: [
      {
        title: '加载中...',
        hot: '热度数据加载中',
        time: '数据加载中',
        source: '数据加载中',
        tag: '',
        cover: ''
      }
    ]
  },

  onLoad: function() {
    this.refreshToutiao();
  },

  onPullDownRefresh: function() {
    this.onRefresh();
  },

  onRefresh: function() {
    this.setData({
      refreshing: true
    });
    this.refreshToutiao().then(() => {
      this.setData({
        refreshing: false
      });
      wx.stopPullDownRefresh();
    }).catch(() => {
      this.setData({
        refreshing: false
      });
      wx.stopPullDownRefresh();
    });
  },

  refreshToutiao: function(callback) {
    wx.showLoading({
      title: '加载中',
    });
    
    // 更新时间
    this.updateTime();
    
    // 使用API配置中的请求方法
    return new Promise((resolve, reject) => {
      request({
        url: API.toutiao,
        complete: () => {
          wx.hideLoading();
          if (callback && typeof callback === 'function') callback();
          resolve();
        }
      })
      .then(data => {
        // 更详细地打印数据结构，帮助调试
        console.log("头条API返回数据结构:", JSON.stringify(data));
        
        // 数据处理
        let toutiaoList = [];
        
        // 检查data是否为数组
        if (Array.isArray(data)) {
          toutiaoList = data.map((item, index) => {
            return {
              title: item.title,
              hot: item.hot,
              time: item.time || '今天',
              source: item.source || '头条',
              tag: item.tag || '',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        // 检查常见的列表字段名
        else if (data.list && Array.isArray(data.list)) {
          toutiaoList = data.list.map((item, index) => {
            return {
              title: item.title,
              hot: item.hot,
              time: item.time || '今天',
              source: item.source || '头条',
              tag: item.tag || '',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.data && Array.isArray(data.data)) {
          toutiaoList = data.data.map((item, index) => {
            return {
              title: item.title,
              hot: item.hot,
              time: item.time || '今天',
              source: item.source || '头条',
              tag: item.tag || '',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.items && Array.isArray(data.items)) {
          toutiaoList = data.items.map((item, index) => {
            return {
              title: item.title,
              hot: item.hot,
              time: item.time || '今天',
              source: item.source || '头条',
              tag: item.tag || '',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.content && Array.isArray(data.content)) {
          toutiaoList = data.content.map((item, index) => {
            return {
              title: item.title,
              hot: item.hot,
              time: item.time || '今天',
              source: item.source || '头条',
              tag: item.tag || '',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.results && Array.isArray(data.results)) {
          toutiaoList = data.results.map((item, index) => {
            return {
              title: item.title,
              hot: item.hot,
              time: item.time || '今天',
              source: item.source || '头条',
              tag: item.tag || '',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else {
          // 尝试查找对象中的任何数组属性
          let foundArray = false;
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log("找到数组属性:", key);
              if (data[key].length > 0 && data[key][0].title) {
                toutiaoList = data[key].map((item, index) => {
                  return {
                    title: item.title,
                    hot: item.hot || '热度未知',
                    time: item.time || '今天',
                    source: item.source || '头条',
                    tag: item.tag || '',
                    cover: item.cover || '',
                    url: item.url || item.link || '',
                    rank: index + 1
                  };
                });
                foundArray = true;
                break;
              }
            }
          }
          
          if (!foundArray) {
            console.error('头条API返回的数据格式不正确，无法找到列表数据', data);
            // 使用备用的模拟数据
            toutiaoList = this.getMockData();
          }
        }
        
        this.setData({
          toutiaoList: toutiaoList
        });
        
        resolve();
      })
      .catch(error => {
        console.error('头条数据请求失败', error);
        reject(error);
      });
    });
  },

  // 添加模拟数据方法
  getMockData: function() {
    return [
      {
        title: '国际贸易谈判取得突破性进展，多国签署新协议',
        hot: '热度 999+',
        time: '10分钟前',
        source: '环球时报',
        tag: '国际',
        cover: '',
        url: '',
        rank: 1
      },
      {
        title: '最新研究表明：每天步行30分钟可显著改善健康状况',
        hot: '热度 897',
        time: '30分钟前',
        source: '健康时报',
        tag: '健康',
        cover: '',
        url: '',
        rank: 2
      },
      {
        title: '国内首个量子计算机研究中心落户北京，预计明年投入使用',
        hot: '热度 856',
        time: '1小时前',
        source: '科技日报',
        tag: '科技',
        cover: '',
        url: '',
        rank: 3
      },
      {
        title: '世界环保大会在纽约召开，各国领导人承诺减少碳排放',
        hot: '热度 822',
        time: '2小时前',
        source: '国际新闻',
        tag: '环保',
        cover: '',
        url: '',
        rank: 4
      },
      {
        title: '本月全国房价数据公布，一线城市房价趋于稳定',
        hot: '热度 798',
        time: '3小时前',
        source: '经济观察报',
        tag: '财经',
        cover: '',
        url: '',
        rank: 5
      }
    ];
  },

  updateTime: function() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      updateTime: `${hours}:${minutes}`
    });
  },
  
  loadMore: function() {
    // 加载更多数据
    wx.showToast({
      title: '加载更多',
      icon: 'none'
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '今日热门头条',
      path: '/pages/toutiao/toutiao'
    };
  },

  // 添加复制方法
  copyTitleAndUrl,
}); 