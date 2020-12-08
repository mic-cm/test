
$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //为上传按钮绑定文件选择框点击事件
    $('#uploadfile').on('click', function () {
        $('#file').click()
    })


    var layer = layui.layer;
    //为文件选择框绑定change事件
    $('#file').change(function (e) {
        //获取文件选择框的数据，伪数组
        var filelist = e.target.files;
        //如果长度为0，提示
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        //选择了照片之后，再获取下照片
        var file = e.target.files[0];
        //创建url地址
        var imgURL = URL.createObjectURL(file)
        //初始化剪裁区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域


    })




    var layer = layui.layer;
    //为确定绑定点击事件
    $('#issure').click(function () {
        //获取裁剪后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');//将 Canvas 画布上的内容，转化为 `base64` 格式的字符串


        //上传数据
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败！')
                }
                layer.msg(res.message)
                //渲染头像
                window.parent.getuserinfo(dataURL)
            }
        })
    })



})