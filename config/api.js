var WxApiRoot = 'https://admin.tripzuji.com/';
var WxApiRoot2 = 'https://api.tripzuji.com/';

module.exports = {
  APPIndex: WxApiRoot + 'api/index', //首页配置信息
  APPHome: WxApiRoot2 + 'api/home',   // 新龙、德格县的主页数据
    APPTraffic: WxApiRoot2 + 'api/traffic/list',   // 交通列表
    APPTrafficDetail: WxApiRoot2 + 'api/traffic/detail',   // 交通xiangqing
    APPYule: WxApiRoot2 + 'api/recreation/list',   // 娱乐列表数据接口
    APPYuleDetail: WxApiRoot2 + 'api/recreation/detail',   // 娱乐详情数据接口
  APPIndexArea: WxApiRoot + 'api/index/area', //地区详情
  APPVideoList: WxApiRoot + 'api/video/list', //视频列表
  APPweather: WxApiRoot + 'api/weather/info', //获取天气数据
  APPsearch: WxApiRoot +'api/search/list',//全局搜索
  APPnews: WxApiRoot + 'api/news/list',//旅游要闻
  APPscenic: WxApiRoot + 'api/scenic/list',//景点列表
  APPscenicDetail: WxApiRoot + 'api/scenic/detail',//景点详情
  APPcollectionAdd: WxApiRoot + 'api/collection/add',//景点/路线收藏
  APPcollectionRemove: WxApiRoot + 'api/collection/remove',//取消收藏
  APPgesaer: WxApiRoot + 'api/gesaer/list',//格萨尔文化列表
  APPculture: WxApiRoot + 'api/culture/list',//民俗文化列表
  APPhotel: WxApiRoot + 'api/hotel/list',//酒店列表
  APPhotelDetail: WxApiRoot + 'api/hotel/detail',//酒店详情
  APPrestaurant: WxApiRoot + 'api/restaurant/list',//餐厅列表
  APPrestaurantDetail: WxApiRoot + 'api/restaurant/detail',//餐厅详情
  APPspecialty: WxApiRoot + 'api/specialty/list',//特产列表
  APPspecialtyDetail: WxApiRoot + 'api/specialty/detail',//特产详情
  APPservice: WxApiRoot + 'api/service/list',//本地服务
  APPUserLogin: WxApiRoot +'api/user/login',//用户登录
  APPUserCreate: WxApiRoot + 'api/user/create',//用户注册
  APPUserUpdate: WxApiRoot + 'api/user/update',//用户修改
  APPCollectionList: WxApiRoot + 'api/collection/list',//显示收藏的景区或旅游路线
  APPCommonComplaint: WxApiRoot + 'api/common/complaint',//投诉建议
  APPCommonAbout: WxApiRoot + 'api/common/about',//关于应用
  APPRouteListQuery: WxApiRoot + 'api/route/list_query',//旅游路线列表（传入天数条件）
  APPRouterList: WxApiRoot + 'api/route/list',//路线
  APPRouterDetail: WxApiRoot + 'api/route/detail',//旅游路线详情
  APPMapInfo: WxApiRoot + 'api/map/list',//路线详情
  APPMapPetrolInfo: WxApiRoot + 'api/petrol_station/list',//加油站用地图显示
  APPdetailExtra: WxApiRoot2 + 'api/scenic/detail_extra',  // 通过如下api获取VR链接，其中id为当前景点的id
}