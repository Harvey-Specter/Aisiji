$(function() {
  window.applyDiff = applyDiff;
  $('title').text('Difference');
  $('#diff_in_progress').text('Diff in progress');
  // try {
  //   initiateDiff(atob(window.location.hash.substr(1)));
  // } catch (e) {
  //   alert(chrome.i18n.getMessage('diff_error') + '\n\n' +
  //         e.message + '\n' + e.stack);
  // }
});
