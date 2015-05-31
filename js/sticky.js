'use strict';
(function($) {
  $.fn.sticky = function(options) {
    if (typeof options === 'undefined') {
      options = {};
    }
    var _top = 0;
    if (typeof options.top !== 'undefined') {
      _top = parseInt(options.top);
    }
    var that = $(this);
    var top = that.offset().top - _top;
    var width = that.outerWidth();
    $(window).scroll(function () {
      var scrolltop = $(window).scrollTop();
      if (scrolltop > top) {
        that.css('position', 'fixed');
        that.css('top', _top+'px');
        that.css('width', width + 'px');
      } else {
        that.removeAttr('style');
      }
    });
  };
})($);
