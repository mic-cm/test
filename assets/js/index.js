$(function () {
    //调用用户信息
    getuserinfo();


    //注册退出事件
    var layer = layui.layer;
    $('#quit').on('click', function () {
        layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function (index) {
            //清空token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html'
            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})



//获取用户信息
function getuserinfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',

        success: function (res) {
            //判断
            if (res.status !== 0) {
                return layui.layer.message
            }
            //渲染用户头像
            renderpic(res.data)
        },

        
    })

}



function renderpic(user) {
    //获取用户名称
    var name = user.nickname || user.username;
    //渲染欢迎文本
    $('#welcome1').html('欢迎&nbsp&nbsp' + name);
    //判断有没有图片头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        //渲染文字头像
        var first = name[0].toUpperCase();//将用户名称首字母大写
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide()
    }
}