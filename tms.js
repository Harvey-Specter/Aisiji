// ==UserScript==
// @name         Ams
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://hermes.com/d*
// @match        *://www.hermes.com/d*
// @match        *://pan.baidu.com/disk*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
  'use strict';

  var urlArray = ['https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CK37/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CC37/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CC18/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CK18/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CK89/',
    'https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CC89/',
    'https://www.hermes.com/de/de/product/tasche-cabas-h-en-biais-40-H082924CAAC/'
  ]

  function doTask() {
    var currUrl = location.href
    console.log('currUrl====', currUrl)
    // if($('.title-large.ng-star-inserted').html()
    if (urlArray.indexOf(currUrl) > -1) {
      alert('已经进入官网指定商品页，点击确定开始任务')
      for (var i = 0; i < urlArray.length; i++) {
        sleep(30000);
        if (currUrl != urlArray[i]) {
          location.href = urlArray[i]
        }
        if ($('.title-large.ng-star-inserted').html().indexOf('Hoppla!') > -1) {
          console.log('Hoppla! 没有货');
        } else {

        }
        if (i == urlArray.length - 1) {
          i = 0
        }
      }
    }

  }

  function buyFlow() {
    console.log('WOW! 有货');
    sleep(1000)
    buttonClass = '.button-base.button-primary.size-large'
    $(buttonClass).click()
    sleep(2000)
    location.href = 'https://www.hermes.com/de/de/cart/'
  }

  function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      continue;
    }
  }
  //  function loopUrls(){    }

  doTask();

  function test() {
    console.log('Ams_hello')
  }

})();