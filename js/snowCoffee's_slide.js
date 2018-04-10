(function($){

  "use strict";

  $.fn.snowCoffee = function(options){

    var defaults = $.extend({
      slideWidth: '100%',
      slideTime: 350,
      autoPlayTime: 2000,
      autoPlay: false,
      loop: false
    }, options);

    // defaults
    var options = {
      slideWidth: defaults.slideWidth,
      slideTime: defaults.slideTime,
      autoPlayTime: defaults.autoPlayTime,
      autoPlay: defaults.autoPlay,
      loop: defaults.loop
    };

   // selectors
    var $sWrap = $('.slide_wrap'),
        $slide = $('.slide'),
        $sLi = $('.slide li'),
        $paging = $('.paging'),

        $btnPrev = $('.btn_l'),
        $btnNext = $('.btn_r'),

        $btnStart = $('.btn_start'),
        $btnPause = $('.btn_pause'),

   // Slide-related properties
        indexNow = 0,
        indexLast = $sLi.length - 1,

        toggle = false,
        handle = null,
        doubleClickFlag = false;

/* reset */

    var reset = function(){
      // slide element size reset
      $sWrap[0].style.width = defaults.slideWidth;
      for (var i = 0; i < (indexLast + 1); i++){
        $sLi[i].style.width = $sWrap[0].offsetWidth + 'px';
      };
      $sWrap[0].style.height = $sLi[0].offsetHeight + 'px';
      $slide[0].style.width = $sLi[0].offsetWidth * (indexLast + 1) + 'px';
    };

    // paging auto add
    $paging.append('<ul></ul>');
    for (var ap = 0; ap <= indexLast; ap++){
      $paging.children().append('<li></li>');
    };
    var $pLi = $('.paging li');

    // slide li add clone
    if(defaults.loop){
      indexNow++;
      $sLi.eq(indexLast).clone().prependTo($slide).addClass('cloned');
      $sLi.eq(0).clone().appendTo($slide).addClass('cloned');
    };

/* function */

    var myObject = {
      _duraOn: function(){
        $slide[0].style.transitionDuration = defaults.slideTime+'ms';
      },
      _duraOff: function(){
        $slide[0].style.transitionDuration = '0ms';
      },
      _slidePrev: function(){
        myObject._duraOn();
        if(indexNow <= 0){
          indexNow = indexLast;
        } else {
          indexNow--;
        };
        myObject._move();
      },
      _slideNext: function(){
        myObject._duraOn();
        if(indexNow >= indexLast){
          indexNow = 0;
        } else {
          indexNow++;
        };
        myObject._move();
      },
      // paging, slide addClass
      _paging: function(){
        $sLi.removeClass('active').eq(indexNow).addClass('active');
        if(defaults.loop){
          $pLi.removeClass('choice').eq(indexNow-1).addClass('choice');
        }else{
          $pLi.removeClass('choice').eq(indexNow).addClass('choice');
        };
      },
      _infiniteLoop: function(){
        if(indexNow >= indexLast){
          indexNow = 1;
          myObject._move();
        }else if(indexNow <= 0){
          indexNow = indexLast-1;
          myObject._move();
        };
      },
      // infinite Loop IE8- issue
      _infineteLoopIe: function(){
        $slide.css('left',- ($sLi.width() * indexNow) + 'px');
      },
      // translate motion or ie8- animate motion
      _slideMotion: function(){
        if($sLi[0].classList){
          $slide[0].style.transform = 'translate(-' + ($sLi.eq(indexNow).width() * indexNow) + 'px, 0)';
        }else{
          $slide.animate({
            left: - ($sLi.width() * indexNow) + 'px'
          }, defaults.slideTime, function(){
            doubleClickFlag = false;
            if(defaults.loop){
              if(indexNow >= indexLast){
                indexNow = 1;
                myObject._infineteLoopIe();
              }else if(indexNow <= 0){
                indexNow = indexLast-1;
                myObject._infineteLoopIe();
              };
              myObject._paging();
            };
          });
        }; // else
      },
      _move: function(){
        myObject._slideMotion();
        myObject._paging();
      },
      _toggleSlide: function(){
        myObject._slideNext();
        toggle = !toggle;
      },
      _intervalStart: function(){
        if(handle == null){
          handle = setInterval(function(){
            myObject._toggleSlide();
          }, defaults.autoPlayTime);
        };
        $btnPause.removeClass('on');
        $btnStart.addClass('on');
      },
      _intervalStop: function(){
        clearInterval(handle);
        $btnStart.removeClass('on');
        $btnPause.addClass('on');
        handle = null;
      },
      _autoSlide: function(){
        if(defaults.autoPlay){
          myObject._intervalStart();
        }else{
          myObject._intervalStop();
        }
      },
      // Preventing multiple clicks
      _doubleClickCheck: function(){
        if(doubleClickFlag){
          return doubleClickFlag;
        }else{
          doubleClickFlag = true;
          return false;
        };
      }
    };
    // myObject


    // touch event
    $slide.swipe({
      swipe: function(event, direction, distance, duration, fingerCount, fingerData){
        if(myObject._doubleClickCheck()){
         return;
        };
        if(direction == "left"){
          myObject._slideNext();
          myObject._intervalStop();
        } else if(direction == "right"){
          myObject._slidePrev();
          myObject._intervalStop();
        };
      },
      threshold: 75
    });

/* click event */

    // ◀ ▶ buttons
    $btnPrev.click(function(){
      if(myObject._doubleClickCheck()){
       return;
      };
      myObject._slidePrev();
      myObject._intervalStop();
    });
    $btnNext.click(function(){
      if(myObject._doubleClickCheck()){
       return;
      };
      myObject._slideNext();
      myObject._intervalStop();
    });

    // Autoplay / Auto play stop
    $btnStart.click(function(){
      myObject._intervalStart();
    });
    $btnPause.click(function(){
      myObject._intervalStop();
    });

    // paging li Click event
    $pLi.click(function(){
      if(defaults.loop){
        indexNow = $(this).index()+1;
      }else{
        indexNow = $(this).index();
      };
      myObject._duraOn();
      myObject._move();
      myObject._intervalStop();
    });

/* resize event */

    // window resize
    $(window).resize(function(){
      if(defaults.slideWidth == '100%'){
        myObject._duraOff();
        reset();
        myObject._slideMotion();
        myObject._intervalStop();
      };
    });

/* onload */

    $(window).load(function(){
      if(defaults.loop){
        myObject._duraOff();
        $sLi = $('.slide li');
        indexLast = $sLi.length - 1;
      };
      reset();
      myObject._paging();
      myObject._move();
      myObject._autoSlide();
    });

    // callback, transition end
    $slide.on("transitionend webkittransitionend otransitionend mstransitionend", function(){
      doubleClickFlag = false;
      myObject._duraOff();
      if(defaults.loop){
        myObject._infiniteLoop();
      };
    });

  }; // snowCoffee
}(jQuery));
