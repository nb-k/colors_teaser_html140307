(function($) {
	$.library = {
		analysis: function(path){
			var self=this;this.originalPath=path;this.absolutePath=(function(){var e=document.createElement('span');e.innerHTML='<a href="'+path+'"/>';return e.firstChild.href;})();var fields={'schema':2,'username':5,'password':6,'host':7,'path':9,'query':10,'fragment':11};var r=/^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(this.absolutePath);for(var field in fields){this[field]=r[fields[field]];}this.querys={};if(this.query){$.each(self.query.split('&'),function(){var a=this.split('=');if(a.length==2) self.querys[a[0]]=a[1];});}
		},
		rollover: function(options) {
			var c=$.extend({hoverSelector:'img.rover,input.rover,.all-rover img',groupSelector:'.group-rover',activeclass:'active',postfix:'_on'},options);
			var rolloverImgs=$(c.hoverSelector).filter(isNotCurrent);rolloverImgs.each(function(){this.originalSrc=$(this).attr('src');this.rolloverSrc=this.originalSrc.replace(new RegExp('('+c.postfix+')?(\.gif|\.jpg|\.png)$'),c.postfix+"$2");this.rolloverImg=new Image;this.rolloverImg.src=this.rolloverSrc;});var groupingImgs=$(c.groupSelector).find('img').filter(isRolloverImg);rolloverImgs.not(groupingImgs).hover(function(){if(!$(this).hasClass(c.activeclass)){$(this).attr('src',this.rolloverSrc);}},function(){if(!$(this).hasClass(c.activeclass)){$(this).attr('src',this.originalSrc);}});$(c.groupSelector).hover(function(){$(this).find('img').filter(isRolloverImg).each(function(){if(!$(this).hasClass(c.activeclass)){$(this).attr('src',this.rolloverSrc);}});},function(){$(this).find('img').filter(isRolloverImg).each(function(){if(!$(this).hasClass(c.activeclass)){$(this).attr('src',this.originalSrc);}});});function isNotCurrent(i){return Boolean(!this.currentSrc);}function isRolloverImg(i){return Boolean(this.rolloverSrc);}
		},
		active: function(options) {
			var c=$.extend({id:'',type:'img',addclass:'active',postfix:'_on'},options);
			if(c.id !='' && c.type=='img'){$("img#"+c.id).each(function(){var dot=$(this).attr('src').lastIndexOf('.');var imgsrc_ro=$(this).attr('src').substr(0,dot)+c.postfix+$(this).attr('src').substr(dot,4);$(this).attr('src',imgsrc_ro).addClass(c.addclass);});}else if(c.id !='' && c.type=='text'){$("#"+c.id).each(function(){$(this).addClass(c.addclass);});}
		},
		scroll: function(options) {
			var scroller = (function() {
				var c = $.extend({
					easing:100,
					step:30,
					fps:60,
					fragment:''
				}, options);
				c.ms = Math.floor(1000/c.fps);
				var timerId;
				var param = {
					stepCount:0,
					startY:0,
					endY:0,
					lastY:0
				};
				function move() {
					if (param.stepCount == c.step) {
						//setFragment(param.hrefdata.absolutePath);
						window.scrollTo(getCurrentX(), param.endY);
					} else if (param.lastY == getCurrentY()) {
						param.stepCount++;
						window.scrollTo(getCurrentX(), getEasingY());
						param.lastY = getEasingY();
						timerId = setTimeout(move, c.ms); 
					} else {
						if(getCurrentY()+getViewportHeight() == getDocumentHeight()) {
							setFragment(param.hrefdata.absolutePath);
						}
					}
				}
				function setFragment(path){
					location.href = path
				}
				function getCurrentY() {
					return document.body.scrollTop  || document.documentElement.scrollTop;
				}
				function getCurrentX() {
					return document.body.scrollLeft  || document.documentElement.scrollLeft;
				}
				function getDocumentHeight(){
					return document.documentElement.scrollHeight || document.body.scrollHeight;
				}
				function getViewportHeight(){
					return (!$.browser.safari && !$.browser.opera) ? document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight : window.innerHeight;
				}
				function getEasingY() {
					return Math.floor(getEasing(param.startY, param.endY, param.stepCount, c.step, c.easing));
				}
				function getEasing(start, end, stepCount, step, easing) {
					var s = stepCount / step;
					return (end - start) * (s + easing / (100 * Math.PI) * Math.sin(Math.PI * s)) + start;
				}
				return {
					set: function(options) {
						this.stop();
						if (options.startY == undefined) options.startY = getCurrentY();
						param = $.extend(param, options);
						param.lastY = param.startY;
						timerId = setTimeout(move, c.ms); 
					},
					stop: function(){
						clearTimeout(timerId);
						param.stepCount = 0;
					}
				};
			})();
			$('a[href^=#], area[href^=#]').not('a[href=#], area[href=#]').each(function(){
				this.hrefdata = new $.library.analysis(this.getAttribute('href'));
			}).click(function(){
				var target = $('#'+this.hrefdata.fragment);
				if (target.length == 0) target = $('a[name='+this.hrefdata.fragment+']');
				if (target.length) {
					scroller.set({
						endY: target.offset().top,
						hrefdata: this.hrefdata
					});
					return false;
				}
			});
			/*
			var scroller = (function() {
				var c=$.extend({easing:100,step:30,fps:60,fragment:''},options);c.ms=Math.floor(1000/c.fps);var timerId;var param={stepCount:0,startY:0,endY:0,lastY:0};
				function move(){if(param.stepCount==c.step){window.scrollTo(getCurrentX(),param.endY);}else if(param.lastY==getCurrentY()){param.stepCount++;window.scrollTo(getCurrentX(),getEasingY());param.lastY=getEasingY();timerId=setTimeout(move,c.ms);}else{if(getCurrentY()+getViewportHeight()==getDocumentHeight()){setFragment(param.hrefdata.absolutePath);}}}function setFragment(path){location.href=path}function getCurrentY(){return document.body.scrollTop||document.documentElement.scrollTop;}function getCurrentX(){return document.body.scrollLeft||document.documentElement.scrollLeft;}function getDocumentHeight(){return document.documentElement.scrollHeight||document.body.scrollHeight;}function getViewportHeight(){return(!$.browser.safari && !$.browser.opera)?document.documentElement.clientHeight||document.body.clientHeight||document.body.scrollHeight:window.innerHeight;}function getEasingY(){return Math.floor(getEasing(param.startY,param.endY,param.stepCount,c.step,c.easing));}function getEasing(start,end,stepCount,step,easing){var s=stepCount/step;return(end - start) *(s+easing/(100 * Math.PI) * Math.sin(Math.PI * s))+start;}return{set:function(options){this.stop();if(options.startY==undefined) options.startY=getCurrentY();param=$.extend(param,options);param.lastY=param.startY;timerId=setTimeout(move,c.ms);},stop:function(){clearTimeout(timerId);param.stepCount=0;}};
			})();
			$('a[href^=#],area[href^=#]').not('a[href=#],area[href=#]').each(function(){this.hrefdata=new $.library.analysis(this.getAttribute('href'));}).click(function(){var target=$('#'+this.hrefdata.fragment);if(target.length==0) target=$('a[name='+this.hrefdata.fragment+']');if(target.length){scroller.set({endY:target.offset().top+30,hrefdata:this.hrefdata});return false;}});
			*/
		},
		pagetop: function(Target,options){
			var c = $.extend({
				duration : 500,
				easing : 'easeOutQuint'
			}, options);
			
			if($.browser.msie && parseInt($.browser.version)==6){
				$(Target).css('position','absolute');
			}
			scrollFade();
			$(Target).css('top',$(window).height()-$(Target).height()-20);
			
			var agent = navigator.userAgent;
			$(window).scroll(function(){
				if(agent.search(/iPhone/) != -1){
					$(Target).hide();
				}else if(agent.search(/Android/) != -1){
					$(Target).hide();
				}else if(agent.search(/iPad/) != -1){
					$(Target).hide();
				}else{
					scrollFade();
				}
			});
			$(window).resize(function(){
				scrollFade();
			});
			function scrollFade(){
				if($('#News').offset().top/2<$(window).scrollTop()){
					if($.browser.msie && parseInt($.browser.version)==6){
						$(Target).stop(false,false).animate({'top':$(window).scrollTop()+$(window).height()-$(Target).height()-20},{duration:c.duration,easing:c.easing}).show();
					}else{
						$(Target).css('top',$(window).height()-$(Target).height()-20).fadeIn();
					}
				}else{
					if($.browser.msie && parseInt($.browser.version)==6){
						$(Target).hide();
					}else{
						$(Target).fadeOut();
					}
				}
			}
		},
		global: function(Target,options){
			var c = $.extend({
				duration : 500,
				easing : 'easeOutQuint'
			}, options);
			var offsetMargin = 100;
			
			//ini
			CheckPosition();
			var HeaderHeight = $('#Header').height();
			if(HeaderHeight > $(window).height()){
				$('#Header').height($(window).height());
				$(Target).css('top',$('#Header').height()-$(Target).outerHeight());
				
			}
			$('#GlobalNav div.inline ul.btn li span').hide();
			
			//each
			$('#GlobalNav ul.btn li a img').each(function(){
				var $Clone = $(this).clone();
				$(this).parent().css({
					'width':$(this).width(),
					'height':$(this).height(),
					'display':'block',
					'position':'relative'
				});
				$(this).after($Clone.css({
					'opacity':'0',
					'position':'absolute',
					'top':'0',
					'left':'0'
				}).attr('src',$(this).attr('src').replace(".gif","_on.gif")).addClass('clone'));
			});
			
			//hover
			$('#GlobalNav ul.nav li a').hover(function(){
				$('#GlobalNav div.active').stop(false,false).animate({
					'width' : $(this).outerWidth(),
					'left' : $(this).position().left,
					'opacity' : '1'
				},{duration:c.duration,easing:c.easing});
			},function(){
				var activeLeft = '';
				$('#GlobalNav ul.nav li a').each(function(){
					if($(this).hasClass('active')){
						activeLeft = $(this).position().left;
						activeWidth = $(this).outerWidth();
					}
				});
				if(activeLeft != ''){
					$('#GlobalNav div.active').stop(false,false).animate({'width':activeWidth,'left':activeLeft,'opacity':'1'},{duration:c.duration,easing:c.easing});
				}else{
					$('#GlobalNav div.active').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
				}
			});
			$('#GlobalNav ul.btn li a').hover(function(){
				$(this).find('img.clone').stop(false,false).animate({'opacity':'1'},{duration:c.duration,easing:c.easing});
				$(this).next().show();
				//$('#GlobalNav ul.btn li.'+$(this).parent().attr('class')+' span').fadeIn(c.duration);
			},function(){
				$(this).find('img.clone').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
				$(this).next().hide();
				//$('#GlobalNav ul.btn li.'+$(this).parent().attr('class')+' span').fadeOut(c.duration);
			});
			
			//click
			$('#GlobalNav ul.nav li a').click(function(){
				$('#GlobalNav ul.nav li a').removeClass('active');
				$(this).addClass('active');
			});
			
			//scroll
			$(window).scroll(function(){
				if($(this).scrollTop() >= $('#Organization').offset().top-offsetMargin){
					moveNav('#GlobalNav ul li.organization a');
				}else if($(this).scrollTop() >= $('#Mission').offset().top-offsetMargin){
					moveNav('#GlobalNav ul li.mission a');
				}else if($(this).scrollTop() >= $('#News').offset().top-offsetMargin){
					moveNav('#GlobalNav ul li.news a');
				}else if($(this).scrollTop() <= $('#News').offset().top){
					$('#GlobalNav div.active').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
				}
				CheckPosition();
			});
			
			//resize
			$(window).resize(function(){
				CheckPosition();
				if(HeaderHeight > $(window).height()){
					$('#Header').height($(window).height());
					$(Target).css('top',$('#Header').height()-$(Target).outerHeight());
				}
				//$('#Header,#Header h1').height($(window).height());
			});
			
			function moveNav(moveActive){
				$('#GlobalNav ul.nav li a').removeClass('active');
				$(moveActive).addClass('active');
				$('#GlobalNav div.active').stop(false,false).animate({
					'width' : $(moveActive).outerWidth(),
					'left' : $(moveActive).position().left,
					'opacity' : '1'
				},{duration:c.duration,easing:c.easing});
			}
			function CheckPosition(){
				//var firstWin = $(window).height()-$(Target).outerHeight();
				var firstWin = $('#Header').height()-$(Target).outerHeight();
				var agent = navigator.userAgent;
				if(firstWin <= $(window).scrollTop()){
					if($.browser.msie && parseInt($.browser.version) == 6){
						$(Target).stop(false,false).animate({'top':$(window).scrollTop()},{duration:c.duration,easing:c.easing});
					}else if(agent.search(/iPhone/) != -1){
						$(Target).stop(false,false).animate({'top':$(window).scrollTop()},{duration:c.duration,easing:c.easing});
					}else if(agent.search(/Android/) != -1){
						$(Target).stop(false,false).animate({'top':$(window).scrollTop()},{duration:c.duration,easing:c.easing});
					}else if(agent.search(/iPad/) != -1){
						$(Target).stop(false,false).animate({'top':$(window).scrollTop()},{duration:c.duration,easing:c.easing});
					}else{
						$(Target).css({'position':'fixed','top':'0'});
					}
				}else{
					$(Target).css({'position':'absolute','top':firstWin});
				}
			}
		},
		googlemap: function(Target,lat,lng){
			var mapdiv=document.getElementById(Target);
			var latlng=new google.maps.LatLng(lat,lng);
			var myOptions={zoom:17,center:latlng,mapTypeId:google.maps.MapTypeId.ROADMAP,scaleControl:true};
			var map=new google.maps.Map(mapdiv,myOptions);
			var marker=new google.maps.Marker({position:latlng,map:map});
		},
		accordion: function(Target,options){
			var c = $.extend({
				duration : 300,
				easing : 'linear',
				openclass : 'open'
			}, options);
			var heightBody = [];
			
			$(Target).each(function(i){
				heightBody['Id-'+i] = $(this).find('div.art-body').attr('id','Id-'+i).height();
				$(this).find('div.art-body').height('0').parent().removeClass(c.openclass);
			});
			
			$(Target).find('div.art-head').click(function(){
				var $thisClick = $(this).parent().find('div.art-body');
				
				if($(this).parent().hasClass(c.openclass)){
					$(Target).removeClass(c.openclass);
				}else{
					$(Target).removeClass(c.openclass);
					$(this).parent().addClass(c.openclass);
				}
				$(Target).each(function(){
					if($(this).hasClass(c.openclass)){
						$thisClick.stop(false,true).animate({'height':heightBody[$thisClick.attr('id')]+'px'},{duration:c.duration,easing:c.easing});
					}else{
						$(this).find('div.art-body').stop(false,true).animate({'height':'0'},{duration:c.duration,easing:c.easing});
					}
				});
			});
			
			var geturl = location.hash.split('?');
			var Hash = geturl[0];
			var Pram = geturl[1];
			
			if(Hash != ''){
				setTimeout(function(){
					$("html,body").animate({scrollTop:$(Hash).offset().top+30},{duration:800,easing:'easeOutCirc'});
				},2000);
			}
			$(Target).eq(0).find('div.art-head').click();
			if(Pram != ''){
				$('#'+Pram).find('div.art-head').click();
			}
		},
		organization: function(Target,options){
			var c = $.extend({
				duration : 500,
				easing : 'easeOutQuint'
			}, options);
			var $Target = $(Target);
			
			//each
			$Target.find('a img').each(function(){
				var $Clone = $(this).clone();
				$(this).parent().css({
					'width':$(this).width(),
					'height':$(this).height(),
					'display':'block',
					'position':'relative'
				});
				$(this).after($Clone.css({
					'opacity':'0',
					'position':'absolute',
					'top':'0',
					'left':'0'
				}).attr('src',$(this).attr('src').replace(".gif","_on.gif")).addClass('clone'));
			});
			
			//hover
			$Target.find('ul.list li a').hover(function(){
				if(!$(this).hasClass('active')){
					$(this).find('img.clone').stop(false,false).animate({'opacity':'1'},{duration:c.duration,easing:c.easing});
					$(this).parent().css('z-index','20');
				}
			},function(){
				if(!$(this).hasClass('active')){
					$(this).find('img.clone').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
					$(this).parent().css('z-index','10');
				}
			});
			$Target.find('div.details p a').hover(function(){
				if(!$(this).hasClass('active')){
					$(this).find('img.clone').stop(false,false).animate({'opacity':'1'},{duration:c.duration,easing:c.easing});
					$(this).parent().css('z-index','40');
				}
			},function(){
				if(!$(this).hasClass('active')){
					$(this).find('img.clone').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
					$(this).parent().css('z-index','35');
				}
			});
			$Target.find('div.details ul.thum li a').hover(function(){
				if(!$(this).hasClass('active')){
					$(this).find('img.clone').stop(false,false).animate({'opacity':'1'},{duration:c.duration,easing:c.easing});
				}
				$(this).next().stop(false,false).animate({'opacity':'1'},{duration:c.duration,easing:c.easing});
			},function(){
				if(!$(this).hasClass('active')){
					$(this).find('img.clone').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
				}
				$(this).next().stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
			});
			
			//click
			$Target.find('ul.list li a').click(function(){
				//$Target.find('ul.list li a').removeClass('active');
				//$(this).addClass('active');
				btnReset();
				detailShow($(this).parent().attr('class'));
				thumNavActive($(this).parent().attr('class'));
				$Target.find('div.details').fadeIn(c.duration);
				
				$Target.find('div.details').after('<div class="wrap">wrap</div>');
				$('#Organization div.wrap').css({
					'width':$Target.outerWidth({margin:true}),
					'height':$Target.outerHeight({margin:true}),
					'position':'absolute',
					'top':'0',
					'left':'0',
					'z-index':'29',
					'opacity':'0'
				});
				
				return false;
			});
			
			$Target.find('div.details p.prev a').click(function(){
				if($Target.find('div.details p.active').attr('id') == 'dv01'){
					detailShow('dv04');
					//navActiv('dv04');
					thumNavActive('dv04');
				}else{
					detailShow($Target.find('div.details p.active').prev().attr('id'));
					//navActiv($Target.find('div.details p.active').attr('id'));
					thumNavActive($Target.find('div.details p.active').attr('id'));
				}
				return false;
			});
			
			$Target.find('div.details p.next a').click(function(){
				if($Target.find('div.details p.active').attr('id') == 'dv04'){
					detailShow('dv01');
					//navActiv('dv01');
					thumNavActive('dv01');
				}else{
					detailShow($Target.find('div.details p.active').next().attr('id'));
					//navActiv($Target.find('div.details p.active').attr('id'));
					thumNavActive($Target.find('div.details p.active').attr('id'));
				}
				return false;
			});
			
			$Target.find('ul.thum li a').click(function(){
				detailShow($(this).parent().attr('class'));
				//navActiv($(this).parent().attr('class'));
				thumNavActive($(this).parent().attr('class'));
				return false;
			});
			
			$Target.find('div.details p.close a').click(function(){
				$Target.find('div.details').fadeOut();
				$Target.find('div.details p.main').hide();
				$Target.find('ul.list li a').removeClass('active');
				btnReset();
				$('#Organization div.wrap').remove();
				return false;
			});
			
			
			function btnReset(){
				$Target.find('ul.list li a').each(function(){
					if(!$(this).hasClass('active')){
						$(this).find('img.clone').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
						$(this).parent().css('z-index','10');
					}
				});
			}
			function navActiv(Id){
				$Target.find('ul.list li a').removeClass('active');
				$Target.find('ul.list li.'+Id+' a').addClass('active');
				btnReset();
				$Target.find('ul.list li.'+Id+' a').find('img.clone').stop(false,false).animate({'opacity':'1'},{duration:c.duration,easing:c.easing});
				$Target.find('ul.list li.'+Id+' a').parent().css('z-index','20');
			}
			function detailShow(Id){
				$Target.find('div.details p.main').removeClass('active');
				$Target.find('div.details #'+Id).addClass('active');
				
				$Target.find('div.details p.main').each(function(){
					if($(this).hasClass('active')){
						$(this).fadeIn(c.duration);
					}else{
						
						$(this).fadeOut(c.duration,function(){$(this).hide();});
					}
				});
			}
			function thumNavActive(Id){
				$Target.find('ul.thum li a').removeClass('active');
				$Target.find('ul.thum li.'+Id+' a').addClass('active');
				
				$Target.find('ul.thum li a').each(function(){
					if($(this).hasClass('active')){
						$(this).find('img.clone').stop(false,false).animate({'opacity':'1'},{duration:c.duration,easing:c.easing});
					}else{
						$(this).find('img.clone').stop(false,false).animate({'opacity':'0'},{duration:c.duration,easing:c.easing});
					}
				});
			}
		},
		parallax: function(options){
			var c = $.extend({
				duration : 100,
				easing : 'easeOutQuint'
			}, options);
			$(window).scroll(function(){
				
				$('#Header div.camouflage01').stop(false,true).animate({'bottom':'-'+$(this).scrollTop()*0.8+'px'},{duration:c.duration,easing:c.easing});
				$('#Header div.camouflage02').stop(false,true).animate({'bottom':'-'+$(this).scrollTop()*0.6+'px'},{duration:c.duration,easing:c.easing});
				$('#Header div.camouflage03').stop(false,true).animate({'bottom':'-'+$(this).scrollTop()*0.4+'px'},{duration:c.duration,easing:c.easing});
				/*
				$('#Header div.camouflage01').css({'bottom':'-'+$('html,body').scrollTop()*0.8+'px'});
				$('#Header div.camouflage02').css({'bottom':'-'+$('html,body').scrollTop()*0.6+'px'});
				$('#Header div.camouflage03').css({'bottom':'-'+$('html,body').scrollTop()*0.4+'px'});
				*/
			});
		},
		social: function(){
			//#News div.news-list div.articles div.art-body div.social
			$('#News div.news-list div.articles').each(function(){
				var Id = $(this).attr('id');
				var Url = 'http://www.chameleon-holdings.jp/#News?'+Id;
				var Title = '【CHAMELEON HOLDINGS】'+$(this).find('.art-head .title').text();
				$('#'+Id+' .social .g-plusone').attr('data-heaf',Url);
				$('#'+Id+' div.facebook').socialbutton('facebook_like',{url:Url});
				$('#'+Id+' div.tweet').socialbutton('twitter',{url:Url,text:Title});
				$('#'+Id+' div.mixi').socialbutton('mixi_check',{url:Url});
				$('#'+Id+' div.hatena').socialbutton('hatena',{url:Url,title:Title});
			});
			
		}
	};
	
	$(function(){
		$.library.rollover();
		$.library.global('#GlobalNav');
		$.library.scroll();
		$.library.pagetop('p.pagetop');
		$.library.accordion('#News div.articles');
		$.library.organization('#Organization div.division');
		$.library.googlemap('OsakaMap',34.675385,135.498794);
		$.library.googlemap('TokyoMap',35.623508,139.749316);
		$.library.parallax();
		$.library.social();
		$('a').focus(function(){this.blur();});
	});
})(jQuery);