$(function () {

    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '不能与原密码相同！'
            }
        },
        rePwd: function (value) {
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: form.val('formUserPwd'),
            // data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layui.layer.msg('修改密码失败！')
                }
                layui.layer.msg('修改成功！')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})