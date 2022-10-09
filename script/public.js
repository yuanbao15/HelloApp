/**
 *Public funtions 
 */
function pingNetWork(params){
    
    
    var url = params.url;
    if(url == ''){
        api.toast({msg:'请求url为空！'});
        return;
    }
    
    var sizeCmd  = params.sizeCmd ;
    if(sizeCmd == ''){
         sizeCmd = '32';
    }
    
    var timeCmd   = params.timeCmd ;
    if(timeCmd == ''){
         timeCmd = '0.5';
    }
    
    var timeOut    = params.timeOut  ;
    if(timeOut == ''){
         timeOut = '5';
    }
    
    var modulePing = api.require('modulePing');

    modulePing.pingtest({
         ip: url,
         sizeCmd :sizeCmd,   
         timeCmd :timeCmd,   //时间隔
         timeOut :timeOut,   //超时时间
    }, function(ret, err){
        if(ret){
            if(ret.okNum > 0){
                api.toast({
                     msg:'服务器异常'
                });
            }else{
                api.toast({
                     msg:'网络不通'
                });
            }
        }else{
            alert(JSON.stringify(err));
        }
    });
}

function ajaxForData(params,data,isshow,callback){
    var url = params.url;
    if(url == ''){
        api.toast({msg:'请求url为空！'});
        return;
    }
    
    var method = params.method;
    if(method == ''){
        api.toast({msg:'请求method为空！'});
        return;
    }
    
    var dataType = params.dataType;
    if(dataType == ''){
        api.toast({msg:'请求dataType为空！'});
        return;
    }
    
    var encode = params.encode;
    if(encode == ''){
        encode = true;
    }
    
    var tag = params.tag;
    if(tag == ''){
        tag = 'normal';
    }
    
    var timeout = params.timeout;
    if(timeout == ''){
        timeout = 30;
    }
    
    var cache = params.cache;
    if(cache == ''){
        cache = false;
    }
    
    var charset = params.charset;
    if(charset == ''){
        charset = 'utf-8';
    }
    
    var report = params.report;
    if(report == ''){
        report = false;
    }
    
    var returnAll = params.returnAll;
    if(returnAll == ''){
        returnAll = false;
    }
    
    if(isshow){
        api.showProgress();
    }
    console.log(url);
    api.ajax({
        url: url,
        encode: encode,
        tag: tag,
        method: method,
        cache:cache,
        timeout: timeout,
        dataType: dataType,
        charset:charset,
        report:report,
        returnAll: returnAll,
        data: data
    }, function (ret, err) {
        if(isshow){
            api.hideProgress();
        }
        console.log(JSON.stringify(ret));
        if(ret == ''){
        	var params = new Object();
        	params.url = localStorage.getItem('serverIpN');
            pingNetWork(params);
            return;
        }   
        
        var retObj = ret;
        var rettype = typeof(ret);
        if(rettype == 'string'){
            retObj = eval("("+ret+")");
        }

        if(retObj.type == 'success'){
            if(callback){
                callback(retObj, err);
            }
        }else{
            api.toast({
                msg:ret.data,
                duration:3000
            });
        }
    });
}