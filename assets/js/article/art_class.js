$(function () {

    var layer = layui.layer;

    getArtclass();

    //先获取文章分类列表
    function getArtclass() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                // layer.msg('获取文章类别成功！')
                var tephtml = template('table-add', res.data);
                $('tbody').html(tephtml)
            }
        })
    }


    var indexAdd = null;
    //为添加按钮注册点击事件
    $('#addclass').click(function () {
        //一点击弹出个框框
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#openAdd').html(),

        });
    })


    //确认添加事件，委托注册（动态创建的弹出框）
    $('body').on('submit', '#formAdd', function (e) {
        e.preventDefault();
        // console.log(11);
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                getArtclass(res);
                layer.msg(res.message);
                layer.close(indexAdd)
                // layer.closeAll()

            }
        })
    })


    var form = layui.form;
    //为编辑按钮注册点击事件，同样使用代理
    $('tbody').on('click', '#editclass', function () {
        //一点击弹出个框框
        layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#openEdit').html(),
        });
        //弹出框框之后根据id获取数据
        // 点击谁获取谁的id
        var id = $(this).attr('data-id');
        //发起请求获取数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                //获取文章分类的数据，并填充到表单中(快速赋值)
                form.val('reformEdit', res.data)

            }
        })
    })




    //确认修改事件，委托
    $('body').on('submit', '#formEdit', function (e) {
        e.preventDefault();


        //发送请求修改数据重新获取数据渲染对应页面
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改数据失败！')
                }
                //关闭弹框
                layer.closeAll();
                //重新获取文章分类列表数据
                getArtclass()
            }
        })
    })



    //为删除按钮注册点击事件，用代理
    $('tbody').on('click', '#delete', function () {
        //获取对应的id
        var id = $(this).attr('data-id');
        //一点击弹出个询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //根据id发请求删数据
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败！')
                    }
                    //删除成功
                    layer.msg('删除成功！');
                    layer.close(index);
                    getArtclass()
                }
            })

        });


    })
})