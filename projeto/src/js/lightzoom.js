// /*
//  Author: Jafar Akhondali
//  Release year: 2016
//  Title:	Light-Zoom JQuery plugin that use pure css to zoom on images, this enables you to zoom without loading bigger image and zoom even on gif images !
//  https://github.com/JafarAkhondali/lightzoom
//  */
// $.fn.lightzoom = function(options) {

//     var settings = $.extend({
//         zoomPower   : 3,
//         glassSize   : 175,
//     }, options);

//     var halfSize= settings.glassSize /2;
//     var quarterSize = settings.glassSize/4;

//     var zoomPower = settings.zoomPower;

//     $("body").append('<div id="glass"></div>');
//     $('html > head').append($('<style> #glass{width: '+settings.glassSize+'px; height: '+settings.glassSize+'px;}</style>'));


//     var faker;
//     var obj=this;

//     $("#glass").mousemove(function(event) {
//         var obj=this.targ;
//         event.target=obj;
//         faker(event,obj);
//     });

//     this.mousemove(function(event) {
//         faker(event,this);
//     });
//     faker=function(event,obj) {
//         //console.log(obj);
//         document.getElementById('glass').targ=obj;
//         var mx = event.pageX;
//         var my = event.pageY;
//         var bounding = obj.getBoundingClientRect();
//         var w = bounding.width;
//         var h = bounding.height;
//         var objOffset  = $(obj).offset();         
//         var ol = objOffset.left;
//         var ot = objOffset.top;
//         if(mx > ol &&  mx < ol + w  && ot < my  &&  ot+h > my ) {
//             offsetXfixer = ((mx-ol - w/2)/(w/2))*quarterSize;
//             offsetYfixer = ((my-ot - h/2)/(h/2))*quarterSize;
//             var cx = (((mx - ol + offsetXfixer ) / w)) * 100;
//             var cy = (((my - ot + offsetYfixer ) / h)) * 100;
//             my -= halfSize;
//             mx -= halfSize;
//             $("#glass").css({
//                 "top": (my),
//                 "left": (mx),
//                 "background-image" : " url('" + obj.src + "')",
//                 "background-size" : (w * zoomPower) + "px " + (h * zoomPower) + "px",
//                 "background-position": cx + "% " + cy + "%",
//                 "display" : "inline-block"
//             });
//             $("body").css("cursor","none");
//         }else {
//             $("#glass").css("display", "none");
//             $("body").css("cursor","default");
//         }
//     };
//     return this;
// };


$.fn.lightzoom = function (options) {

    var settings = $.extend({
        zoomPower: 3,
        glassSize: 175,
    }, options);

    var halfSize = settings.glassSize / 2;
    var quarterSize = settings.glassSize / 4;
    var zoomPower = settings.zoomPower;

    $("body").append('<div id="glass"></div>');
    $('html > head').append($('<style> #glass{width: ' + settings.glassSize + 'px; height: ' + settings.glassSize + 'px;}</style>'));

    var faker;
    var obj = this;

    function handleZoom(event, obj) {
        var mx, my;
        if (event.type.includes("touch")) {
            var touch = event.originalEvent.touches[0];
            mx = touch.pageX;
            my = touch.pageY;
        } else {
            mx = event.pageX;
            my = event.pageY;
        }

        document.getElementById('glass').targ = obj;
        var bounding = obj.getBoundingClientRect();
        var w = bounding.width;
        var h = bounding.height;
        var objOffset = $(obj).offset();
        var ol = objOffset.left;
        var ot = objOffset.top;

        if (mx > ol && mx < ol + w && ot < my && ot + h > my) {
            offsetXfixer = ((mx - ol - w / 2) / (w / 2)) * quarterSize;
            offsetYfixer = ((my - ot - h / 2) / (h / 2)) * quarterSize;
            var cx = (((mx - ol + offsetXfixer) / w)) * 100;
            var cy = (((my - ot + offsetYfixer) / h)) * 100;
            my -= halfSize;
            mx -= halfSize;
            $("#glass").css({
                "top": (my),
                "left": (mx),
                "background-image": "url('" + obj.src + "')",
                "background-size": (w * zoomPower) + "px " + (h * zoomPower) + "px",
                "background-position": cx + "% " + cy + "%",
                "display": "inline-block"
            });
            $("body").css("cursor", "none");
        } else {
            $("#glass").css("display", "none");
            $("body").css("cursor", "default");
        }
    }

    $("#glass").on("mousemove touchmove", function (event) {
        var obj = this.targ;
        handleZoom(event, obj);
        event.preventDefault();
    });

    this.on("mousemove touchmove", function (event) {
        handleZoom(event, this);
        event.preventDefault();
    });

    this.on("mouseleave touchend", function (event) {
        $("#glass").css("display", "none");
        $("body").css("cursor", "default");
    });

    return this;
};
