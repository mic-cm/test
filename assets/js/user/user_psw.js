$(function () {
    //表单验证模块，先获取表单
    var form = layui.form;
    //自定义密码验证
    form.verify({
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })


    var layer = layui.layer;
    //注册提交事件，提交请求
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新用户信息成功')
                //如果更新成功，重置一下表单内容
                //因为reset方法是dom操作的，所以把jquery转dom加[0]
                $('.layui-form')[0].reset()
            }

        })
    })
})