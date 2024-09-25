// /utils/i18n.js
let T = {
  locale: null,
  locales: {},
  langCode: ['zh-Hans', 'en','zh-Zangs']
}
let lastLangIndex;
T.registerLocale = function (locales) {
  T.locales = locales;
}

T.setLocale = function (code) {
  T.locale = code;
}

T.setLocaleByIndex = function (index) {
  lastLangIndex = index;
  T.setLocale(T.langCode[index]);
  setTabBarLang(index);
}


T.getLanguage = function () {
  return T.locales[T.locale];
}



// 设置导航栏标题
T.setNavigationBarTitle = function (titleString) {
  console.log(123, titleString)
  if (titleString){
    wx.setNavigationBarTitle({
      title: titleString 
    })
  }
  
}

let tabBarLangs = [
  [
    '首页',
    '路线',
    '地图',
    '我的'
  ],
  [
    'Home',
    'Route',
    'Map',
    'Mine'
  ],[
  'མདུན་ངོས།',
  'ལམ་ཐིག',
  'ས་ཁྲ།',
  'རང་ཉིད།'
  ]
];
// 设置 TabBar 语言
function setTabBarLang(index) {
  let tabBarLang = tabBarLangs[index];
  tabBarLang.forEach((element, index) => {
    wx.setTabBarItem({
      'index': index,
      'text': element
    })
  })
}

export default T