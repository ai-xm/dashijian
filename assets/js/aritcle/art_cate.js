$(function () {

    let layer = layui.layer
    let form = layui.form
    // 调用函数
    initArtCataList()
    // 获取文章分类的列表数据
    function initArtCataList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res){
                // console.log(res)
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    $('#btnAddCate').on('click', function (){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        }) 
    })


    // 点击之后才会渲染出弹出层
    // 所以通过事件委托的方法，才能代理form-add表单的事件
    $('body').on('submit', '#form-add', function (e){
        e.preventDefault()
        // console.log('1aa')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res){
                if (res.status !== 0){
                    return layer.msg('新增分类失败！')
                }
                layer.msg('新增分类成功！')
                initArtCataList()
                // 根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null
    // 通过事件委托为编辑按钮绑定事件
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章信息分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 拿到点击编辑按钮的id  ，通过data-id自定义属性
        // 通过lay-filter 的form.val()方法获取里面的内容
        let id = $(this).attr('data-id')
        // console.log(id)
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res){
                // console.log(res)
                if(res.status !== 0){
                    return layer.msg('修改文章分类失败！')
                }
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过事件委托为修改分类的表单form绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res){
                if(res.status !== 0){
                    return layer.msg('修改文章分类失败！')
                }
                layer.msg('修改文章分类成功！')
                layer.close(indexEdit)
                initArtCataList()
            }
        })
    })

    // 通过事件委托为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function (){
        // console.log(11)
        let id = $(this).attr('data-id')
        // console.log(id)
        // 询问框
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res){
                    if(res.status !== 0){
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(indexEdit)
                    initArtCataList()
                }
            })
            layer.close(index)
        })
    })
})