// 注意：每次调用$.get()、$.post()或者$.ajax()的时候
// 会先调用ajaxPREfilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // console.log(options.url)

    // 统一为有权限的接口，设置headers请求头
    // 但是只需要给有需要权限的接口使用
    // indexOf返回字符串第一次出现的位置，若没有出现返回-1
    // indexOf返回某个值在数组中第一次出现的索引，若没有出现返回-1
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 不论成功还是失败，都会调用complete回调函数
    options.complete = function (res) {
        // console.log(res)
        // 在complete函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = './login.html'
        }
    }
    
})