Component({
  properties: {
    imgList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal.length > this.data.shuffling){
          this.setData({
            shufflingList: newVal.slice(0, this.data.shuffling)
          })
        }else{
          this.setData({
            shufflingList: newVal
          })
        }
        
      }
    },
    shuffling:{
      type:Number,
      value:6
    },
    sHeight:{
      type:String,
      value:''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    shufflingList:[]
  },
  methods:{
    imagePreview:function(e){
      wx.navigateTo({
        url: "/pages/previewImg/index?imgList=" + encodeURIComponent(JSON.stringify(this.data.imgList))
      })
    }
  }
})