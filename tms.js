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
    var currUrl = window.href

    // if($('.title-large.ng-star-inserted').html()
    if (urlArray.indexOf().currUrl > -1) {

    }
  }

  function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      continue;
    }
  }
  //  function loopUrls(){    }

  test();

  function test() {
    console.log('Ams_hello')
    alert('已经进入官网，点击确定')
  }

})();