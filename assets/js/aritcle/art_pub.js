$(function (){

    let layer = layui.layer
    let form = layui.form
    // 调用加载文章分类的函数
    initCate()
    // 调用富文本编辑器的函数
    initEditor()
    // 定义加载文章分类的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl_form', res)
                $('[name=cate_id]').html(htmlStr)
                // 记得一定要调用form.render()方法，来重新渲染表单，加载出下拉菜单
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    let $image = $('#image')
  
    // 2. 裁剪选项
    let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function(){
        $('#coverFile').click()
    })
    // 监听coverFile的change事件，获取用户选择的文件
    $('#coverFile').on('change', function (e){
        let files = e.target.files
        if(files.length === 0){
            return layer.msg('请选择文件！')
        }
        // console.log(files[0])
        let newImageURL = URL.createObjectURL(files[0])
        $image
        .cropper('destroy')
        .attr('src', newImageURL)
        .cropper(options)
    })
    //---------------------
    // 定义文件的发布状态
    let art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btnSave').on('click', function (){
        art_state = '草稿'
    })


    
    //1、为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        // 2、基于form表单，快速创建一个FormData对象
        // console.log(e)
        // console.log('-------------------')
        // console.log('-------------------')
        // console.log($(this))
        let fd = new FormData($(this)[0])
        // console.log(fd)
        // 3、将发布文章的state追加到fd里面去
        fd.append('state', art_state)
        // fd.forEach(function (k, v) {
        //    console.log(k, v)
        // })

        // 4、将封面裁剪过后的图片输出为对象
        $image
        .cropper('getCroppedCanvas',{
            // 创建一个Canvas画布
            width: 400,
            height:280
        })
        // 5、将裁剪过后的图片，输出为一个文件对象
        .toBlob(function(blob){
            //将canvas画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续操作，即将append到fd中去
            fd.append('cover_img', blob)

            // 调用发布文件的函数
            publishArticle(fd)
        })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd){
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果项服务器提交的是FormData格式的数据
            // 必须添加以下两个配置项：contentType：flase，proceeData: false,
            contentType: false,
            processData: false,
            success: function (res)  {
                if(res.status !== 0){
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})