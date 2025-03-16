/**
 * API配置
 * 统一管理后端接口地址
 */

// 设置基础URL，可根据环境切换
// const BASE_URL = '';  // 空字符串会导致使用默认域名

// 环境配置
const ENV = {
  development: 'https://hot.funqie.fun',  // 开发环境
  production: 'https://hot.funqie.fun',    // 生产环境 - 请替换为实际的生产环境地址
  test: 'https://hot.funqie.fun'       // 测试环境 - 请替换为实际的测试环境地址
};

// 当前环境 - 可以根据需要切换
const CURRENT_ENV = 'development';

// 设置基础URL
const BASE_URL = ENV[CURRENT_ENV];

// API路径
const API = {
  // 热榜相关接口
  weibo: `${BASE_URL}/weibo?limit=20`,            // 微博热榜
  zhihu: `${BASE_URL}/zhihu?limit=20`,            // 知乎热榜
  douyin: `${BASE_URL}/douyin?limit=20`,          // 抖音热榜
  douban: `${BASE_URL}/douban-movie?limit=20`,    // 豆瓣热榜
  tieba: `${BASE_URL}/tieba?limit=20`,            // 贴吧热榜
  toutiao: `${BASE_URL}/toutiao?limit=20`,        // 头条热榜
  hupu: `${BASE_URL}/hupu?limit=20`,              // 虎扑热榜
  
  // 其他接口
  discovery: `${BASE_URL}/hot-list?limit=20`,     // 发现页数据 (修改为hot-list，这是DailyHot API支持的接口)
  search: `${BASE_URL}/search`,                   // 搜索接口
  history: `${BASE_URL}/history?limit=20`,        // 历史上的今天接口
  
  // 基础URL
  BASE_URL
};

// 请求封装
const request = (options) => {
  // 记录请求信息
  console.log(`[API请求] ${options.url}`);
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log(`[API成功] ${options.url}`, res.data);
          resolve(res.data);
        } else {
          console.error(`[API错误] ${options.url}`, res.statusCode, res.data);
          reject({
            error: '请求失败',
            statusCode: res.statusCode,
            data: res.data
          });
        }
      },
      fail: (err) => {
        console.error(`[API失败] ${options.url}`, err);
        reject({
          error: '网络错误',
          detail: err
        });
      },
      complete: options.complete || function() {}
    });
  });
};

module.exports = {
  API,
  request,
  BASE_URL,
  ENV,
  CURRENT_ENV
}; 