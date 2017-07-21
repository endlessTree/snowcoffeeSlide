(function($){
	$.snowCoffee = function(){
		
	/*	변수	*/

		// 각 요소를 담은 변수 선언
		var $sWrap = $('#slideWrap');
		var $sInner = $('#slideInner');
		var $sWrapUl = $('.slide');
		var $sLi = $('.slide li');

		// slide에 필요한 갖가지 변수 선언
		var slide = 0;		// 이미지 사이즈를 marginLeft 이동 값에 계속 더해줄 변수
		var indexNow = 0;		// 현재 slide li의 인덱스를 담을 변수
		var indexLast = $('#slideWrap .slide li:last-child').index(); // slide li의 마지막 index를 담을 변수
		var slideWidth = '100%'; 	// slide li 에 있는 이미지의 width값을 변수에, 혹은 특정 사이즈
		//var slideWidth = '800px'; 	// slide li 에 있는 이미지의 width값을 변수에, 혹은 특정 사이즈
		var slideTime = '3000'; // 자동 재생 시간

	/*	리셋	*/

		$(window).load(function(){
			$sWrap.width(slideWidth).height($sLi.height());		// $('#slideWrap')의 width와 height 값을 slideWidth 값과 $sLi.height()값으로 으로 담는다.
			$sWrapUl.width($sWrap.width()*(indexLast+1));	// ul.slide의 넓이 값을 slide li의 갯수만큼 넓히기
			$sLi.width($sInner.width());		// $('#slideWrap .slide li')
		});

	/*	함수	*/

		// slide 왼쪽 이동 클릭 함수
		function slideLeft(){
			if( indexNow >= indexLast ){
				indexNow = 0;
			}else{
				indexNow++;
			};
			move()
		};

		// slide 오른쪽 이동 클릭 함수
		function slideRight(){
			if( indexNow <= 0 ){
				indexNow = indexLast;
			}else{
				indexNow--;
			};
			move();
		};

		// slide 이동 함수
		function move(){
			$sWrapUl.css('margin-left', -($sInner.width() * indexNow)+'px');
			paging();
		};

		// paging
		function paging(){
			$sLi.removeClass('on').eq(indexNow).addClass('on');	
			$('.paging li').removeClass('choice').eq(indexNow).addClass('choice');
			pagingHasClass();
		};

		// paging의 choice 클래스가 특정 li에 왔을 때 조건문 실행
		function pagingHasClass(){
			if( $('.paging li').eq(2).hasClass('choice') == true ){
				//console.log(1)
			};
		};
		
		//슬라이드 개수만큼 페이징 자동 추가
		$('.paging').append('<ul></ul>')
		for (var i = 0; i <= indexLast; i++ ){
			$('.paging ul').append('<li><a href="#"></a></li>');
		};
		$('.paging li').eq(indexNow).addClass('choice');

		// 터치 이벤트
		$sWrapUl.swipe( {
			//Generic swipe handler for all directions
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			  if(direction=="left"){
					slideLeft();
					stopInterval();
				}else if(direction=="right"){
					slideRight();
					stopInterval();
				};
			},
			//Default is 75px, set to 0 for demo so any distance triggers swipe
			 threshold:0
		});
			
	/*	이벤트	*/

		// ◀ ▶ 버튼
		$('.slideBtn p').click(function(e){
			if( $(this).hasClass('btn_l') == true ){
				slideRight();
			}else{
				slideLeft();
			}
			stopInterval();
			e.preventDefault();
		});

		// paging li 클릭 했을 때 이벤트
		$('.paging li').click(function(e){
			indexNow = $(this).index();
			move();
			stopInterval();
			e.preventDefault();
		});

		// 자동 재생 / 정지 버튼
		$('.autoBtn p').click(function(e){
			if( $(this).hasClass('btnStart') == true ){
				startInterval();
			}else{
				stopInterval();
			};
			e.preventDefault();
		});
			
		// 셋인터벌 관련
		var toggle = false;
		var handle = null;
		window.onload = function(){
			startInterval();
		};
		function startInterval(){
			if( handle == null ){
				handle=setInterval(function(){
					toggleSlide();
				}, slideTime);
			};
			$('.btnPause').removeClass('on');
			$('.btnStart').addClass('on');
		};
		function stopInterval(){
			clearInterval(handle);
			$('.btnStart').removeClass('on');
			$('.btnPause').addClass('on');
			handle = null;
		};
		function toggleSlide(){
			slideLeft();
			toggle = !toggle;
		};

		// 리사이징 후의 이벤트를 위한 함수
		var waitForFinalEvent = (function () {
			var timers = {};
			return function (callback, ms, uniqueId) {
				/*if (!uniqueId) {
					uniqueId = "Don't call this twice without a uniqueId"; //고유한 ID없이 두 번이 호출하지 마십시오
				}*/
				if (timers[uniqueId]) {
					clearTimeout (timers[uniqueId]);
				}
				timers[uniqueId] = setTimeout(callback, ms);
			};
		})();
		
		// 윈도우 리사이즈
		$(window).resize(function(){
			
			if( slideWidth == '100%' ){
				$sWrap.width(slideWidth).height($sLi.height());		// $('#slideWrap')의 width와 height 값을 slideWidth 값과 $sLi.height()값으로 으로 담는다.
				$sWrapUl.width($sWrap.width()*(indexLast+1)).css({'margin-left' : -($sInner.width() * indexNow)+'px', 'transition' : 'margin-left 0s ease-out 0s' })
				$sLi.width($sInner.width());		// $('#slideWrap .slide li')
			};

			stopInterval();

			// 리사이징 끝난 후 이벤트
			waitForFinalEvent(function(){
				$sWrapUl.css('transition','margin-left 0.2s ease-out 0s');	// 리사이징 되고난 후에 transition 시간 생성
				startInterval();
			}, 200);

		});
		
	}; //snowCoffee
}(jQuery));