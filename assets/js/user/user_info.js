$(function () {
    //获取表单
    var form = layui.form;
    //自定义表单验证规则，form.verify不用return弹出框，直接return字就行，自带弹出功能
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符内'
            }
        }
    })

    innitUserInfo()
    var layer = layui.layer;
    //初始化用户信息
    function innitUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                //把获取到的用户信息填到对应表单里，layui里的快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }


    //重置按钮初始化信息
    $('#resetinfo').click(function (e) {
        e.preventDefault()//因为该按钮的type是reset，点击会有默认清零效果，所以要先清楚默认行为
        innitUserInfo()
    })



    //监听表单的提交,发送用户更改信息的请求
    $('.layui-form').submit(function (e) {
        
        //组织表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),//获取表单数据
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getuserinfo()
            }
        })
    })
})