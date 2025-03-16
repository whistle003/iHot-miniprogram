// hupu.js
// 引入API配置
const { API, request } = require('../../utils/api');
// 引入复制工具
const { copyTitleAndUrl } = require('../../utils/copyUtil');

Page({
  data: {
    updateTime: '00:00',
    refreshing: false,
    hupuList: [
      {
        title: '加载中...',
        board: '步行街',
        replies: '0',
        cover: ''
      }
    ]
  },

  onLoad: function() {
    this.refreshHupu();
  },

  onPullDownRefresh: function() {
    this.onRefresh();
  },

  onRefresh: function() {
    this.setData({
      refreshing: true
    });
    this.refreshHupu().then(() => {
      this.setData({
        refreshing: false
      });
      wx.stopPullDownRefresh();
    });
  },

  refreshHupu: function(callback) {
    wx.showLoading({
      title: '加载中',
    });
    
    // 更新时间
    this.updateTime();
    
    // 使用API配置中的请求方法
    return new Promise((resolve, reject) => {
      request({
        url: API.hupu,
        complete: () => {
          wx.hideLoading();
          if (callback && typeof callback === 'function') callback();
          resolve();
        }
      })
      .then(data => {
        console.log("API返回数据结构:", JSON.stringify(data));
        
        // 数据处理
        let hupuList = [];
        
        // 检查res.data是否为数组
        if (Array.isArray(data)) {
          hupuList = data.map((item, index) => {
            return {
              title: item.title,
              board: item.board || '步行街',
              replies: item.replies || '0',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        } 
        // 检查常见的列表字段名
        else if (data.list && Array.isArray(data.list)) {
          hupuList = data.list.map((item, index) => {
            return {
              title: item.title,
              board: item.board || '步行街',
              replies: item.replies || '0',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.data && Array.isArray(data.data)) {
          hupuList = data.data.map((item, index) => {
            return {
              title: item.title,
              board: item.board || '步行街',
              replies: item.replies || '0',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.items && Array.isArray(data.items)) {
          hupuList = data.items.map((item, index) => {
            return {
              title: item.title,
              board: item.board || '步行街',
              replies: item.replies || '0',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.content && Array.isArray(data.content)) {
          hupuList = data.content.map((item, index) => {
            return {
              title: item.title,
              board: item.board || '步行街',
              replies: item.replies || '0',
              cover: item.cover || '',
              url: item.url || item.link || '',
              rank: index + 1
            };
          });
        }
        else if (data.results && Array.isArray(data.results)) {
          hupuList = data.results.map((item, index) => {
            return {
              title: item.title,
              board: item.board || '步行街',
              replies: item.replies || '0',
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
                hupuList = data[key].map((item, index) => {
                  return {
                    title: item.title,
                    board: item.board || '步行街',
                    replies: item.replies || '0',
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
            console.error('API返回的数据格式不正确，无法找到列表数据', data);
            // 使用备用的模拟数据
            hupuList = this.getMockData();
          }
        }
        
        this.setData({
          hupuList: hupuList
        });
        
        resolve();
      })
      .catch(error => {
        console.error('请求失败', error);
        
        // 模拟数据（实际应用中应该移除）
        this.setData({
          hupuList: this.getMockData()
        });
        
        resolve();
      });
    });
  },

  // 抽取模拟数据为单独的方法
  getMockData: function() {
    return [
      {
        title: '詹姆斯三双带队湖人击败勇士，如何评价这场比赛？',
        board: '步行街',
        replies: '2.3k',
        cover: '',
        url: 'https://bbs.hupu.com/topic-sample-1'
      },
      {
        title: '欧冠1/8决赛：皇马3-2逆转莱比锡，如何评价这场比赛？',
        board: '国际足球',
        replies: '1.8k',
        cover: '',
        url: 'https://bbs.hupu.com/topic-sample-2'
      },
      {
        title: '中超新赛季即将开始，你最看好哪支球队夺冠？',
        board: '中国足球',
        replies: '1.5k',
        cover: '',
        url: 'https://bbs.hupu.com/topic-sample-3'
      },
      {
        title: 'NBA交易截止日：各队交易总结及赢家输家分析',
        board: 'NBA',
        replies: '1.2k',
        cover: '',
        url: 'https://bbs.hupu.com/topic-sample-4'
      },
      {
        title: '如何评价姚明担任中国篮协主席以来的工作？',
        board: 'CBA',
        replies: '980',
        cover: '',
        url: 'https://bbs.hupu.com/topic-sample-5'
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
  
  navigateBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '虎扑热门话题',
      path: '/pages/hupu/hupu'
    };
  },
  
  // 添加复制方法
  copyTitleAndUrl
}); 