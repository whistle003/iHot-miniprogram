// webview.js
Page({
  data: {
    url: '',
    title: '网页'
  },

  onLoad: function (options) {
    if (options.url) {
      const decodedUrl = decodeURIComponent(options.url);
      this.setData({
        url: decodedUrl
      });
    }
    
    if (options.title) {
      this.setData({
        title: options.title
      });
      
      // 设置导航栏标题
      wx.setNavigationBarTitle({
        title: options.title
      });
    }
  },

  navigateBack: function() {
    wx.navigateBack();
  },

  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: `/pages/webview/webview?url=${encodeURIComponent(this.data.url)}&title=${this.data.title}`
    };
  }
}); 