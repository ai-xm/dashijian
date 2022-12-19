$(function () {
    // 自定义校验规则
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value) {
            if(value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    // 调用函数
    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res)
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据按钮的监听事件
    $('#btnReset').on('click', function (e) {
        // 阻止默认的按钮行为
        e.preventDefault()
        // 重新调用初始化用户的基本信息函数
        initUserInfo()
    })

    // 监听表单的提交按钮事件
    $('.layui-btn').on('click', function (e) {
        // 阻止默认的提交行为
        e.preventDefault()
        // 发起post请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 注意：这里的数据是要获取表单的值，而$(this)获取的表单的值是在改变之前的值
            // 所以我们可以用layui中获取表单值得方法，也就是form.val(''),这是获取修改提交之后的表单值
            // data: $(this).serialize(),
            data: form.val('formUserInfo'),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // console.log(form.val('formUserInfo'))
                // 调用父页面中的方法，重新渲染用户的昵称和头像
                // window表示当前页面的窗口，找到它的父页面，然后调用函数
                window.parent.getUserInfo()
            }
        })
    })
})