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

function getTinyUrl(bigurl) {
  var rsStr = $.ajax({
    type: "POST",
    url: 'https://api.tinyurl.com/create',
    // headers: {
    //   "Authorization": "Bearer " + btoa(USERNAME + ":" + PASSWORD)
    // },
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer NG7vRR87vgS4prlbsVWf0nLEOCoU8FdCTek0FMWqjEBQpcNF3iFLHgTfHB4E');
    },
    data: { url: bigurl, domain: "tiny.one" },
    success: function(rs) {
      console.log('getTinyUrl===', rs)
    },
    dataType: 'json',
    async: false,
  }).responseText;

  rsObj = JSON.parse(rsStr);
  return rsObj.data.tiny_url
}

function putInCart() {
  sleep(1000)
  buttonClass = '.button-base.button-primary.size-large'
  // console.log('button-base.button-primary.size-large====', $(".button-base.button-primary.size-large").html())
  $(buttonClass).click()
  sleep(2000)

  location.href = 'https://www.hermes.com/de/de/cart/'
}

/**
 * 监控详情页任务
 * @param task
 */
function detailPageTask(task) {

  var productUrls = ['https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CK37/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CC37/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CC18/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CK18/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CK89/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CC89/',
    'https://www.hermes.com/de/de/product/tasche-cabas-h-en-biais-40-H082924CAAC/'
  ]

  // return getTinyUrl('https://stackoverflow.com/questions/6685249/jquery-performing-synchronous-ajax-requests')
  console.log('dealTask=================0')
  var baseUrl = 'https://www.hermes.com'
  var productUrl = 'www.hermes.com/de/de/product'
  var cartUrl = 'www.hermes.com/de/de/cart'
  var checkoutUrl = 'www.hermes.com/de/de/checkout'
  var payUrl = 'www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token'
  var adyen = 'live.adyen.com/hpp/checkout'

  var result = false
  var nowTime = new Date().toLocaleString()
  console.log(nowTime + "==" + task.name)
  for (var i = 0; i < productUrls.length; i++) {
    sleep(40000)
    task.url = "https://www.hermes.com/de/de/search/?s=" + encodeURI(taskNamesArray[i]) + "#|"

    if (location.href.indexOf(productUrl) < 0 && location.href.indexOf(cartUrl) < 0 && location.href.indexOf(checkoutUrl) < 0 &&
      location.href.indexOf(payUrl) < 0 && location.href.indexOf(adyen) < 0 && location.href != task.url) {

      location.href = task.url
    } else if (location.href.indexOf(productUrl) >= 0) {
      putInCart()
    } else if (location.href.indexOf(cartUrl) >= 0) {

      console.log('in cart sleep 3s')
      sleep(2000)
      $('.button-base.button-primary.size-large').click()

    } else if (location.href.indexOf(checkoutUrl) >= 0) {
      console.log('in checkout sleep 2s')
      sleep(1000)
      $('.button-base.button-primary.size-large').click()
      sleep(500)
      $('#radio-button-payment_method-1-input').click()
      sleep(400)
      $('#checkbox-gtc').click()
      sleep(300)
      $('.button-base.button-primary.size-large').click()
    } else if (location.href.indexOf(payUrl) >= 0) {
      var payUrl = location.href
      console.log('payUrl====', payUrl)
      return getTinyUrl(payUrl)
      //return payUrl
    } else {
      var mainTitle = $(".main-title")
      if (mainTitle && mainTitle.html().indexOf('Hoppla') >= 0) { //
        console.log('没找到--')
        task.result = nowTime + ' 没找到'
        // if(taskNamesArray.length==1){
        location.reload();
        // }else{
        //   continue
        // }
        result = false
      } else {
        console.log('ok')
        task.result = nowTime + ' OK'
        console.log($('.grid-container .product-item a:first').attr('href'))
        var phref = $('.grid-container .product-item a:first').attr('href')
        location.href = baseUrl + phref
        result = true
      }
    }
    if (result == true) {
      return result
    }
  }
  return result
}
/**
 * 处理任务
 * @param task
 */
function dealTask(task) {

  // return getTinyUrl('https://stackoverflow.com/questions/6685249/jquery-performing-synchronous-ajax-requests')
  console.log('dealTask=================0')
  var baseUrl = 'https://www.hermes.com'
  var productUrl = 'www.hermes.com/de/de/product'
  var cartUrl = 'www.hermes.com/de/de/cart'
  var checkoutUrl = 'www.hermes.com/de/de/checkout'
  var payUrl = 'www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token'
  var adyen = 'live.adyen.com/hpp/checkout'

  var result = false
  var count = 1;
  // var timer = setInterval(function () {
  var nowTime = new Date().toLocaleString()
  console.log(nowTime + "==" + task.name)
  var taskNames = task.name
  // taskNamesArray = taskNames.split('|')
  // for(var i=0;i<taskNamesArray.length;i++){
  // sleep(4000)
  // task.url = "https://www.hermes.com/de/de/search/?s=" + encodeURI(taskNamesArray[i]) + "#|"

  if (location.href.indexOf(productUrl) < 0 && location.href.indexOf(cartUrl) < 0 && location.href.indexOf(checkoutUrl) < 0 &&
    location.href.indexOf(payUrl) < 0 && location.href.indexOf(adyen) < 0 && location.href != task.url) {

    location.href = task.url
  } else if (location.href.indexOf(productUrl) >= 0) {
    putInCart()
  } else if (location.href.indexOf(cartUrl) >= 0) {

    console.log('in cart sleep 3s')
    sleep(2000)
    $('.button-base.button-primary.size-large').click()

  } else if (location.href.indexOf(checkoutUrl) >= 0) {
    console.log('in checkout sleep 2s')
    sleep(1000)
    $('.button-base.button-primary.size-large').click()
    sleep(500)
    $('#radio-button-payment_method-1-input').click()
    sleep(400)
    $('#checkbox-gtc').click()
    sleep(300)
    $('.button-base.button-primary.size-large').click()
  } else if (location.href.indexOf(payUrl) >= 0) {
    var payUrl = location.href
    console.log('payUrl====', payUrl)
    return getTinyUrl(payUrl)
    //return payUrl
  } else {
    var mainTitle = $(".main-title")
    if (mainTitle && mainTitle.html().indexOf('Hoppla') >= 0) { //
      console.log('没找到--')
      task.result = nowTime + ' 没找到'
      // if(taskNamesArray.length==1){
      location.reload();
      // }else{
      //   continue
      // }
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
  if (result == true) {
    return result
  }
  // }
  // token:NG7vRR87vgS4prlbsVWf0nLEOCoU8FdCTek0FMWqjEBQpcNF3iFLHgTfHB4E
  return result
  // }, task.frequency);

}