//消息窗口ID
var dialogId = 0;

//需要打开激活的url
var tasks = null;

//旧的循环器
var oldTimer = null;

//检查准备工作URL自动打开（账号登录 商品规格选择 手工）
var tickTime = 120000; //120000 2分钟

//popup页面更新时间
chrome.extension.onConnect.addListener(function (port) {
  console.log("Connected .....");
  port.onMessage.addListener(function (msg) {
    console.log("收到前台时间更新：" + msg);
    processTask(msg);
    port.postMessage("时间更新成功");
  });
});

var callback = function () {
  // Do something clever here once data has been removed.
  console.log("clear all cache finish");
};

function clearCache(weeks) {
  var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7 * weeks;
  var tenWeekAgo = new Date().getTime() - millisecondsPerWeek;
  // console.log("chrome---", chrome);
  chrome.browsingData.remove(
    {
      since: tenWeekAgo,
    },
    {
      appcache: true,
      cache: true,
      cacheStorage: true,
      cookies: true,
      downloads: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      passwords: true,
      serviceWorkers: true,
      webSQL: true,
    },
    callback
  );
}
/**
 * 每隔500ms去检查任务,异步处理任务
 */
function processTask(standerTime) {
  console.log("后端开启轮寻任务---------！");

  var timer = setInterval(function () {
    standerTime += 500;
    chrome.storage.local.get({ tasks: new Array() }, function (value) {
      tasks = value.tasks;
      if (tasks != undefined && tasks.length > 0) {
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].status == 0) {
            if (
              new Date(tasks[i].killTime) - standerTime >= tickTime &&
              new Date(tasks[i].killTime) - standerTime <= tickTime + 600
            ) {
              console.log(
                formatDateTime(new Date(tasks[i].killTime).getTime())
              );
              var task = tasks[i];
              //秒杀开始提醒（检查是否打开相关标签页）没有提示打开
              chrome.tabs.query({ url: task.url }, function (results) {
                if (results.length == 0) {
                  chrome.notifications.create("openLinkNotify-" + task.id, {
                    type: "basic",
                    iconUrl: "image/link.png",
                    title: "秒杀助手提醒",
                    message:
                      task.name +
                      "\n任务将在2分钟后开始，抢购页面尚未打开，是否前往相关页面！",
                    buttons: [{ title: "打开抢购页面" }, { title: "忽略" }],
                  });
                } else {
                  var noActive = true;
                  for (var j = 0; j < results.length; j++) {
                    if (results[j].active) {
                      noActive = false;
                    }
                  }
                  if (noActive) {
                    //已经打开但是未激活
                    chrome.notifications.create("activeTabNotify-" + task.id, {
                      type: "basic",
                      iconUrl: "image/bell.png",
                      title: "秒杀助手提醒",
                      message:
                        task.name +
                        "\n将在2分钟后开始，请检查登录及商品规格选择验证码等！",
                      buttons: [
                        { title: "切换Tab抢购页面" },
                        { title: "忽略" },
                      ],
                    });
                  } else {
                    //已经打开且激活
                    var opt = {
                      type: "basic",
                      title: "秒杀助手提醒",
                      message:
                        task.name +
                        "\n将在2分钟后开始，请检查登录及商品规格选择验证码等！",
                      iconUrl: "image/bell.png",
                    };
                    chrome.notifications.create(dialogId++ + "", opt);
                  }
                }
              });
            }
            // if((new Date(tasks[i].killTime) - standerTime) >= 0 && (new Date(tasks[i].killTime) - standerTime) <= 600){
            console.log(
              new Date().toLocaleString(),
              new Date(tasks[i].killTime) - standerTime
            ); //43,860,983
            if (new Date(tasks[i].killTime) - standerTime >= -86400000) {
              //异步执行点击事件
              var task = tasks[i];
              var tabId = null;
              chrome.tabs.query({ url: task.url }, function (results) {
                if (results.length > 0) {
                  for (var j = 0; j < results.length; j++) {
                    if (results[j].active) {
                      tabId = results[j].id;
                    }
                  }
                  if (tabId == null) {
                    tabId = results[0].id;
                  }
                }
                var thisTimer = timer;
                clearCache(10);
                chrome.tabs.executeScript(
                  tabId,
                  { code: "secKill(" + task.id + ");" },
                  async (emptyPromise) => {
                    // Create a promise that resolves when chrome.runtime.onMessage fires
                    console.log("emptyPromise=====");
                    const message = new Promise((resolve) => {
                      const listener = (request) => {
                        chrome.runtime.onMessage.removeListener(listener);
                        resolve(request);
                      };
                      chrome.runtime.onMessage.addListener(listener);
                    });

                    const result = await message;
                    console.log("executeScript-result==", result); // Logs true

                    if (result == true) {
                      //console.log('暂时结束循环-以后要注释掉')
                      console.log("暂时结束循环-以后要注释掉");
                      clearInterval(thisTimer);
                      //------------------

                      console.log("查到了");
                      var opt = {
                        type: "basic",
                        title: "提醒",
                        message: task.name + "\nOK！",
                        iconUrl: "image/bell.png",
                      };
                      chrome.notifications.create(dialogId++ + "", opt);
                    } else if (
                      result &&
                      (result.indexOf("pay") > -1 ||
                        result.indexOf("tiny.one") > -1)
                    ) {
                      var opt = {
                        type: "basic",
                        title: "支付地址！ ",
                        message: task.name + "\n" + result,
                        iconUrl: "image/bell.png",
                      };
                      chrome.notifications.create(dialogId++ + "", opt);
                      alert("executeScript-finish=支付地址！  \n" + result);
                      console.log("executeScript-finish=支付地址！  ", result);
                      clearInterval(thisTimer);
                    } else {
                      console.log("BG没找到");
                    }
                  }
                );
              });
            }
          }
        }
      }
    });
  }, Math.random() * 10000 + 10000);
  if (oldTimer != null) {
    clearInterval(oldTimer);
  }
  oldTimer = timer;
}

/* Respond to the user's clicking one of the buttons */
chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
  if (notifId.startsWith("openLinkNotify-")) {
    if (btnIdx === 0) {
      var taskId = notifId.split("-")[1];
      for (var i = 0; i < tasks.length; i++) {
        if (taskId == tasks[i].id) {
          chrome.tabs.create({ url: tasks[i].url });
          chrome.notifications.clear(notifId);
        }
      }
    } else if (btnIdx === 1) {
      chrome.notifications.clear(notifId, function () {
        console.log("忽略本次秒杀！");
      });
    }
  }
  if (notifId.startsWith("activeTabNotify-")) {
    if (btnIdx === 0) {
      var taskId = notifId.split("-")[1];
      for (var i = 0; i < tasks.length; i++) {
        if (taskId == tasks[i].id) {
          chrome.tabs.query({ url: tasks[i].url }, function (results) {
            chrome.tabs.update(results[0].id, { active: true }, function () {
              console.log("抢购页面被激活！");
            });
            chrome.notifications.clear(notifId);
          });
        }
      }
    } else if (btnIdx === 1) {
      chrome.notifications.clear("openLinkNotify", function () {
        console.log("抢购页面未被激活！");
        chrome.notifications.clear(notifId);
      });
    }
  }
});

/**
 * 日期格式化
 * @param inputTime
 * @returns {string}
 */
function formatDateTime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
}

processTask(new Date().getTime());
