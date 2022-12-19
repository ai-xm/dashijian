$(function (){
    // 定义一个查询的参数对象，
    // 方便请求数据的时候将请求参数提交到服务器
    let q = {
        pagenum: 1,  //页码值，默认请求第一页的数据
        pagesize: 2,   //煤业显示几条数据，默认每页显示两条
        cate_id: '',    //文章分类的Id
        state: ''    //文章的发布状态
    }

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    // 定义补零函数
    function padzero(n){
        return n > 9 ? n : '0' + n
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date){
        const dt = new Date(date)

         let y = dt.getFullYear()
         let m = padzero(dt.getMonth() + 1)
         let d = padzero(dt.getDate())

         let hh = padzero(dt.getHours())
         let mm = padzero(dt.getMinutes())
         let ss = padzero(dt.getSeconds())

         return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
    }
    

    // 调用文章列表数据函数
    initTable()

    // 调用获取分类的函数
    initCate()

    // 封装获取文章列表数据的函数
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res){
                if(res.status !== 0){
                    console.log(11)
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res)
                // console.log(template)
                // 使用模板引擎渲染页面结构
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                // 传递总文章数的值，即res.total
                renderPage(res.total)
            }
        })
    }

    
    // 获取文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-select', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e){
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象重新赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的参数，重新调用文章列表数据函数
        initTable()
    })

    // 定义渲染分页的方法（函数）
    function renderPage(total){
        // console.log(total)
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total,  //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,   //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: ['2', '3', '5', '10'],
            // 分页发生切换的时候触发jump回调
            // 触发jump函数的方式：
            // 1、当点击分页的时候，会调用renderPage这个渲染分页的方法
            // 2、当调用laypage.render()方法会触发jump函数
            jump: function (obj, first){
                // console.log(first)    //得到的first值是true
                // console.log(obj.limit)
                // 可以通过first的值，来判断是那种方式来触发的jump回调函数
                // console.log(obj.curr)
                // 把最新的页码值赋值到q这个查询参数的对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                    // console.log(11)
                }
            }
        })
    }

    // 定义一个获取文章详情的函数
    function getArticle(id){
        // 发起ajax请求，获取原文章内容，并填入表单中
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            data: {
                id: id

            },
            success: function(res){
                console.log(res.data)
                let data = res.data
                $('#titleEdit').val(data.title)
                $('#nameEdit').attr('data-id', data.cate_id).val(data.cate_id)
                $('[name="content"]').html(data.content)
                // $('#image').attr('src', '.../image/1.jpg')
                // console.log($('#image').attr('src'))
                // let oldImageURL = URL.createObjectURL(files[0])
                // $image
                // .cropper('destroy')      // 销毁旧的裁剪区域
                // .attr('src', oldImageURL)  // 重新设置图片路径
                // .cropper(options)        // 重新初始化裁剪区域
                
            }
        })
    }
    // 通过事件委托的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function (){
        let id = $(this).attr('data-id')
        let len = $('.btn-delete').length
        // console.log(len)
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+ id,
                success: function (res){
                    if(res.status !== 0){
                        // console.log('1111aaa')
                        return layer.msg('删除文章失败！')
                    }
                    // console.log('a2222')
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前页面中是否还有数据
                    // 如果还有数据，则让页码值-1
                    // 如果len的值等于1，证明删除之后当前页面就没有任何数据了
                    if(len === 1){
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 页码值-1后再重新调用渲染页面数据的方法
                    initTable()
                }
            })
            layer.close(index)
        })
    })

    // 通过事件委托的方式，为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function (){
        // 当点击的时候显示出编辑文章页面，文章列表页面隐藏
        $('#articleEdit').show()
        $('#articleList').hide()
        let id = $(this).attr('data-id')
        // let oldfd = new FormData($(this)[0])
        // console.log(oldfd)
        // $('[name="title"]').html(fd.)
        // 调用加载文章分类的函数
        initCate()
        // 调用富文本编辑器的函数
        initEditor()
        // 调用获取文章详情的函数
        getArticle(id)

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
            let newImageURL = URL.createObjectURL(files[0])
            $image
            .cropper('destroy')
            .attr('src', newImageURL)
            .cropper(options)
        })
        // 定义文件的发布状态
        let art_state = '已发布'
        // 为存为草稿按钮绑定点击事件
        $('#btnSave').on('click', function (){
            art_state = '草稿'
        })
        //1、为表单绑定submit事件
        $('#form-edit').on('submit', function(e) {
            e.preventDefault()
            // 2、基于form表单，快速创建一个FormData对象
            let fd = new FormData($(this)[0])
            console.log(fd)
            // 3、将发布文章的state追加到fd里面去
            fd.append('Id', id)
            fd.append('state', art_state)
            fd.append('title', $('#titleEdit').val())
            fd.append('cate_id', $('[name="content"]').attr('data-id'))
            fd.append('content', $('[name="content"]').val())
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
                // console.log(11)
                articleUpdate(fd)
            })
        })
    })
    // 定义一个更新文章的方法
    function articleUpdate(fd){
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res){
                if(res.status !== 0){
                    return layer.msg('更新文章失败！')
                }
                layer.msg('更新文章成功！')
                // 调用文章列表数据函数
                initTable()
                $('#articleEdit').hide()
                $('#articleList').show()
            }
        })
    }

})