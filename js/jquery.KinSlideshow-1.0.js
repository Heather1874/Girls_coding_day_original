/**
 * ��ӭʹ�� KinSlideshow �õ�Ƭ������ͼ�����
 * Download by http://down.liehuo.net
 * jQuery KinSlideshow plugin
 * ========================================��˵����========================================================
 * jQuery�õ�Ƭ�������������������ҳ��ʹ�ûõ�Ƭ(����ͼ)Ч�����IE6/IE7/IE8/IE9,FireFox,Chrome*,Opera��
 * ��Ҫ����Chrome��Ҫ��img��ǩ��д��ͼƬ�Ŀ�Ⱥ͸߶�<img src= width="" height="">,�������������Ҫ��<img src="">
 * ʹ�ü��䷽�㡢�򵥣������ʽ�����Զ���,���嶨����ʽ�������������������μ�demo�ļ�
 * ����Ҫ�Լ����役��ͼ��Ⱥ͸߶ȣ��Զ���ȡͼƬ��͸ߣ�����ͼƬ�ߴ�Ҫ����һ�¡�
 * ���п�Ⱥ͸߶ȵ�λ�������أ����ò���ʱ����Ҫ�ӵ�λ(px)
 * ========================================================================================================
 * @name jquery.KinSlideshow.js
 * @version 1.0
 * @author Mr.Kin
 * @date 2010-07-25
 * @Email:Mr.Kin@Foxmail.com
 * @QQ:87190493
 *
 * ����ȡ���°汾KinSlideshow���Ǳ���Bug���뷢��Email�� ��Mr.Kin@Foxmail.com��
 *
 **/


