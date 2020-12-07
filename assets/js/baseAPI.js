
$.ajaxPrefilter(function (options) {
    // 拼接根路径与请求目标路径，options指的是$.ajax里的值
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    //提取了请求头部
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //提取了complete回调函数
    //不管成功与否都调用回调函数
    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清空token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html'

        }
    }
})
