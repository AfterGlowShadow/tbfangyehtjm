let url_config = "";
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  url_config = 'http://xxx.tb.com:8011/'
} else {
  // 生产环境
  url_config = 'http://highyan.hbweipai.com/'
}

export default url_config










