/*
网页可见区域宽： document.body.clientWidth; 
网页可见区域高： document.body.clientHeight; 
网页可见区域宽： document.body.offsetWidth (包括边线和滚动条的宽); 
网页可见区域高： document.body.offsetHeight (包括边线的宽); 
网页正文全文宽： document.body.scrollWidth; 
网页正文全文高： document.body.scrollHeight; 
网页被卷去的高(ff)：document.body.scrollTop; 
网页被卷去的高(ie): document.documentElement.scrollTop; 
网页被卷去的左：document.body.scrollLeft; 
网页正文部分上：window.screenTop; 
网页正文部分左：window.screenLeft; 
某个元素的宽度：obj.offsetWidth;
某个元素的高度：obj.offsetHeight;
某个元素的上边界到body最顶部的距离：obj.offsetTop;（在元素的包含元素不含滚动条的情况下）
某个元素的左边界到body最左边的距离：obj.offsetLeft;（在元素的包含元素不含滚动条的情况下）
返回当前元素的上边界到它的包含元素的上边界的偏移量：obj.offsetTop（在元素的包含元素含滚动条的情况下）
返回当前元素的左边界到它的包含元素的左边界的偏移量：obj.offsetLeft（在元素的包含元素含滚动条的情况下）
*/

// 事件绑定
var EventUtil = {
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type,handler,false);
        } else if (element.attachEvent) {
            element.attachEvent("on"+type,handler);
        } else {
            element["on"+type] = handler;
        }
    },

    getEvent: function(event){
        return event ? event : window.event;
    },

    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type,handler,false);
        } else if (element.detachEvent) {
            element.detachEvent("on"+type,handler);
        } else {
            element["on"+type] = null;
        }
    }
}

function Scale(param){
   this.moveX = 0;    //鼠标移动的水平坐标
   this.downX = 0;    //鼠标按下的时候的水平坐标
   this.clickX = 0;   //鼠标点击时候的水平坐标
   this.originalX = 0;  //鼠标移动前的坐标
   this.newX = 0;       //鼠标移动后的坐标
   this.init(param);
}

Scale.prototype = {
   newPosition : function(position){
   	    this.button.style.left = position + "px";  
        this.fontchange.style.fontSize = (position <= 5 ? 16 : position/5) + "px";  
        this.scale.innerHTML = position/5;
   },
   mouseMove : function(event){   //移动鼠标时，获取相应的坐标值
        event = EventUtil.getEvent(event);
        this.moveX = event.clientX;
        this.newX = this.originalX + (this.moveX - this.downX);
        this.newX <= 0 ? this.newX = 0 : this.newX; 
        this.newX >= this.bar.clientWidth ? this.newX = this.bar.clientWidth : this.newX; 
        this.newPosition(this.newX);
   },
   mouseClick : function(event){    //在刻度栏点击鼠标，获取相应的坐标值
        event = EventUtil.getEvent(event);
        var ratingLeft = rating.offsetLeft;
        this.clickX = event.clientX;
        var move = this.clickX - ratingLeft;
        this.newPosition(move);
   },
   init : function(param){   
   	    var _self = this;
        this.rating = param . rating;
        this.bar = param . bar;
        this.button = param . button;
        this.fontchange =param . fontchange ;
        this.scale = param . scale;
        var mouseMove=function() {          
            _self.mouseMove();
        };  

        EventUtil.addHandler(this.button,"mousedown",function(event) {   //用户按下任意鼠标按钮时触发
            event = EventUtil.getEvent(event);
            _self.originalX = _self.button.offsetLeft;
            _self.downX = event.clientX; 
            EventUtil.addHandler(document,"mousemove",mouseMove );    ////鼠标在元素内部移动时触发相应事件
        });

        EventUtil.addHandler(document,"mouseup",function(event) {   //用户释放鼠标时触发的事件
            EventUtil.removeHandler(document,"mousemove",mouseMove)
        });

        EventUtil.addHandler(this.bar,"click",function() {    //用户在刻度栏点击的时候触发该事件
            _self.mouseClick();
        });
   }
}
new Scale({
	rating : document.getElementById('rating'),
	bar : document.getElementById('bar'),
    button : document.getElementById('button'),    
    fontchange : document.getElementById('fontchange'),
    scale : document.getElementById('scale')
});