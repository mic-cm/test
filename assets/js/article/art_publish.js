$(function () {


    initClass();
    var layer = layui.layer;
    var form = layui.form;
    //文章类别。初始化文章分类
    function initClass() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }

                //获取分类成功后调用模板引擎
                var htmlstr = template('tpl-cate', res);
                //填充内容
                $('[name=cate_id]').html(htmlstr);
                //通知layui渲染下可选项
                form.render()
            }
        })
    }




    // 初始化富文本编辑器
    initEditor();



    //注册选择文件事件
    $('#select').click(function () {

        $('#files').click()
    })





    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //监听文件框的change事件
    $('#files').on('change', function (e) {
        // 拿到用户选择的文件
        var files = e.target.files[0];
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })



    //定义文章的发布状态
    var art_state = '已发布';
    //一点击保存草稿，状态改为草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单注册提交事件
    $('#publish').on('submit', function (e) {
        e.preventDefault();
        //new一个formdata对象来装参数，this指表单的数据

        var fd = new FormData(this);
        //添加state属性
        fd.append('state', art_state);
        // 将裁剪后的封面追加到`FormData`对象中
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
        
            })
    })


    //发布文章的方法
    function publishArticle(fd) {
            $.ajax({
                method: 'post',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发表文章失败！');
                    }
                    layer.msg('发布成功！');
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })
        }
    
    

})