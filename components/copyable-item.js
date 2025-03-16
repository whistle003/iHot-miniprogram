// components/copyable-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number,
      value: 0
    },
    title: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    },
    hot: {
      type: String,
      value: ''
    },
    author: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 处理复制操作
     */
    handleCopy: function() {
      const { title, url } = this.properties;
      
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

      // 触发自定义事件
      this.triggerEvent('copy', { 
        title: title,
        url: url 
      });
    }
  }
}) 