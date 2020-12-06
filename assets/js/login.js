$(function () {
    //两个页面切换
    $('#toreg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })
    $('#tologin').on('click', function () {
        console.log(11);
        $('.reg-box').hide();
        $('.login-box').show();
    })


    //得到form模块对象
    var form = layui.form;
    //自定义表单验证规则pwd,repwd
    form.verify({
        pwd: [
            //[\S]是非空格
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {//value是重复输入密码表单的值
            //获取第一次输入的密码，[]表示用属性获取
            var pwd = $('.reg-box [name=password]').val();
            //比较两次输入的密码，
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });


    //先获取layui的layer内置属性
    var layer = layui.layer
    //监听注册事件(给整个注册表单来设置监听事件)
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            // 模拟人的点击行为
            $('#tologin').click()
        })
    })


    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })

   
})