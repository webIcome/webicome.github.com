//通用函数
var EventUtil={
    addHandler: function (element,type,handler) {
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
        }else {
            element["on"+type]=handler;
        }
    },

    
    getEvent: function (event) {
        return event?event:window.event;
    },
    
    getTarget: function (event){
        return event.target||event.srcElement;
    },
    
    preventDefault: function (event) {
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },

    removeHandler:  function (element,type,handler) {
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on"+type,handler);
        }else {
            element["on"+type]=null;
        }
    },
    
    stopPropagation: function (event) {
        if(event.stopPropagation){
            event.stopPropagation;
        }else{
            event.cancelBubble=true;
        }
    }
};

function addLoadEvent(func) {
    var oldonload=window.onload;
    if (typeof window.onload !='function') {
        window.onload=func;
    }else{
        window.onload=function () {
            oldonload();
            func();
        }
    }
}
//以上为通用函数

(function () {
    function ButttonHandler() {
        var main=document.querySelector(".exp_main");  
        var prev=document.querySelector(".prev");   
        var next=document.querySelector(".next"); 
        var list=document.querySelector(".exp_list");
        var item=list.querySelectorAll(".item");
        var dot=document.querySelector(".dot");
        var dots=dot.getElementsByTagName("span");
        var aside=document.getElementById("aside");
        var select=aside.getElementsByTagName("a");
       /* EventUtil.addHandler(aside,"click",function (event) {
            event=EventUtil.getEvent(event);
            var target=EventUtil.getTarget(event);
            if(target.className!="selected"){
                for(var i=0;i<5;i++){
                    select[i].className="";
                }
                target.className="selected";
            }
        });*/
        EventUtil.addHandler(document,"mousewheel",Wheelhandle);
        EventUtil.addHandler(window,"DOMMouseScroll",Wheelhandle);//firefox
        EventUtil.addHandler(window,"scroll",Wheelhandle);
        function Wheelhandle(event) {
            var bodyscrolltop=document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
            if(bodyscrolltop<600){
                for(var i=0;i<5;i++){
                    select[i].className="";
                }
                select[0].className="selected";
            }else if(bodyscrolltop>600&&bodyscrolltop<1230){
                for(var i=0;i<5;i++){
                    select[i].className="";
                }
                select[1].className="selected";
            }else if(bodyscrolltop>1230&&bodyscrolltop<1850){
                for(var i=0;i<5;i++){
                    select[i].className="";
                }
                select[2].className="selected";
            }else if(bodyscrolltop>1850&&bodyscrolltop<2350){
                for(var i=0;i<5;i++){
                    select[i].className="";
                }
                select[3].className="selected";
            }else if(bodyscrolltop>2350){
                for(var i=0;i<5;i++){
                    select[i].className="";
                }
                select[4].className="selected";
            }
        }
        //工作经历轮播函数
        function Carousel() {
            var animated = false;
            var index=0;
            var timer=null;
            var offset="";
            window.onresize=function () {
               list.style.left=0;
            }
            EventUtil.addHandler(prev,"click",function () {
                if(animated){
                    return;
                }
                index--;
                if(index<0){
                    index=item.length-1;
                }else if(index>item.length-1){
                    index=0;
                }
                offset=parseInt(list.offsetWidth)/item.length
                Animate(offset);
                Showdot()
            });
            EventUtil.addHandler(next,"click",function () {
                if(animated){
                    return;
                }
                index++;
                if(index<0){
                    index=item.length-1;
                }else if(index>item.length-1){
                    index=0;
                }
                offset=-parseInt(list.offsetWidth)/item.length;
                Animate(offset);
                Showdot();
            });
           /* var timer=setInterval(function () {
                index++;
                if(index<0){
                    index=item.length-1;
                }else if(index>item.length-1){
                    index=0;
                }
                Animate(-parseInt(list.offsetWidth)/item.length);
                Showdot();
            },3000);*/
            EventUtil.addHandler(dot,"click",function (event) {
                if(animated){
                    return;
                }
                event=EventUtil.getEvent(event);
                var target=EventUtil.getTarget(event);
                if(target.className=="active"){
                    return;
                }
                for(var i=0;i<dots.length;i++){
                    if(dots[i]===target){
                        index=i;
                    }
                    if(dots[i].className=="active"){
                        var j=i;
                    }
                }
                offset=-(parseInt(list.offsetWidth)/item.length)*(index-j);
                Animate(offset);
                Showdot();
            });
            function Showdot() {
                for(var i=0;i<dots.length;i++){
                    if(dots[i].className=="active"){
                        dots[i].className="";
                        break;
                    } 
                }
                dots[index].className="active";
            }
            function Animate(offset) {
                animated = true;
                var time = 100;
                var inteval = 20;
                var speed = offset/(time/inteval);
                var left = parseInt(list.style.left) + offset;
                function go(){
                    if(left==list.offsetWidth/item.length){
                        list.style.left = (-list.offsetWidth+list.offsetWidth/item.length) + 'px';
                        animated = false;
                    }else if(left==(-list.offsetWidth)){
                        list.style.left=0;
                        animated = false;
                     }else if ( speed < 0 && parseInt(list.style.left) > left){
                            list.style.left = parseInt(list.style.left) + speed + 'px';
                            setTimeout(go, inteval);
                    }else if ( speed > 0 && parseInt(list.style.left) < left){
                            list.style.left = parseInt(list.style.left) + speed + 'px';
                            setTimeout(go, inteval);
                    }
                    else {
                        list.style.left = left + 'px';
                        animated = false;
                    }
                }
                go();
            }
            function play() {
                timer=setInterval(function () {
                    if(animated){
                       return;
                    }
                index++;
                if(index<0){
                    index=item.length-1;
                }else if(index>item.length-1){
                    index=0;
                }
                offset=parseInt(list.offsetWidth)/item.length
                Animate(offset);
                Showdot();
            },3000);
            }
            function stop() {
                clearTimeout(timer);
            }
            main.onmouseover=stop;
            main.onmouseout=play;
            play();
        }
        Carousel();
        //轮播函数结束
    }

    addLoadEvent(ButttonHandler);

})()