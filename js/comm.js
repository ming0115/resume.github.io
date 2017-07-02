var comm = {
	getById : function(id){
		return document.getElementById(id);
	},
	getByTagName : function(tag,parent){
		var oParent = parent?comm.getById(parent):document;
		var arr = oParent.getElementsByTagName(tag);
		return arr;
	},
	getByClass : function(className,parent){
		var oParent = parent?comm.getById(parent):document;
		if(oParent.getElementsByClassName){
			var arr = oParent.getElementsByClassName(className);
			if(arr.length == 1){
				return arr[0];
			}
			return arr;
		}else{
			var arr = [];
			var childs = oParent.getElementsByTagName('*');
			for(var i = 0,len = childs.length; i< len; i++){
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				if(childs[i].className.match(reg)){
					arr.push(childs[i]);
				}
			}
			if(arr.length == 1){
				return arr[0];
			}
			return arr;
		}
	},
	hasClass : function(obj, cls) {
		return obj.classList.contains(cls);
	},
	addClass : function(obj, cls) {
		if (this.hasClass(obj, cls)) return;
		obj.classList.add(cls);
	},
	removeClass : function(obj,cls){
		if (!this.hasClass(obj, cls))  return;
		obj.classList.remove(cls);
	},
	getClientH : function(){
		var clientH = document.documentElement.clientHeight;
		return clientH;
	},
	replaceSrc : function(obj, attr) {
		if(obj&&obj.getElementsByTagName('img')){
			var imgs =obj.getElementsByTagName('img');
			for(var i=0,len=imgs.length;i< len;i++){
				if(imgs[i].getAttribute(attr)){
					imgs[i].setAttribute('src',imgs[i].getAttribute(attr));
					imgs[i].removeAttribute(attr);
				}
			}
		}
	},
	addEvent: function(obj, type, handle) {
		obj.addEventListener ? obj.addEventListener(type, handle) : obj.attachEvent('on' + type, handle);
	},
	getEvent : function(e){
		return e || window.event;
	},
	getTarget : function(e){
		return e.target || window.event.srcElement;
	},
	stopPropagation : function(e) {
		if(e.stopPropagation){
			e.stopPropagation();
		}else {
			e.cancelBubble = true;
		}
	}
};
