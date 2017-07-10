(function(){
	var qrcodeObj;
	var module = {
		intervalArr : [15000,30000,60000],
		curPage : 0,
		autoPlay : false,
		Timer : null,
		loadingHide : function(){
			var mask = comm.getById('J-mask');
			var popLoading = comm.getById('J-popup-loading');
			mask.style.display = 'none';
			popLoading.style.display = 'none';
		},
		setQrcode : function(tar,url,w,h){
			$(tar).qrcode({
				render: "table", 
				width: w || 160,
				height:h ||160, 
				text: url
			});
		},
		qrcodeShow : function(url){
			var mask = comm.getById('J-mask');
			var qrcode = comm.getById('J-qrcode-wrap');
			var sHeight = document.body.scrollHeight;
			mask.style.height = sHeight + 'px';
			mask.style.display = 'block';
			qrcode.style.display = 'block';
			this.setQrcode('#J-qrcode',url);
		},
		qrcodeHide : function(){
			var mask = comm.getById('J-mask');
			var qrcode = comm.getById('J-qrcode-wrap');
			comm.getById('J-qrcode').innerHTML = '';
			qrcode.style.display = 'none';
			mask.style.display = 'none';
		},
		setBook : function(){
			var book = $('#J-book').booklet({
				width: 1040,                  
				height: 704,                    
				tabWidth : 520,              
				pagePadding: 0,            
				shadows: false,              
				speed: 500,                    
				startingPage:0,              
				pageNumbers: false,       
				easing:  'easeInOutElastic',          
				//easeIn:  'easeInElastic', 
				//easeOut: 'easeOutElastic',  
				closed: true,         
				create : function(){

					/* 开场动画 S */
					var cover = comm.getByClass('b-page-1','J-book');
					comm.addClass(cover,'play');
					var btnView = comm.getById('J-btn-view');
					setTimeout(function(){
						btnView.style.display = 'block';
					},3000);
					/* 开场动画 E */

					/* 初始化时延时执行 S */
					module.Timer = setTimeout(function(){
						$('#J-book').booklet('gotopage',3);
					},module.intervalArr[0]);
					/* 初始化时延时执行 E */
				},
				start : function(event,data){
					//清除延迟执行
					clearTimeout(module.Timer);

					var iconPageL = comm.getById('J-icon-page-l');
					var iconPageR = comm.getById('J-icon-page-r');
					if(data.index == 0){
						iconPageL.style.display = 'none';
					}
					if(data.index == 6){
						iconPageR.style.display = 'none';
					}
				},
				change : function(event,data){
					module.curPage = data.index;
					/* 页面叠加icon S */
					var iconPageL = comm.getById('J-icon-page-l');
					var iconPageR = comm.getById('J-icon-page-r');
					if(data.index!=0&&data.index != 6){
						iconPageL.style.display = 'block';
						iconPageR.style.display = 'block';
					}else{
						iconPageL.style.display = 'none';
						iconPageR.style.display = 'none';
					}
					/* 页面叠加icon E */

					/* 导航切换 S */
					var t = module.curPage/2;
					var navItems = comm.getByTagName('li','J-side-nav');
					for(var i=0,len=navItems.length;i<len;i++){
						comm.removeClass(navItems[i],'cur');
					}
					comm.addClass(navItems[t],'cur');
					/* 导航切换 E */

					/* 延时执行 S */
					var index = data.index;
					if(index<6&&module.autoPlay){
						var k = index/2;
						module.Timer = setTimeout(function(){
							index += 2;
							$('#J-book').booklet('gotopage',index);
							//console.log('间隔'+module.intervalArr[k]+'秒执行')
						},module.intervalArr[k]);
					}
					/* 延时执行 E */
				}
			});

			/* 侧栏导航 S */
			var navItems = comm.getByTagName('li','J-side-nav');
			comm.addClass(navItems[0],'first');
			comm.addClass(navItems[0],'cur');
			for(var i=0,len=navItems.length;i<len;i++){
				(function(t){
					comm.addEvent(navItems[t],'click',function(){
						//console.log(t);
						var k = t*2;
						$('#J-book').booklet('gotopage',k);  //翻到第几页
					});
				})(i);
			}
			/* 侧栏导航 E */

			/* 查看按钮 S */
			var btnView = comm.getById('J-btn-view');
			comm.addEvent(btnView,'click',function(){
				$('#J-book').booklet('gotopage',2);
			});
			/* 查看按钮 E */
		},
		init : function(){

			/* 翻页 S */
			this.setBook();
			/* 翻页 E */
			
			/* 鼠标经过离开控制延时执行 S */
			var book = comm.getById('J-book');
			comm.addEvent(book,'mouseover',function(e){
				module.autoPlay = false;
				var evt = comm.getEvent(e);
				var tar = comm.getTarget(evt);
				if(module.curPage<6){
					clearTimeout(module.Timer);
					//console.log('鼠标经过');
				}
			});
			comm.addEvent(book,'mouseout',function(e){
				module.autoPlay = true;
				if(module.curPage<6){
					var k = module.curPage/2;
					module.Timer = setTimeout(function(){
						var index = module.curPage + 2;
						$('#J-book').booklet('gotopage',index);
						//console.log('间隔'+module.intervalArr[k]+'秒执行')
					},module.intervalArr[k]);
					//console.log('鼠标离开');
				}
			});
			/* 鼠标经过离开控制延时执行 E */

			/* 二维码控制 S */
			//关闭
			var btnClose = comm.getById('J-btn-close');
			comm.addEvent(btnClose,'click',function(){
				module.qrcodeHide();
			});
			//设置
			var btnViews = comm.getByClass('btn-view','J-works-wrap');
			if(btnViews.length>1){
				for(var i=0,len=btnViews.length;i<len;i++){
					(function(t){
						comm.addEvent(btnViews[t],'click',function(){
							var link = this.getAttribute('data-link');
							//alert(link);
							module.qrcodeShow(link);
						});
					})(i);
				}
			}else{
				comm.addEvent(btnViews,'click',function(){
					var link = this.getAttribute('data-link');
					//alert(link);
					module.qrcodeShow(link);
				});
			}
			/* 二维码控制 E */
		}
	}
	window.module = module;
	//module.init();
})();
