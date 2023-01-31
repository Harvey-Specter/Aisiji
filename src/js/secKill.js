const readLocalTask = async () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({"tasks": new Array()}, function(value) {
            tasks = value.tasks;
            resolve(tasks)     
        });
    });
};

/**
 * 根据任务ID获取任务，执行点击
 * @param taskId
 */
async function secKill(taskId) {
    var result = false
    var nowTime = new Date().toLocaleString()
    console.log(nowTime+"-开始秒杀！----",result);
    console.log(taskId);
    // result = readLocalTask;
    // return result;

    // chrome.storage.local.get({"tasks": new Array()}, function(value) {
    //     tasks = value.tasks;
    //     if(tasks != undefined && tasks != null && tasks.length > 0) {
    //         for(var i=0; i<tasks.length; i++) {
    //             if(taskId == tasks[i].id) {
    //                 result = dealTask(tasks[i]);
    //                 return result 
    //             }
    //         }
    //     }
    // });

    var tasks = await readLocalTask();
    
    // console.log('readLocalTask==tasks==',tasks)
    if(tasks != undefined && tasks != null && tasks.length > 0) {
        for(var i=0; i<tasks.length; i++) {
            if(taskId == tasks[i].id) {
                result = dealTask(tasks[i]);
                console.log('dealTask--return====',result);
                // return result 
            }
        }
    }
    console.log(nowTime+"-即将返回----",result);
    chrome.runtime.sendMessage(result, function (response) {
        console.log('sendMessage----',response); // Logs 'true'
    });

   return result 
}

/**
 * 根据xPath查询节点
 * @param STR_XPATH
 * @returns {Array}
 */
function getElementsByXPath(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }
    return xnodes;
}

/**
 * 处理任务
 * @param task
 */
function dealTask(task) {
    var result = false
    var count = 1;
    // var timer = setInterval(function () {
        var nowTime = new Date().toLocaleString()
        console.log(nowTime+"=="+count)
        // if(task.selector == "jQuery") {
        //     $(task.location).each(function(){
        //         this.click();
        //     });
        // } else {
        //     $(getElementsByXPath(task.location)).each(function(){
        //         this.click();
        //     });
        // }
        // console.log(nowTime+' dealTask')
        if(location.href!=task.url){
            location.href = task.url
        }else{
            var mainTitle = $(".main-title") 
            // var captcha = $(".captcha__human__title")
            // if(captcha.html().indexOf('禁止')>=0){
            //     console.log('禁止访问-休息五分钟')
            //     console.log(mainTitle.html())
            //     // setTimeout(function(){
            //     //     //doSomething(这里写时间到之后需要去做的事情)
            //     //     console.log(mainTitle.html())
            //     // }, 300000);
            // }else 
            if(mainTitle && mainTitle.html().indexOf('Hoppla')>=0 ){ //
                console.log('没找到')
                task.result =nowTime+ ' 没找到'
                location.reload();
                result= false
            }else{
                console.log('ok')
                task.result = nowTime+' OK'
                // clearInterval(timer)
                result= true
            }
            // count++;
            // if(count>task.count) {
            //     clearInterval(timer);
            // }
        }
        return result
    // }, task.frequency);

}