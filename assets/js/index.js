$(function () {
    getUserInfo()

    // 用户点击退出
    // 为退出绑定监听事件
    let layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, 
            function(index){
            // 退出的时候，要清空本地存储的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = './login.html'
            // 关闭confirm询问框
            layer.close(index)
        });
    })
})
// 封装获取用户信息的Ajax函数
function getUserInfo () {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 从本地获取用户身份认证的字符串
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        // 请求成功的回调函数
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            console.log(res)
            // 渲染用户的头像, 注意一定要传参数进去
            renderAvatar(res.data)
        }
    })
}

// 封装渲染用户头像的函数
// 注意这里的user是形参，调函数的时候一定要传参
function renderAvatar (user) {
    // 获取 用户的名称
    let name = user.nickname || user.username
    // 设置文本
    $('#welcome').html(`欢迎${name}`)
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 如果用户有头像，就渲染用户图片头像
        $('.layui-nav-img').attr('scr', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 用户没用图片头像，渲染成文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').show().html(first)
    }
}