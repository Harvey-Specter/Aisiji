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

  //https://live.adyen.com/hpp/checkout.shtml?u=redirectPayPal&p=eJyFVlt3qjoQ-jX64pIFwQs*5MFbt566bZf10u6Xrgij5gghTQJu**vPgGhbb8fFApz5MpnbN4FJGXKfGR6LoVjFVsiXiqn9mEVAWbAHURVxAFUmebVQldn1JXNQGkXUIZZt2eUlD0Mu1u0gUKC15XOzp53*ZDQcX6jiRBi1p73*uUbG2rCwiw5Q4jjN1rketQae1LOKUy58oB1QqL5EKQBDOyyJtL9JQhAoYaWuW2o9QKV2bnW6l7hdGWMSQb61ZHvJwnLhZi5CV-1EKRD*4X9-NikHEPIU1P5nxAePLnRfIZ*rLmI*B9wI*hL2P1GfLSjCjkD5GyZM2899pANQEej*7KQYCgNrlVffMtma7qDffXyaTd9-9cf9ybB7FZkWzdFondRPKgA1gRVkaQRatx3Xa3le-QS4rzOJEj1mGH19aC5e54vXx8n0cTFvfYXwwtfUXQSyE83fFnNNWs6uNpD1h8FbsvuY7df7iWakl36myZaR2brk9nCpYQEatUCkVKqgHEsQXKQx9yGXY6bBsS5qfx0WgPYVl1kC6JRhFaDSZUumK4MKiEqHM64rNfvGYm4gakd5Dequjb87uGFAB7ZHWqTWbbe7d4BzZgqb98wh6hlzCMKwNdxEiiRagnpaDXGFps4NVMpMF-t1HWO3j2MBF7CjmRHCMzPItgh3-hm6AgnMVGNRNTyCODHUqARQrGeTEd0YI3XJbZfIA16YZn*LEL2JpQRVzbrcykcZ0i66BKBEg0rRH42vz4fthwKxOBMmEHAFvkFN6uAtjH0WFpjfYDZxUHIfzjiDjXRkTYk0VN6p6CaKD46SeuZqPXMWb7vdztrk8IN7KArg*6NISDVlIQ9yNuXijZRlxfU2TyI21RZMXjzbYnnqsIJZZU4ZvArNh1zB8RsQ-1i9ru3egsRhrGg2WtotXyWYpiXwNWTPEJKKzDUkzAQrxaJlzPWP91tmC5blDLsOyZu-Rwlp1Jq202zcgEVMJCvmYyFA3Y9WqjhIfDPlJoR7nL2**iPBLsjGvnMDoPkn0PHT*8vwT-8WZJv8IPN1VCL966jjVD80J*0VfyvMVDZx9C3VXD8J6OJBvi3ama5Y*L0WesOlRAoUlmbPL5Vq5cVgwzAcjBqPDGzFedaUWcTEJm7VJnhNbQ*56Dp4qzX*lAuWWSuutMk-K0b8JFyDwEOA-m6P*idZyE64QSzWJ7mBEOQGR8g4nxjUazj1Rs0mLbdl14*ofsR4iP1Q9xy7RhxSqtkfHxmxjoDsUFLYCtlM7qM84y4claOM3UADeO*d-Pk6hRzcy-PchndUFUem3nJx*FBIllZKLNJwas2G03RI03WwRNaf3QIem9O3Dfv41fnHlra79N5fPz95u16b--2rB--6crVYkeW0XdYmVkA91-4P8sptTA

  if (location.href.indexOf('www.hermes.com/de/de/product') < 0 &&
    location.href.indexOf('www.hermes.com/de/de/cart') < 0 &&
    location.href.indexOf('www.hermes.com/de/de/checkout') < 0 &&
    location.href.indexOf('www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token') < 0 &&
    location.href.indexOf('live.adyen.com/hpp/checkout') < 0 &&
    location.href != task.url) {

    location.href = task.url
  } else if (location.href.indexOf('www.hermes.com/de/de/product') >= 0) {
    sleep(2000)
    // console.log('formHtml====', $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').html())
    // $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').submit()
    console.log('button-base.button-primary.size-large====', $(".button-base.button-primary.size-large").html())
    $(".button-base.button-primary.size-large").click()
    sleep(2000)
    location.href = 'https://www.hermes.com/de/de/cart/'
  } else if (location.href.indexOf('www.hermes.com/de/de/cart') >= 0) {

    console.log('in cart sleep 3s')
    sleep(3000)
    $('.button-base.button-primary.size-large').click()

  } else if (location.href.indexOf('www.hermes.com/de/de/checkout') >= 0) {

    console.log('in checkout sleep 2s')
    sleep(2000)
    $('.button-base.button-primary.size-large').click()
    sleep(500)
    $('#radio-button-payment_method-1-input').click()
    sleep(400)
    $('#checkbox-gtc').click()
    sleep(300)
    $('.button-base.button-primary.size-large').click()

  } else if (location.href.indexOf('www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token') >= 0) {
    // https: //www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token=EC-4LU49972UF121545S
    var payUrl = location.href
    console.log('payUrl====', payUrl)
    return payUrl
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