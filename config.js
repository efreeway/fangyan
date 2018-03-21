/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host =  '你自己的host地址'; //自己的host域名不带http前缀的，如：abc.edg.com

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `https://${host}/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/user`,

        // 测试的信道服务地址
        tunnelUrl: `https://${host}/tunnel`,

        // 测试的请求地址，用于测试会话
        textUrl: `https://${host}/text`,

        //查询声音文件的地址
        voicesUrl: `https://${host}/voices`, 

        //声音文件下载目录
        voicesDownloadUrl: `https://${host}/uploads/`,

        //声音文件上传目录
        recSubmitUrl: 'https://${host}/index.php/upload',

        //提交评论地址
        reviewUrl: `https://${host}/review`,
        
        //提交评论地址
        themesUrl: `https://${host}/themes`,

         //提交评论地址
        usrvoicesUrl: `https://${host}/uservoices`,       
        
        getOpenidUrl: `https://${host}/getopenid`,
        //
        uploadUrl: `https://${host}/upload/do_upload`,
    }
};

module.exports = config;