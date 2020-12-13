$(function () {
    //定义查询参数对象
    const q = {
        pagenum: 1,//默认页码值为1，即默认第一页
        pagesize: 2,//默认每页显示2条数据
        cate_id: '',//文章分类的 Id
        state: '',//文章的状态，可选值有：已发布、草稿
    }


    getartlist();
    var layer = layui.layer;
    //封装一个函数来获取文章列表数据
    function getartlist() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg(res.message);
                // console.log(res);
                var tepstr = template('table-list', res);
                $('tbody').html(tepstr);
                //根据列表来渲染分页，因为初始化列表会返回分页所需要的参数
                renderPage(res.total)
            }
        })
    }




    initGetClass();
    var form = layui.form;
    //初始化获取文章分类
    function initGetClass() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                // layer.msg(res.message);
                // console.log(res);
                //调用模板引擎渲染分类的可选项
                var tepclass = template('select-list', res);
                $('[name=cate_id]').html(tepclass);
                //通知layui渲染下可选项
                form.render()
            }
        })
    }






    //为表单注册submit事件
    $('#formSelect').on('submit', function (e) {
        //阻止表单默认行为
        e.preventDefault();
        //获取表单里所选择的数据
        var id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // console.log(id,state);
        //赋值给q
        q.cate_id = id;
        q.state = state;
        //调用初始化文章列表的方法
        getartlist()
    })


    //删除功能
    $('tbody').on('click', '#delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    getartlist()
                }
            })

            layer.close(index)
        })
    })





    var laypage = layui.laypage;
    //渲染分页的方法,接收一个总数量的参数
    function renderPage(total) {
        //调用layui里的分页方法
        laypage.render({
            elem: 'page',//注意，这里的 page 是 分页区域的ID，不用加 # 号
            count: total, //数据总数，从服务端后台提供的返回参数得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 8, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                //首次不执行
                if (!first) {
                    //do something
                    getartlist()
                }
            }
        });

    }





    //封装一个美化时间的函数作为过滤器
    template.defaults.imports.dataFormat = function (date) {
        var time = new Date(date);
        var y = time.getFullYear();
        var m = padzero(time.getMonth() + 1);
        var d = padzero(time.getDate());
        var hh = padzero(time.getHours());
        var mm = padzero(time.getMinutes());
        var ss = padzero(time.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + '-' + mm + '-' + 'ss'
    }
    // 定义补零的函数
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }

})