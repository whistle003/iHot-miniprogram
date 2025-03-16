/**
 * 复制工具函数
 * 提供复制标题和URL的通用功能
 */

/**
 * 同时复制标题和URL到剪贴板
 * @param {Object} e - 事件对象
 */
const copyTitleAndUrl = function(e) {
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
};

module.exports = {
  copyTitleAndUrl
}; 