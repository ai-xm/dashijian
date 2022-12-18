$(function (){
    let layer = layui.layer


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

    //   为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function (e) {
        $('#file').click()
    })
    // 为文件选择框（隐藏了）绑定change事件
    $('#file').change(function (e) {
        // console.log(e)
        let fileList = e.target.files
        // console.log(fileList)
        if(fileList.length === 0) {
            // console.log(11)
            return layer.msg('请选择更换图片！')
        }
        // console.log(fileList)
        // 拿到用户选择的文件
        let file = e.target.files[0]
        // 重新创建选择文件的url地址
        let newImgURL = URL.createObjectURL(file)
        // 重新初始化裁剪区
        // console.log(newImgURL)
        $image
        .cropper('destroy')   //销毁旧的裁剪区域
        .attr('src', newImgURL)    //重新设置图片的路径
        .cropper(options)     //重新初始化裁剪区
    })

    // 为确实按钮绑定点击事件
    $('#btnUpLoad').on('click', function () {
        // 拿到用户裁剪之后的头像
        let dataURL = $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口，上传头像
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0){
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                // console.log(res)
                window.parent.getUserInfo()
            }
        })
    })
})