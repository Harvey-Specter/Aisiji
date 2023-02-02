const readLocalTask = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ "tasks": new Array() }, function(value) {
      tasks = value.tasks;
      resolve(tasks)
    });
  });
};

function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}
/**
 * 根据任务ID获取任务，执行点击
 * @param taskId
 */
async function secKill(taskId) {
  var result = false
  var nowTime = new Date().toLocaleString()
  console.log(nowTime + "---开始秒杀！----", result);
  console.log('taskId=====' + taskId);

  var tasks = await readLocalTask();

  // console.log('readLocalTask==tasks==',tasks)
  if (tasks != undefined && tasks != null && tasks.length > 0) {
    for (var i = 0; i < tasks.length; i++) {
      if (taskId == tasks[i].id) {
        result = dealTask(tasks[i]);
        console.log('dealTask--return====', result);
        // return result 
      }
    }
  }
  console.log(nowTime + "-即将返回----", result);
  chrome.runtime.sendMessage(result, function(response) {
    console.log('sendMessage----', response); // Logs 'true'
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

  console.log('dealTask=================0')
  var baseUrl = 'https://www.hermes.com'
  var result = false
  var count = 1;
  // var timer = setInterval(function () {
  var nowTime = new Date().toLocaleString()
  console.log(nowTime + "==" + location.href.indexOf('www.hermes.com/de/de/product'))

  if (location.href.indexOf('www.hermes.com/de/de/product') < 0 && location.href != task.url) {
    location.href = task.url
  } else if (location.href.indexOf('www.hermes.com/de/de/product') >= 0) {
    // console.log('formHtml====', $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').html())
    // $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').submit()
    $(".button-base.button-primary.size-large").click()
  } else if (location.href.indexOf('www.hermes.com/de/de/cart') >= 0) {
    console.log('in cart ')
  } else {
    var mainTitle = $(".main-title")
    if (mainTitle && mainTitle.html().indexOf('Hoppla') >= 0) { //
      console.log('没找到')
      task.result = nowTime + ' 没找到'
      location.reload();
      result = false
    } else {
      console.log('ok')
      task.result = nowTime + ' OK'
      // clearInterval(timer)

      console.log($('.grid-container .product-item a:first').attr('href'))
      var phref = $('.grid-container .product-item a:first').attr('href')

      location.href = baseUrl + phref
      //   console.log('formHtml====', $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').html())
      //   $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').submit()

      result = true
    }
    // count++;
    // if(count>task.count) {
    //     clearInterval(timer);
    // }
  }
  return result
  // }, task.frequency);

}