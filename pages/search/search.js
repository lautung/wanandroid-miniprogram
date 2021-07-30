// pages/search/search.js

const api = require('../../api/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotkeyList: [],
    content: '',
    showSearchResult: false,
    searchData: {
      curPage: 0,
      pageCount: 0,
      datas: []
    },
    searchHistoryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.requestHotkey();
    wx.getStorage({
      key: 'searchHistoryList',
      success: res => {
        this.setData({
          searchHistoryList: res.data
        });
      },
    })
  },

  requestHotkey: function() {
    api.hotkey().then(res => {
      this.setData({
        hotkeyList: res.data
      });
    });
  },

  requestSearch: function() {
    let curPage = this.data.searchData.curPage;
    api.search(curPage, {
      k: this.data.content
    }).then(res => {
      this.data.searchData.datas.push(...res.data.datas);
      this.data.searchData.curPage = res.data.curPage;
      this.data.searchData.pageCount = res.data.pageCount;

      if (this.data.searchData.datas.length == 0) {
        wx.showToast({
          title: '没有找到相关数据',
          icon: 'none'
        });
      }
      this.setData({
        searchData: this.data.searchData,
        showSearchResult: true
      });

    });
    this.saveHistory();
  },

  saveHistory: function() {
    let searchHistoryList = this.data.searchHistoryList;

    searchHistoryList.forEach((item, index) => {
      if (item.name == this.data.content) {
        searchHistoryList.splice(index, 1);
      }
    });

    let history = {};
    history.name = this.data.content;
    searchHistoryList.unshift(history);
    if (searchHistoryList.length > 20) {
      searchHistoryList.splice(20, 1);
    }
    this.setData({
      searchHistoryList: searchHistoryList
    });
    wx.setStorage({
      key: 'searchHistoryList',
      data: searchHistoryList
    });
  },

  bindInput: function(event) {
    this.setData({
      content: event.detail.value
    });
  },

  bindSearch: function(event) {
    if (this.data.content.length == 0) {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      });
      return;
    }
    this.setData({
      searchData: {
        curPage: 0,
        pageCount: 0,
        datas: []
      }
    });
    this.requestSearch();
  },

  bindCancelSearch: function() {
    this.setData({
      showSearchResult: false
    });
  },

  bindRecord: function(event) {
    this.setData({
      content: event.detail.dataset.content,
      searchData: {
        curPage: 0,
        pageCount: 0,
        datas: []
      }
    });
    this.requestSearch();
  },

  bindCleanSave: function() {
    wx.removeStorage({
      key: 'searchHistoryList',
      success: res => {
        this.setData({
          searchHistoryList: []
        });
      },
    })
  },

  bindClean: function() {
    this.setData({
      content: ''
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.showSearchResult){
      if(this.data.searchData.curPage < this.data.searchData.pageCount){
        this.requestSearch();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})