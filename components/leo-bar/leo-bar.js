// components/leo-bar/leo-bar.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    barInfo: Object
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindSearch: function() {
      // 第一个参数：事件名称
      // 第二个参数：要传递的数据
      // 第三个参数：触发事件的选项，bubbles，composed，capturePhase
      this.triggerEvent("search", {}, {});
    }
  }
})