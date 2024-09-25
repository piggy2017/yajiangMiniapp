// my-components/star/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'推荐指数'
    },
    rating: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        let fullStar = 0, halfStar = 0, emptyStar=0;
        if (Number.isInteger(newVal)){
          fullStar=newVal
          emptyStar=5-newVal
        }else{
          halfStar=1;
          fullStar = Math.floor(newVal)
          emptyStar = 5 - halfStar - fullStar
        }
        this.setData({
          fullStar: fullStar,
          halfStar: halfStar,
          emptyStar: emptyStar
        })
      } 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fullStar:0,
    halfStar:0,
    emptyStar:5
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
