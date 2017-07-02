(function(){
	var qrcodeObj;
	var module = {
		intervalArr : [15000,30000,60000],
		curPage : 0,
		autoPlay : false,
		Timer : null,
		qrcodeInit : function(){
			qrcodeObj = new QRCode(comm.getById("J-qrcode"), {
				width : 160,//设置宽高
				height : 160
			});
		},
		setQrcode : function(url){
			qrcodeObj.makeCode(url);
		},
		qrcodeShow : function(url){
			var mask = comm.getById('J-mask');
			var qrcode = comm.getById('J-qrcode-wrap');
			var sHeight = document.body.scrollHeight;
			mask.style.height = sHeight + 'px';
			mask.style.display = 'block';
			qrcode.style.display = 'block';
			this.setQrcode(url);
		},
		qrcodeHide : function(){
			var mask = comm.getById('J-mask');
			var qrcode = comm.getById('J-qrcode-wrap');
			qrcode.style.display = 'none';
			mask.style.display = 'none';
		},
		setBook : function(){
			var book = $('#J-book').booklet({
				width: 1040,                   //容器宽度
				height: 704,                    //容器高度
				tabWidth : 520,              //tab页宽度
				//tabHeight : 350,              //tab页高度
				pagePadding: 0,            //tab页之间的padding值
				shadows: false,              //是否有阴影
				speed: 500,                    //翻页速度
				startingPage:0,              //初始显示页面
				pageNumbers: false,       //是否显示页码
				//direction:  'RTL',           //从右往左还是从左往右（关闭书本时的效果，即closed:true时）
				easing:  'easeInOutElastic',          //翻动效果
				//easeIn:  'easeInElastic',  //翻动效果 in 
				//easeOut: 'easeOutElastic',  //翻动效果 out 
				
				closed: true,          //关闭书本
				//covers: true,          //书本封皮
				//autoCenter : true,   //和关闭书本closed参数一起用，关闭时书本居中对齐
				//menu: '#custom-menu',//书本操作菜单 快捷定位某一页等 这个参数需要额外添加div id=“custom-menu”  
				//pageSelector: true,//紧跟上面的操作菜单 支持页码快捷定位  
				//overlays: false, 
				//manual: false,      //未知
				//auto: true,     //自动翻页
				//delay: 2000,//翻页间隔  
				//play: '#play',    //开启自动翻页按钮 需要额外添加 div id="play",需auto:true时才有效
				//pause: '#pause',  //停止自动翻页按钮 需要额外添加 div id="pause"  
				//keyboard: true,//开启键盘左右键 为页面翻动 默认为true
				//hash: true,//定位页数，头部添加如： #/page/3 来定位到制定页数，当来源网址需要定位到制定页面时刻通过此方法
				//tabs:true,//上一页 下一页 快捷按钮，默认放置在页面的左上角和右上角，可更改定位和样式，也可通过prev和next参数另外指定上一页和下一页按钮
				//arrows: true,//上一页下一页的左右快捷箭头大按钮，可更改定位和样式，也可通过prev和next另外指定按钮
				//arrowsHide: true//快捷箭头大按钮是否自动隐藏，当鼠标滑过就显示出来 
				//prev: '#custom-prev',//自定义的上一页a链接，需要额外添加 a id="custom-prev"  
				//next: '#custom-next',//自定义的下一页a链接，需要额外添加 a id="custom-next"
				//previousControlText : '上一页',
				//previousControlTitle : '上一页',
				//nextControlText : '下一页',
				//nextControlTitle : '下一页',
				//hovers : true,
				//hoverWidth : 100,
				//hoverTreshold : 0.5,

				create : function(){
					//console.log('创建回调函数执行，初始化完成时执行');

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
			//初始化
			this.qrcodeInit();
			//设置
			var btnViews = comm.getByClass('btn-view','J-works-wrap');
			if(btnViews.length>1){
				for(var i=0,len=btnViews.length;i<len;i++){
					(function(t){
						comm.addEvent(btnViews[t],'click',function(){
							var link = this.getAttribute('data-link');
							alert(link);
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
	module.init();
})();
