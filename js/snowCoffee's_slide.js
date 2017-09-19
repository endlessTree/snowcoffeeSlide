(function($) {
  $.snowCoffee = function() {

    /*	변수	*/

    // 각 요소의 선택자를 담은 변수 선언
    var $sWrap = $('#slideWrap'),
        $slide = $('.slide'),
        $sLi = $('.slide li'),

        // slide에 필요한 갖가지 변수 선언
        indexNow = 0, // 현재 slide li의 인덱스를 담을 변수
        indexLast = $sLi.last().index(), // slide li의 마지막 index를 담을 변수
        // slideWidth = '100%', // slide li 에 있는 이미지의 width값을 변수에, 혹은 특정 사이즈
        slideWidth = '500px', 	// slide li 에 있는 이미지의 width값을 변수에, 혹은 특정 사이즈
        slideTime = '3000', // 자동 재생 시간

        // 셋인터벌 관련
        toggle = false,
        handle = null;


    /*	리셋	*/

    window.onload = function() {
      reset();
      startInterval();
    };


    /*	함수	*/

    // size reset
    function reset() {
      $sWrap.width(slideWidth).height($sLi.height());
      $slide.width($sLi.width() * (indexLast + 1)); // .slide의 넓이 값을 .slide li의 갯수만큼 넓히기
      $sLi.width($sWrap.width());
    };

    // slide 이전 이미지
    function slidePrev() {
      if (indexNow >= indexLast) {
        indexNow = 0;
      } else {
        indexNow++;
      };
      move()
    };

    // slide 다음 이미지
    function slideNext() {
      if (indexNow <= 0) {
        indexNow = indexLast;
      } else {
        indexNow--;
      };
      move();
    };

    // slide 이동 함수
    function move() {
      $slide.css({ transform: 'translate3d(-'+($sLi.width() * indexNow)+'px, 0, 0)' });
      paging();
    };

    // paging
    function paging() {
      $sLi.removeClass('active').eq(indexNow).addClass('active');
      $('.paging li').removeClass('choice').eq(indexNow).addClass('choice');
      pagingHasClass();
    };

    // paging의 choice 클래스가 특정 li에 왔을 때 조건문 실행
    function pagingHasClass() {
      if ($('.paging li').eq(2).hasClass('choice') == true) {
        //console.log(1)
      };
    };

    //슬라이드 개수 만큼 페이징 자동 추가
		$('.paging').append('<ul></ul>')
    for (var i = 0; i <= indexLast; i++) {
			$('.paging ul').append('<li></li>');
		};
    $('.paging li').eq(indexNow).addClass('choice');

    // 터치 이벤트
    $slide.swipe({
      //Generic swipe handler for all directions
      swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
        if (direction == "left") {
          slidePrev();
          stopInterval();
        } else if (direction == "right") {
          slideNext();
          stopInterval();
        };
      },
      //Default is 75px, set to 0 for demo so any distance triggers swipe
      threshold: 0
    });


    /*	이벤트	*/

    // ◀ ▶ 버튼
    $('.slideBtn div').click(function(e) {
      if ($(this).hasClass('btn_l') == true) {
        slideNext();
      } else {
        slidePrev();
      }
      stopInterval();
      e.preventDefault();
    });

    // paging li 클릭 했을 때 이벤트
    $('.paging li').click(function(e) {
      indexNow = $(this).index();
      move();
      stopInterval();
      e.preventDefault();
    });

    // 자동 재생 / 정지 버튼
    $('.autoBtn div').click(function(e) {
      if ($(this).hasClass('btnStart') == true) {
        startInterval();
      } else {
        stopInterval();
      };
      e.preventDefault();
    });

    function startInterval() {
      if (handle == null) {
        handle = setInterval(function() {
          toggleSlide();
        }, slideTime);
      };
      $('.btnPause').removeClass('on');
      $('.btnStart').addClass('on');
    };

    function stopInterval() {
      clearInterval(handle);
      $('.btnStart').removeClass('on');
      $('.btnPause').addClass('on');
      handle = null;
    };

    function toggleSlide() {
      slidePrev();
      toggle = !toggle;
    };

    // transition end
    $slide.on("transitionend webkittransitionend otransitionend mstransitionend", function(e){
      if( indexNow == 0 ){
        console.log(1)
      }
    });


  /* 리사이징 */

    // 리사이징 후의 이벤트를 위한 함수
    var waitForFinalEvent = (function() {
      var timers = {};
      return function(callback, ms, uniqueId) {
        /*if (!uniqueId) {
        	uniqueId = "Don't call this twice without a uniqueId"; //고유한 ID없이 두 번이 호출하지 마십시오
        }*/
        if (timers[uniqueId]) {
          clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
      };
    })();

    // 윈도우 리사이즈
    $(window).resize(function() {

      if (slideWidth == '100%') {
        $slide.addClass('stop').css({transform: 'translate3d(-'+($sLi.width() * indexNow)+'px, 0, 0)'});
        reset();
      };
      stopInterval();

      // 리사이징 끝난 후 이벤트
      waitForFinalEvent(function() {
        $slide.removeClass('stop'); // 리사이징 되고난 후에 transition 시간 생성
        startInterval();
      }, 0);

    });

  }; //snowCoffee
}(jQuery));
