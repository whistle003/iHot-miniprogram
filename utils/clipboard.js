/**
 * 复制链接工具
 * 用于复制内容链接并显示提示信息
 */

/**
 * 复制内容链接到剪贴板
 * @param {Object} item - 内容项
 * @param {string} baseUrl - 基础URL，默认为空
 * @returns {string} - 复制的链接
 */
const copyContentLink = (item, baseUrl = '') => {
  // 生成链接
  let link = '';
  
  // 如果有直接的link属性则使用
  if (item.link) {
    link = item.link;
  } 
  // 否则根据内容来源和标题构造链接
  else {
    // 获取来源和转换为小写
    const source = (item.source || '').toLowerCase();
    // 清理标题，替换特殊字符
    const title = encodeURIComponent((item.title || '').trim());
    
    // 根据来源构造不同的链接
    switch(source) {
      case '微博':
      case 'weibo':
        link = `${baseUrl}/weibo?title=${title}`;
        break;
      case '知乎':
      case 'zhihu':
        link = `${baseUrl}/zhihu?title=${title}`;
        break;
      case '抖音':
      case 'douyin':
        link = `${baseUrl}/douyin?title=${title}`;
        break;
      case '豆瓣':
      case 'douban':
        link = `${baseUrl}/douban?title=${title}`;
        break;
      case '贴吧':
      case 'tieba':
        link = `${baseUrl}/tieba?title=${title}`;
        break;
      case '头条':
      case 'toutiao':
        link = `${baseUrl}/toutiao?title=${title}`;
        break;
      case '虎扑':
      case 'hupu':
        link = `${baseUrl}/hupu?title=${title}`;
        break;
      default:
        link = `${baseUrl}/content?title=${title}&source=${encodeURIComponent(item.source || '')}`;
    }
  }
  
  // 使用微信API复制到剪贴板
  wx.setClipboardData({
    data: link,
    success: function() {
      // 显示复制成功提示
      wx.showToast({
        title: '链接已复制',
        icon: 'success',
        duration: 2000
      });
    },
    fail: function() {
      // 显示复制失败提示
      wx.showToast({
        title: '复制失败',
        icon: 'none',
        duration: 2000
      });
    }
  });
  
  return link;
};

/**
 * 生成内容链接（不复制）
 * @param {Object} item - 内容项
 * @param {string} baseUrl - 基础URL，默认为空
 * @returns {string} - 生成的链接
 */
const generateContentLink = (item, baseUrl = '') => {
  // 如果有直接的link属性则使用
  if (item.link) {
    return item.link;
  }
  
  // 获取来源和转换为小写
  const source = (item.source || '').toLowerCase();
  // 清理标题，替换特殊字符
  const title = encodeURIComponent((item.title || '').trim());
  
  // 根据来源构造不同的链接
  switch(source) {
    case '微博':
    case 'weibo':
      return `${baseUrl}/weibo?title=${title}`;
    case '知乎':
    case 'zhihu':
      return `${baseUrl}/zhihu?title=${title}`;
    case '抖音':
    case 'douyin':
      return `${baseUrl}/douyin?title=${title}`;
    case '豆瓣':
    case 'douban':
      return `${baseUrl}/douban?title=${title}`;
    case '贴吧':
    case 'tieba':
      return `${baseUrl}/tieba?title=${title}`;
    case '头条':
    case 'toutiao':
      return `${baseUrl}/toutiao?title=${title}`;
    case '虎扑':
    case 'hupu':
      return `${baseUrl}/hupu?title=${title}`;
    default:
      return `${baseUrl}/content?title=${title}&source=${encodeURIComponent(item.source || '')}`;
  }
};

module.exports = {
  copyContentLink,
  generateContentLink
}; 