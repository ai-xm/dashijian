$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // console.log(options.url)
})