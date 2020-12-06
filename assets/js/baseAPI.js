$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})
//$.ajaxPrefilter函数用于拼接根路径与请求目标路径，options指的是$.ajax里的值