(function($) {
	$.fn.slimScroll=function(options) {
	      var defaults = {

	        // width in pixels of the visible scroll area
	        width : 'auto',

	        // height in pixels of the visible scroll area
	        height : '250px',

	        // width in pixels of the scrollbar and rail
	        size : '7px',

	        // scrollbar color, accepts any hex/color value
	        color: '#FFF',

	        // scrollbar position - left/right
	        position : 'right',

	        // distance in pixels between the side edge and the scrollbar
	        distance : '1px',

	        // default scroll position on load - top / bottom / $('selector')
	        start : 'top',

	        // sets scrollbar opacity
	        opacity : .4,

	        // enables always-on mode for the scrollbar
	        alwaysVisible : false,

	        // check if we should hide the scrollbar when user is hovering over
	        disableFadeOut : false,

	        // sets visibility of the rail
	        railVisible : false,

	        // sets rail color
	        railColor : '#333',

	        // sets rail opacity
	        railOpacity : .2,

	        // whether  we should use jQuery UI Draggable to enable bar dragging
	        railDraggable : true,

	        // defautlt CSS class of the slimscroll rail
	        railClass : 'slimScrollRail',

	        // defautlt CSS class of the slimscroll bar
	        barClass : 'slimScrollBar',

	        // defautlt CSS class of the slimscroll wrapper
	        wrapperClass : 'slimScrollDiv',

	        // check if mousewheel should scroll the window if we reach top/bottom
	        allowPageScroll : false,

	        // scroll amount applied to each mouse wheel step
	        wheelStep : 20,

	        // scroll amount applied when user is using gestures
	        touchScrollStep : 200,

	        // sets border radius
	        borderRadius: '7px',

	        // sets border radius of the rail
	        railBorderRadius : '7px'
	      };

	      var o = $.extend(defaults, options);

	      // do it for every element that matches selector
	      this.each(function(){

	      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
	        barHeight, percentScroll, lastScroll,
	        divS = '<div></div>',
	        minBarHeight = 30,
	        releaseScroll = false;

	        // used in event handlers and for better minification
	        var me = $(this);

	        // ensure we are not binding it again
	        if (me.parent().hasClass(o.wrapperClass))
	        {
	            // start from last bar position
	            var offset = me.scrollTop();

	            // find bar and rail
	            bar = me.parent().find('.' + o.barClass);
	            rail = me.parent().find('.' + o.railClass);

	            getBarHeight();

	            // check if we should scroll existing instance
	            if ($.isPlainObject(options))
	            {
	              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
	              if ( 'height' in options && options.height == 'auto' ) {
	                me.parent().css('height', 'auto');
	                me.css('height', 'auto');
	                var height = me.parent().parent().height();
	                me.parent().css('height', height);
	                me.css('height', height);
	              }

	              if ('scrollTo' in options)
	              {
	                // jump to a static point
	                offset = parseInt(o.scrollTo);
	              }
	              else if ('scrollBy' in options)
	              {
	                // jump by value pixels
	                offset += parseInt(o.scrollBy);
	              }
	              else if ('destroy' in options)
	              {
	                // remove slimscroll elements
	                bar.remove();
	                rail.remove();
	                me.unwrap();
	                return;
	              }

	              // scroll content by the given offset
	              scrollContent(offset, false, true);
	            }

	            return;
	        }

	        // optionally set height to the parent's height
	        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

	        // wrap content
	        var wrapper = $(divS)
	          .addClass(o.wrapperClass)
	          .css({
	            position: 'relative',
	            overflow: 'hidden',
	            width: o.width,
	            height: o.height
	          });

	        // update style for the div
	        me.css({
	          overflow: 'hidden',
	          width: o.width,
	          height: o.height
	        });

	        // create scrollbar rail
	        var rail = $(divS)
	          .addClass(o.railClass)
	          .css({
	            width: o.size,
	            height: '100%',
	            position: 'absolute',
	            top: 0,
	            display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
	            'border-radius': o.railBorderRadius,
	            background: o.railColor,
	            opacity: o.railOpacity,
	            zIndex: 90
	          });

	        // create scrollbar
	        var bar = $(divS)
	          .addClass(o.barClass)
	          .css({
	            background: o.color,
	            width: o.size,
	            position: 'absolute',
	            top: 0,
	            opacity: o.opacity,
	            display: o.alwaysVisible ? 'block' : 'none',
	            'border-radius' : o.borderRadius,
	            BorderRadius: o.borderRadius,
	            MozBorderRadius: o.borderRadius,
	            WebkitBorderRadius: o.borderRadius,
	            zIndex: 99
	          });

	        // set position
	        var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
	        rail.css(posCss);
	        bar.css(posCss);

	        // wrap it
	        me.wrap(wrapper);

	        // append to parent div
	        me.parent().append(bar);
	        me.parent().append(rail);

	        // make it draggable and no longer dependent on the jqueryUI
	        if (o.railDraggable){
	          bar.bind("mousedown", function(e) {
	            var $doc = $(document);
	            isDragg = true;
	            t = parseFloat(bar.css('top'));
	            pageY = e.pageY;

	            $doc.bind("mousemove.slimscroll", function(e){
	              currTop = t + e.pageY - pageY;
	              bar.css('top', currTop);
	              scrollContent(0, bar.position().top, false);// scroll content
	            });

	            $doc.bind("mouseup.slimscroll", function(e) {
	              isDragg = false;hideBar();
	              $doc.unbind('.slimscroll');
	            });
	            return false;
	          }).bind("selectstart.slimscroll", function(e){
	            e.stopPropagation();
	            e.preventDefault();
	            return false;
	          });
	        }

	        // on rail over
	        rail.hover(function(){
	          showBar();
	        }, function(){
	          hideBar();
	        });

	        // on bar over
	        bar.hover(function(){
	          isOverBar = true;
	        }, function(){
	          isOverBar = false;
	        });

	        // show on parent mouseover
	        me.hover(function(){
	          isOverPanel = true;
	          showBar();
	          hideBar();
	        }, function(){
	          isOverPanel = false;
	          hideBar();
	        });

	        // support for mobile
	        me.bind('touchstart', function(e,b){
	          if (e.originalEvent.touches.length)
	          {
	            // record where touch started
	            touchDif = e.originalEvent.touches[0].pageY;
	          }
	        });

	        me.bind('touchmove', function(e){
	          // prevent scrolling the page if necessary
	          if(!releaseScroll)
	          {
	  		      e.originalEvent.preventDefault();
			      }
	          if (e.originalEvent.touches.length)
	          {
	            // see how far user swiped
	            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
	            // scroll content
	            scrollContent(diff, true);
	            touchDif = e.originalEvent.touches[0].pageY;
	          }
	        });

	        // set up initial height
	        getBarHeight();

	        // check start position
	        if (o.start === 'bottom')
	        {
	          // scroll content to bottom
	          bar.css({ top: me.outerHeight() - bar.outerHeight() });
	          scrollContent(0, true);
	        }
	        else if (o.start !== 'top')
	        {
	          // assume jQuery selector
	          scrollContent($(o.start).position().top, null, true);

	          // make sure bar stays hidden
	          if (!o.alwaysVisible) { bar.hide(); }
	        }

	        // attach scroll events
	        attachWheel();

	        function _onWheel(e)
	        {
	          // use mouse wheel only when mouse is over
	          if (!isOverPanel) { return; }

	          var e = e || window.event;

	          var delta = 0;
	          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
	          if (e.detail) { delta = e.detail / 3; }

	          var target = e.target || e.srcTarget || e.srcElement;
	          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
	            // scroll content
	            scrollContent(delta, true);
	          }

	          // stop window scroll
	          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
	          if (!releaseScroll) { e.returnValue = false; }
	        }

	        function scrollContent(y, isWheel, isJump)
	        {
	          releaseScroll = false;
	          var delta = y;
	          var maxTop = me.outerHeight() - bar.outerHeight();

	          if (isWheel)
	          {
	            // move bar with mouse wheel
	            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

	            // move bar, make sure it doesn't go out
	            delta = Math.min(Math.max(delta, 0), maxTop);

	            // if scrolling down, make sure a fractional change to the
	            // scroll position isn't rounded away when the scrollbar's CSS is set
	            // this flooring of delta would happened automatically when
	            // bar.css is set below, but we floor here for clarity
	            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

	            // scroll the scrollbar
	            bar.css({ top: delta + 'px' });
	          }

	          // calculate actual scroll amount
	          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
	          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

	          if (isJump)
	          {
	            delta = y;
	            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
	            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
	            bar.css({ top: offsetTop + 'px' });
	          }

	          // scroll content
	          me.scrollTop(delta);

	          // fire scrolling event
	          me.trigger('slimscrolling', ~~delta);

	          // ensure bar is visible
	          showBar();

	          // trigger hide when scroll is stopped
	          hideBar();
	        }

	        function attachWheel()
	        {
	          if (window.addEventListener)
	          {
	            this.addEventListener('DOMMouseScroll', _onWheel, false );
	            this.addEventListener('mousewheel', _onWheel, false );
	            this.addEventListener('MozMousePixelScroll', _onWheel, false );
	          }
	          else
	          {
	            document.attachEvent("onmousewheel", _onWheel)
	          }
	        }

	        function getBarHeight()
	        {
	          // calculate scrollbar height and make sure it is not too small
	          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
	          bar.css({ height: barHeight + 'px' });

	          // hide scrollbar if content is not long enough
	          var display = barHeight == me.outerHeight() ? 'none' : 'block';
	          bar.css({ display: display });
	        }

	        function showBar()
	        {
	          // recalculate bar height
	          getBarHeight();
	          clearTimeout(queueHide);

	          // when bar reached top or bottom
	          if (percentScroll == ~~percentScroll)
	          {
	            //release wheel
	            releaseScroll = o.allowPageScroll;

	            // publish approporiate event
	            if (lastScroll != percentScroll)
	            {
	                var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
	                me.trigger('slimscroll', msg);
	            }
	          }
	          else
	          {
	            releaseScroll = false;
	          }
	          lastScroll = percentScroll;

	          // show only when required
	          if(barHeight >= me.outerHeight()) {
	            //allow window scroll
	            releaseScroll = true;
	            return;
	          }
	          bar.stop(true,true).fadeIn('fast');
	          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
	        }

	        function hideBar()
	        {
	          // only hide when options allow it
	          if (!o.alwaysVisible)
	          {
	            queueHide = setTimeout(function(){
	              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
	              {
	                bar.fadeOut('slow');
	                rail.fadeOut('slow');
	              }
	            }, 1000);
	          }
	        }

	      });

	      // maintain chainability
	      return this;
	    };
$.fn.KinSlideshow = function(settings){

	  settings = jQuery.extend({
		   intervalTime : 5, //�л�չʾ���ʱ�� ����λ���롿
		   moveSpeedTime : 400,//�л�һ��ͼƬ����ʱ�䣬����λ�����롿
		   moveStyle:"left",//�л����� �� left | right | up | down ��left:�����л�,right:�����л�,up:�����л�,down:�����л�
		   mouseEvent:"mouseclick", //��������ť�¼�,��mouseclick | mouseover��mouseclick����굥���л���mouseover����껬���л���
		   isHasTitleBar:true,//�Ƿ���ʾ���ⱳ����
		   titleBar:{titleBar_height:40,titleBar_bgColor:"#000000",titleBar_alpha:0},//���ⱳ����ʽ��(isHasTitleBar = true ǰ��������)
		   isHasTitleFont:true,//�Ƿ���ʾ�������� 
		   titleFont:{TitleFont_size:12,TitleFont_color:"#FFFFFF",TitleFont_family:"Verdana",TitleFont_weight:"bold"},//����������ʽ��(isHasTitleFont = true ǰ��������)
		   isHasBtn:true, //�Ƿ���ʾ��ť
		   btn:{btn_bgColor:"#666666",btn_bgHoverColor:"#CC0000",btn_fontColor:"#FFF",btn_fontHoverColor:"#FFF",btn_fontFamily:"Verdana",btn_borderColor:"#999999",btn_borderHoverColor:"#FF0000",btn_borderWidth:1,btn_bgAlpha:0.7} //��ť��ʽ���ã�(isHasBtn = true ǰ��������)
	  },settings);
	  var titleBar_Bak = {titleBar_height:40,titleBar_bgColor:"#000000",titleBar_alpha:0.5}
	  var titleFont_Bak = {TitleFont_size:12,TitleFont_color:"#FFFFFF",TitleFont_family:"Verdana",TitleFont_weight:"bold"}
	  var btn_Bak = {btn_bgColor:"#666666",btn_bgHoverColor:"#CC0000",btn_fontColor:"#CCCCCC",btn_fontHoverColor:"#FFF",btn_fontFamily:"Verdana",btn_borderColor:"#999999",btn_borderHoverColor:"#FF0000",btn_borderWidth:1,btn_bgAlpha:0.7} //��ť��ʽ���ã�(isHasBtn = true ǰ��������)
	  for (var key in titleBar_Bak)
	  {
		  if(settings.titleBar[key] == undefined){
			  settings.titleBar[key] = titleBar_Bak[key];
		  }
	  }	
	  for (var key in titleFont_Bak)
	  {
		  if(settings.titleFont[key] == undefined){
			  settings.titleFont[key] = titleFont_Bak[key];
		  }
	  }
	  for (var key in btn_Bak)
	  {
		  if(settings.btn[key] == undefined){
			  settings.btn[key] = btn_Bak[key];
		  }
	  }	  
	  
	  
	 var KinSlideshow_BoxObject = this;
	 var KinSlideshow_BoxObjectSelector = $(KinSlideshow_BoxObject).selector;
	 var KinSlideshow_DateArray = new Array();
	 var KinSlideshow_imgaeLength = 0;
	 var KinSlideshow_Size =new Array();
	 var KinSlideshow_changeFlag = 0;
	 var KinSlideshow_IntervalTime = settings.intervalTime;
	 var KinSlideshow_setInterval;
	 var KinSlideshow_firstMoveFlag = true;
	 if(isNaN(KinSlideshow_IntervalTime) || KinSlideshow_IntervalTime <= 1){
			KinSlideshow_IntervalTime = 5;
	 }
	 if(settings.moveSpeedTime > 500){
		 settings.moveSpeedTime = 500;
	 }else if(settings.moveSpeedTime < 100){
		 settings.moveSpeedTime = 100;
	 }
	 
	 function KinSlideshow_initialize(){
		 $(KinSlideshow_BoxObject).css({visibility:"hidden"});
		 $(KinSlideshow_BoxObjectSelector+" a img").css({border:0});
		 KinSlideshow_start();
	 };
   
     function KinSlideshow_start(){
		 KinSlideshow_imgaeLength = $(KinSlideshow_BoxObjectSelector+" a").length;
		 KinSlideshow_Size.push($(KinSlideshow_BoxObjectSelector+" a img").width());
		 KinSlideshow_Size.push($(KinSlideshow_BoxObjectSelector+" a img").height());
		 
		$(KinSlideshow_BoxObjectSelector+" a img").each(function(i){
			KinSlideshow_DateArray.push($(this).attr("alt"));		
		});
		$(KinSlideshow_BoxObjectSelector+" a").wrapAll("<div id='KinSlideshow_content'></div>");
		
	    $("#KinSlideshow_content").clone().attr("id","KinSlideshow_contentClone").appendTo(KinSlideshow_BoxObject);
		KinSlideshow_setTitleBar();
		KinSlideshow_setTitleFont();
		KinSlideshow_setBtn();
		KinSlideshow_action();
		KinSlideshow_btnEvent(settings.mouseEvent);
		$(KinSlideshow_BoxObject).css({visibility:"visible"});
	 };
	 function KinSlideshow_setTitleBar(){
		$(KinSlideshow_BoxObject).css({width:KinSlideshow_Size[0],height:KinSlideshow_Size[1],overflow:"hidden",position:"relative"});
		$(KinSlideshow_BoxObject).append("<div class='KinSlideshow_titleBar'></div>");
		var getTitleBar_Height = settings.titleBar.titleBar_height;//��ȡ���߶�
		
		if(isNaN(getTitleBar_Height)){
			getTitleBar_Height = 40;
		}else if(getTitleBar_Height < 25){
			getTitleBar_Height = 25;
		};
		
		$(KinSlideshow_BoxObjectSelector+" .KinSlideshow_titleBar").css({height:getTitleBar_Height,width:"100%",position:"absolute",bottom:0,left:0})
		 if(settings.isHasTitleBar){
		 		$(KinSlideshow_BoxObjectSelector+" .KinSlideshow_titleBar").css({background:settings.titleBar.titleBar_bgColor,opacity:settings.titleBar.titleBar_alpha})	 
		 }
	 };
	 function KinSlideshow_setTitleFont(){
		 if(settings.isHasTitleFont){
			$(KinSlideshow_BoxObjectSelector+" .KinSlideshow_titleBar").append("<h2 class='title' style='margin:3px 0 0 6px;padding:0;'></h2>");	
			$(KinSlideshow_BoxObjectSelector+" .KinSlideshow_titleBar .title").css({fontSize:settings.titleFont.TitleFont_size,color:settings.titleFont.TitleFont_color,fontFamily:settings.titleFont.TitleFont_family,fontWeight:settings.titleFont.TitleFont_weight});
			setTiltFontShow(0);
		 };
		 
	 };
	 function KinSlideshow_setBtn(){
		 if(settings.btn.btn_borderWidth > 2){settings.btn.btn_borderWidth = 2}
		 if(settings.btn.btn_borderWidth < 0 || isNaN(settings.btn.btn_borderWidth)){settings.btn.btn_borderWidth = 0}
		 if(settings.isHasBtn && KinSlideshow_imgaeLength >= 2){
			 $(KinSlideshow_BoxObject).append("<div class='KinSlideshow_btnBox' style='position:absolute;right:20px;bottom:15px; z-index:100'></div>");
			 var KinSlideshow_btnList = "";
			 for(i=1;i<=KinSlideshow_imgaeLength;i++){
					KinSlideshow_btnList+="<li></li>";
			 }
			 KinSlideshow_btnList = "<ul id='btnlistID' style='margin:0;padding:0; overflow:hidden'>"+KinSlideshow_btnList+"</ul>";
			 $(KinSlideshow_BoxObjectSelector+" .KinSlideshow_btnBox").append(KinSlideshow_btnList);
			 $(KinSlideshow_BoxObjectSelector+" .KinSlideshow_btnBox #btnlistID li").css({listStyle:"none",float:"left",width:30,height:6,borderColor:settings.btn.btn_borderColor,background:settings.btn.btn_bgColor,textAlign:"center",cursor:"pointer",marginLeft:3,fontSize:12,fontFamily:settings.btn.btn_fontFamily,lineHeight:"7px",opacity:settings.btn.btn_bgAlpha,color:settings.btn.btn_fontColor});
			 $("#btnlistID li:eq(0)").css({background:settings.btn.btn_bgHoverColor,borderColor:settings.btn.btn_borderHoverColor,color:settings.btn.btn_fontHoverColor});
		 };
	 };
	 function KinSlideshow_action(){
		switch(settings.moveStyle){
			case "left":  KinSlideshow_moveLeft(); break;
			case "right": KinSlideshow_moveRight();break;
			case "up":    KinSlideshow_moveUp();   break;
			case "down":  KinSlideshow_moveDown(); break;
			default:      settings.moveStyle = "left"; KinSlideshow_moveLeft();
		}	 
	 };
	 function KinSlideshow_moveLeft(){
		$(KinSlideshow_BoxObjectSelector+" div:lt(2)").wrapAll("<div id='KinSlideshow_moveBox'></div>");
		$("#KinSlideshow_moveBox").css({width:KinSlideshow_Size[0],height:KinSlideshow_Size[1],overflow:"hidden",position:"relative"});
		$("#KinSlideshow_content").css({float:"left"});
		$("#KinSlideshow_contentClone").css({float:"left"});
		$(KinSlideshow_BoxObjectSelector+" #KinSlideshow_moveBox div").wrapAll("<div id='KinSlideshow_XposBox'></div>");
		$(KinSlideshow_BoxObjectSelector+" #KinSlideshow_XposBox").css({float:"left",width:"2000%"});
		
		KinSlideshow_setInterval = setInterval(function(){KinSlideshow_move(settings.moveStyle)},KinSlideshow_IntervalTime*1000+settings.moveSpeedTime);
	 };
	 function KinSlideshow_moveRight(){
		$(KinSlideshow_BoxObjectSelector+" div:lt(2)").wrapAll("<div id='KinSlideshow_moveBox'></div>");
		$("#KinSlideshow_moveBox").css({width:KinSlideshow_Size[0],height:KinSlideshow_Size[1],overflow:"hidden",position:"relative"});
		$("#KinSlideshow_content").css({float:"left"});
		$("#KinSlideshow_contentClone").css({float:"left"});
		$(KinSlideshow_BoxObjectSelector+" #KinSlideshow_moveBox div").wrapAll("<div id='KinSlideshow_XposBox'></div>");
		$(KinSlideshow_BoxObjectSelector+" #KinSlideshow_XposBox").css({float:"left",width:"2000%"});
		$("#KinSlideshow_contentClone").html("");
		$("#KinSlideshow_content a").wrap("<span></span>")
		$("#KinSlideshow_content a").each(function(i){
			$("#KinSlideshow_contentClone").prepend($("#KinSlideshow_content span:eq("+i+")").html());
		})
		
		$("#KinSlideshow_content").html($("#KinSlideshow_contentClone").html());
		var KinSlideshow_offsetLeft = (KinSlideshow_imgaeLength-1)*KinSlideshow_Size[0];
		$("#KinSlideshow_moveBox").scrollLeft(KinSlideshow_offsetLeft);
		KinSlideshow_setInterval = setInterval(function(){KinSlideshow_move(settings.moveStyle)},KinSlideshow_IntervalTime*1000+settings.moveSpeedTime);
	 };	 
	 function KinSlideshow_moveUp(){
		$(KinSlideshow_BoxObjectSelector+" div:lt(2)").wrapAll("<div id='KinSlideshow_moveBox'></div>");//��div���
		$("#KinSlideshow_moveBox").css({width:KinSlideshow_Size[0],height:KinSlideshow_Size[1],overflow:"hidden",position:"relative"});
		
		$("#KinSlideshow_moveBox").animate({scrollTop: 0}, 1);
		KinSlideshow_setInterval = setInterval(function(){KinSlideshow_move(settings.moveStyle)},KinSlideshow_IntervalTime*1000+settings.moveSpeedTime);
		
	 };	 
	 
	 function KinSlideshow_moveDown(){
		$(KinSlideshow_BoxObjectSelector+" div:lt(2)").wrapAll("<div id='KinSlideshow_moveBox'></div>");//��div���
		$("#KinSlideshow_moveBox").css({width:KinSlideshow_Size[0],height:KinSlideshow_Size[1],overflow:"hidden",position:"relative"});
		$("#KinSlideshow_contentClone").html("");
		$("#KinSlideshow_content a").wrap("<span></span>")
		$("#KinSlideshow_content a").each(function(i){
			$("#KinSlideshow_contentClone").prepend($("#KinSlideshow_content span:eq("+i+")").html());
		})
		$("#KinSlideshow_content").html($("#KinSlideshow_contentClone").html());
		
		var KinSlideshow_offsetTop = (KinSlideshow_imgaeLength-1)*KinSlideshow_Size[1];
		$("#KinSlideshow_moveBox").animate({scrollTop: KinSlideshow_offsetTop}, 1);
		KinSlideshow_setInterval = setInterval(function(){KinSlideshow_move(settings.moveStyle)},KinSlideshow_IntervalTime*1000+settings.moveSpeedTime);
	 };
	function KinSlideshow_move(style){
			
			switch(style){
				case "left":
					if(KinSlideshow_changeFlag >= KinSlideshow_imgaeLength){
						KinSlideshow_changeFlag = 0;
						$("#KinSlideshow_moveBox").scrollLeft(0);
						$("#KinSlideshow_moveBox").animate({scrollLeft:KinSlideshow_Size[0]}, settings.moveSpeedTime);
					}else{
						sp =(KinSlideshow_changeFlag+1)*KinSlideshow_Size[0];
						$("#KinSlideshow_moveBox").animate({scrollLeft: sp}, settings.moveSpeedTime);
					}
					setTiltFontShow(KinSlideshow_changeFlag+1);
					break;
				case "right":
					var KinSlideshow_offsetLeft = (KinSlideshow_imgaeLength-1)*KinSlideshow_Size[0];
					if(KinSlideshow_changeFlag >= KinSlideshow_imgaeLength){
						KinSlideshow_changeFlag = 0;
						$("#KinSlideshow_moveBox").scrollLeft(KinSlideshow_offsetLeft+KinSlideshow_Size[0]);
						$("#KinSlideshow_moveBox").animate({scrollLeft:KinSlideshow_offsetLeft}, settings.moveSpeedTime);
					}else{
						if(KinSlideshow_firstMoveFlag){
							KinSlideshow_changeFlag++;
							KinSlideshow_firstMoveFlag = false;
						}
						sp =KinSlideshow_offsetLeft-(KinSlideshow_changeFlag*KinSlideshow_Size[0]);

						$("#KinSlideshow_moveBox").animate({scrollLeft: sp}, settings.moveSpeedTime);
					}
					setTiltFontShow(KinSlideshow_changeFlag);
					break;
				case "up":
					if(KinSlideshow_changeFlag >= KinSlideshow_imgaeLength){
						KinSlideshow_changeFlag = 0;
						$("#KinSlideshow_moveBox").scrollTop(0);
						$("#KinSlideshow_moveBox").animate({scrollTop:KinSlideshow_Size[1]}, settings.moveSpeedTime);
					}else{
						sp =(KinSlideshow_changeFlag+1)*KinSlideshow_Size[1];
						$("#KinSlideshow_moveBox").animate({scrollTop: sp}, settings.moveSpeedTime);
					}
					setTiltFontShow(KinSlideshow_changeFlag+1);
					break;
				case "down":
					var KinSlideshow_offsetLeft = (KinSlideshow_imgaeLength-1)*KinSlideshow_Size[1];
					if(KinSlideshow_changeFlag >= KinSlideshow_imgaeLength){
						KinSlideshow_changeFlag = 0;
						$("#KinSlideshow_moveBox").scrollTop(KinSlideshow_offsetLeft+KinSlideshow_Size[1]);
						$("#KinSlideshow_moveBox").animate({scrollTop:KinSlideshow_offsetLeft}, settings.moveSpeedTime);
					}else{
						if(KinSlideshow_firstMoveFlag){
							KinSlideshow_changeFlag++;
							KinSlideshow_firstMoveFlag = false;
						}
						sp =KinSlideshow_offsetLeft-(KinSlideshow_changeFlag*KinSlideshow_Size[1]);

						$("#KinSlideshow_moveBox").animate({scrollTop: sp}, settings.moveSpeedTime);
					}
					setTiltFontShow(KinSlideshow_changeFlag);
					break;
			}
			
			KinSlideshow_changeFlag++;
	}	 
	 
	 function setTiltFontShow(index){
		 if(index == KinSlideshow_imgaeLength){index = 0};
		 if(settings.isHasTitleFont){
			$(KinSlideshow_BoxObjectSelector+" .KinSlideshow_titleBar h2").html(KinSlideshow_DateArray[index]);
		 };
		$("#btnlistID li").each(function(i){
			if(i == index){
				$(this).css({background:settings.btn.btn_bgHoverColor,borderColor:settings.btn.btn_borderHoverColor,color:settings.btn.btn_fontHoverColor});						
			}else{
				$(this).css({background:settings.btn.btn_bgColor,borderColor:settings.btn.btn_borderColor,color:settings.btn.btn_fontColor});						
			}
		 })		 
	 };
	
	function KinSlideshow_btnEvent(Event){
		switch(Event){
			case "mouseover" : KinSlideshow_btnMouseover(); break;
			case "mouseclick" : KinSlideshow_btnMouseclick(); break;			
			default : KinSlideshow_btnMouseover();
		}
	};
	
	function KinSlideshow_btnMouseover(){
		$("#btnlistID li").mouseover(function(){
			var curLiIndex = $("#btnlistID li").index($(this)); 
	  		switch(settings.moveStyle){
				case  "left" :
					KinSlideshow_changeFlag = curLiIndex-1; break;
				case  "right" :
					if(KinSlideshow_firstMoveFlag){
						KinSlideshow_changeFlag = curLiIndex-1; break;
					}else{
						KinSlideshow_changeFlag = curLiIndex; break;
					}
				case  "up" :
					KinSlideshow_changeFlag = curLiIndex-1; break;
				case  "down" :
					if(KinSlideshow_firstMoveFlag){
						KinSlideshow_changeFlag = curLiIndex-1; break;
					}else{
						KinSlideshow_changeFlag = curLiIndex; break;
					}					
				
			}
			KinSlideshow_move(settings.moveStyle);
			$("#btnlistID li").each(function(i){
				if(i ==curLiIndex){
					$(this).css({background:settings.btn.btn_bgHoverColor,borderColor:settings.btn.btn_borderHoverColor,color:settings.btn.btn_fontHoverColor});						
				}else{
					$(this).css({background:settings.btn.btn_bgColor,borderColor:settings.btn.btn_borderColor,color:settings.btn.btn_fontColor});						
				}
			})
		})
			
	};
	function KinSlideshow_btnMouseclick(){
		$("#btnlistID li").click(function(){
			var curLiIndex = $("#btnlistID li").index($(this)); 
	  		
			switch(settings.moveStyle){
				case  "left" :
					KinSlideshow_changeFlag = curLiIndex-1; break;
				case  "right" :
					if(KinSlideshow_firstMoveFlag){
						KinSlideshow_changeFlag = curLiIndex-1; break;
					}else{
						KinSlideshow_changeFlag = curLiIndex; break;
					}
				case  "up" :
					KinSlideshow_changeFlag = curLiIndex-1; break;
				case  "down" :
					if(KinSlideshow_firstMoveFlag){
						KinSlideshow_changeFlag = curLiIndex-1; break;
					}else{
						KinSlideshow_changeFlag = curLiIndex; break;
					}					
				
			}
			KinSlideshow_move(settings.moveStyle);
			$("#btnlistID li").each(function(i){
				if(i ==curLiIndex){
					$(this).css({background:settings.btn.btn_bgHoverColor,borderColor:settings.btn.btn_borderHoverColor,color:settings.btn.btn_fontHoverColor});						
				}else{
					$(this).css({background:settings.btn.btn_bgColor,borderColor:settings.btn.btn_borderColor,color:settings.btn.btn_fontColor});						
				}
			})
		})
			
	};	
	
	
	return KinSlideshow_initialize();
};
 })(jQuery);
