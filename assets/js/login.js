$(function () {
    // 点击“去注册账号”链接
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })

    // 点击“去登录”链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 校验规则
    // 从layui中获取form对象
    let form = layui.form
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd校验规则
        pwd:[
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
          ], 
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等号判断
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) return '两次密码不一致！'
        }
    })


    // 监听注册表达的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认的提交行为
        e.preventDefault()
        let data =  {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
            }
        // 发起ajax的post请求
        $.post('/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } else {
                    layer.msg('注册成功，请登录！')
                    $('#link_login').click()
                } 
            }
        )
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认的提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单的数据
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    // console.log(message)
                    return layer.msg('登录失败')
                }
                layer.msg('登陆成功！')
                // console.log(res.token)
                // 将登录成功得到的token字符串，保存到localStorage里面，方便后面使用
                localStorage.setItem('token', res.token)
                // 跳转到主页
                location.href = '/index.html'

            }
        })
    })
})