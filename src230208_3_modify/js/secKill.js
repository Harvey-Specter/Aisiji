const readLocalTask = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ tasks: new Array() }, function(value) {
      tasks = value.tasks;
      resolve(tasks);
    });
  });
};

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}
/**
 * 根据任务ID获取任务，执行点击
 * @param taskId
 */
async function secKill(taskId) {
  var result = false;
  var nowTime = new Date().toLocaleString();
  console.log(nowTime + "---开始秒杀！----", result);
  console.log("taskId=====" + taskId);

  var tasks = await readLocalTask();

  // console.log('readLocalTask==tasks==',tasks)
  if (tasks != undefined && tasks != null && tasks.length > 0) {
    for (var i = 0; i < tasks.length; i++) {
      if (taskId == tasks[i].id) {
        result = dealTask(tasks[i]);
        console.log("dealTask--return====", result);
        // return result
      }
    }
  }
  console.log(nowTime + "-即将返回----", result);
  chrome.runtime.sendMessage(result, function(response) {
    console.log("sendMessage----", response); // Logs 'true'
  });

  return result;
}

/**
 * 根据xPath查询节点
 * @param STR_XPATH
 * @returns {Array}
 */
function getElementsByXPath(STR_XPATH) {
  var xresult = document.evaluate(
    STR_XPATH,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  var xnodes = [];
  var xres;
  while ((xres = xresult.iterateNext())) {
    xnodes.push(xres);
  }
  return xnodes;
}

function getTinyUrl(bigurl) {
  var rsStr = $.ajax({
    type: "POST",
    url: "https://api.tinyurl.com/create",
    // headers: {
    //   "Authorization": "Bearer " + btoa(USERNAME + ":" + PASSWORD)
    // },
    beforeSend: function(xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer NG7vRR87vgS4prlbsVWf0nLEOCoU8FdCTek0FMWqjEBQpcNF3iFLHgTfHB4E"
      );
    },
    data: { url: bigurl, domain: "tiny.one" },
    success: function(rs) {
      console.log("getTinyUrl===", rs);
    },
    dataType: "json",
    async: false,
  }).responseText;

  rsObj = JSON.parse(rsStr);
  return rsObj.data.tiny_url;
}

/**
 * 处理任务
 * @param task
 */
function dealTask(task) {
  // return getTinyUrl('https://stackoverflow.com/questions/6685249/jquery-performing-synchronous-ajax-requests')

  console.log("dealTask=================0");
  var baseUrl = "https://www.hermes.com";
  var result = false;
  var count = 1;
  // var timer = setInterval(function () {
  var nowTime = new Date().toLocaleString();
  console.log(nowTime + "==" + task.name);
  var taskNames = task.name;
  // taskNamesArray = taskNames.split('|')
  // for(var i=0;i<taskNamesArray.length;i++){
  // sleep(4000)
  // task.url = "https://www.hermes.com/de/de/search/?s=" + encodeURI(taskNamesArray[i]) + "#|"

  //console.log($('iframe').contentWindow.document.find('#captcha-container'))
  var captchaIframe = $("iframe")
  // console.log('#captcha-container--html--', captcha_container.html());

  console.log('captchaIframe--', captchaIframe, captchaIframe.length);
  // return true

  if (captchaIframe.length >= 1 && captchaIframe[0].title != 'onetrust-text-resize') {
    console.log('出现拼图')
    return true
  }

  //随机取数组的一个元素
  var urlArray = ['https://www.hermes.com/de/de/product/tasche-picotin-lock-18-H056289CK18/',
    'https://www.hermes.com/de/de/product/tasche-picotin-lock-18-H056289CC18/'
  ]
  //taskurl从搜索页改到详情页
  task.url = urlArray[Math.floor((Math.random() * urlArray.length))];
  console.log('task.url===' + task.url);

  if (
    location.href.indexOf("www.hermes.com/de/de/product") < 0 &&
    location.href.indexOf("www.hermes.com/de/de/cart") < 0 &&
    location.href.indexOf("www.hermes.com/de/de/checkout") < 0 &&
    location.href.indexOf("www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token") < 0 &&
    location.href.indexOf("live.adyen.com/hpp/checkout") < 0 &&
    location.href != task.url
  ) {
    location.href = task.url;
  } else if (location.href.indexOf("www.hermes.com/de/de/product") >= 0) {
    sleep(1000);
    console.log('.button-base.button-primary.size-large--------', $(".button-base.button-primary.size-large").html());
    // return
    // 判断 .button-base.button-primary.size-large 是否存在
    if ($(".button-base.button-primary.size-large").html() && $(".button-base.button-primary.size-large").html() != null && typeof $(".button-base.button-primary.size-large").html() != 'undefined') {
      // console.log('formHtml====', $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').html())
      // $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').submit()
      console.log(
        "button-base.button-primary.size-large====",
        $(".button-base.button-primary.size-large").html()
      );
      $(".button-base.button-primary.size-large").click();
      sleep(2000);
      location.href = "https://www.hermes.com/de/de/cart/";
    } else {
      //如果不存在返回首页重新再来
      var delay = Math.random() * 22000 + 10000;
      sleep(delay);
      location.href = "https://www.hermes.com/de/de/";
    }

  } else if (location.href.indexOf("www.hermes.com/de/de/cart") >= 0) {
    console.log("in cart sleep 3s");
    sleep(2000);
    $(".button-base.button-primary.size-large").click();
  } else if (location.href.indexOf("www.hermes.com/de/de/checkout") >= 0) {
    console.log("in checkout sleep 2s");
    sleep(1000);
    $(".button-base.button-primary.size-large").click();
    sleep(500);
    $("#radio-button-payment_method-1-input").click();
    sleep(400);
    $("#checkbox-gtc").click();
    sleep(300);
    $(".button-base.button-primary.size-large").click();
  } else if (
    location.href.indexOf(
      "www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token"
    ) >= 0
  ) {
    // https: //www.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout&token=EC-4LU49972UF121545S
    var payUrl = location.href;
    console.log("payUrl====", payUrl);
    return getTinyUrl(payUrl);
    //return payUrl
  } else {
    var mainTitle = $(".main-title");
    if (mainTitle && mainTitle.html().indexOf("Hoppla") >= 0) {
      //
      console.log("没找到--");
      task.result = nowTime + " 没找到";
      // if(taskNamesArray.length==1){

      //原来是刷新,现在改成返回首页,防止block
      //location.reload();
      var delay = Math.random() * 15000 + 5000;
      sleep(delay);
      location.href = "https://www.hermes.com/de/de/";
      // }else{
      //   continue
      // }
      result = false;
    } else {
      console.log("ok");
      task.result = nowTime + " OK";
      // clearInterval(timer)
      console.log($(".grid-container .product-item a:first").attr("href"));
      var phref = $(".grid-container .product-item a:first").attr("href");
      location.href = baseUrl + phref;
      //   console.log('formHtml====', $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').html())
      //   $('.simple-product-selector.ng-untouched.ng-pristine.ng-valid').submit()
      result = true;
    }
    // count++;
    // if(count>task.count) {
    //     clearInterval(timer);
    // }
  }
  if (result == true) {
    return result;
  }
  // }
  // token:NG7vRR87vgS4prlbsVWf0nLEOCoU8FdCTek0FMWqjEBQpcNF3iFLHgTfHB4E
  return result;
  // }, task.frequency);
}