// Declaring sound assets
var bgMusic = new Howl({
    src: ['sound/fightsong.wav'],
    autoplay: false,
    loop: false,
    volume: 0.05,
});

var gallop = new Howl({
    src: ['sound/gallop.mp3'],
    autoplay: true,
    loop: true,
    volume: 0,
});

var thump = new Howl({
    src: ['sound/thump.mp3'],
    autoplay: false,
    loop: false,
    volume: 4,
});

/*
function takeLSD() {
    $("#game_wrap *").css("animation","trip 2s infinite linear");
}
*/

// GUI Draggables and window functionalities
$("#stage1").draggable({
    delay: 10,
    start: function() {
        followRam = false;  
    },
    scroll: false,
});

$("#debug").draggable({
    scroll: false,
    //containment: "#game_wrap"
});

$("#lessons").draggable({
    scroll: false,
    //containment: "#game_wrap",
    handle: "#lessonBar",
    start: function() {
        if( $("#lessons").attr("class").indexOf("docked") >= 0) {
            $("#game_wrap").css("width", "calc(100%)");
        }
        $("#lessons").removeClass("docked");
        $("#lessons").addClass("resizable");
        
        editor1.resize();
        editor2.resize();
        editor3.resize();
    },
    stop: function() {
        if( $("#editorWrap").attr("class").indexOf("docked") < 0 ) {
           if( collision( $("#lessons"), $("#sideDropZone") ) ) {
               $("#lessons").addClass("docked");
               $("#lessons").removeClass("resizable");
               $("#lessons").css("height", "100%");
               $("#lessons").css("width", "400px");
               $("#lessons").css({
                   "left": "calc(100% - 400px)",
                   "top": "0",
               });
               $("#game_wrap").css("width", "calc(100% - 400px)");
               editor1.resize();
               editor2.resize();
               editor3.resize();
           }
        }
    }
});

$(".resizer").draggable();

$("#editorWrap").draggable({
    scroll: false,
    //containment: "#game_wrap",
    handle: "#editorBar",
    start: function() {
        if( $("#editorWrap").attr("class").indexOf("docked") >= 0) {
            $("#game_wrap").css("width", "calc(100%)");
        }
        $("#editorWrap").removeClass("docked");
        $("#editorWrap").addClass("resizable");
        $("#game_wrap").css("width", "calc(100%)");
        editor1.resize();
        editor2.resize();
        editor3.resize();
    },
    stop: function() {
        if( $("#lessons").attr("class").indexOf("docked") < 0 ) {
            if( collision( $("#editorWrap"), $("#sideDropZone") ) ) {
               $("#editorWrap").addClass("docked");
               $("#editorWrap").removeClass("resizable");
               $("#editorWrap").css("height", "100%");
               $("#editorWrap").css({
                   "left": "calc(100% - 400px)",
                   "top": "0",
               });
               $("#game_wrap").css("width", "calc(100% - 400px)");
               editor1.resize();
               editor2.resize();
               editor3.resize();
           }
        }
    }
});

$(".collapse").click(function() {
    $(this).closest(".collapsible").toggleClass("collapsed");
})

$("#tab1").click(function() {
    $(this).addClass("activeTab");
    $("#tab2").removeClass("activeTab");
    $("#tab3").removeClass("activeTab");
    $("#editor1").show();
    $("#editor2").hide();
    $("#editor3").hide();
    editor.resize();
    editor2.resize();
    editor3.resize();
})

$("#tab2").click(function() {
    $(this).addClass("activeTab");
    $("#tab1").removeClass("activeTab");
    $("#tab3").removeClass("activeTab");
    $("#editor2").show();
    $("#editor1").hide();
    $("#editor3").hide();
    editor.resize();
    editor2.resize();
    editor3.resize();
})

$("#tab3").click(function() {
    $(this).addClass("activeTab");
    $("#tab1").removeClass("activeTab");
    $("#tab2").removeClass("activeTab");
    $("#editor3").show();
    $("#editor1").hide();
    $("#editor2").hide();
    editor.resize();
    editor2.resize();
    editor3.resize();
})

// Creates out of view HTML canvas with collision map to detect collision with buildings
var img = document.getElementById('collision');
var canvas = document.createElement('canvas');
$(function() {
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
})

// Converts pixel coordinates to block coordinates specifically for Rameses (50x50)
function pxToBlock(px) {
    if(rameses.direction == "E" || rameses.direction == "S") {
        return Math.ceil(px/50);
    } else {
        return Math.floor(px/50);
    }
}

// Converts pixel coordinatess to block coordinates using Math.floor()
function pxToBlockFloor(px) {
    return Math.floor(px/50);
}

// Converts block coordinates to pixel coordinates
function blockToPx(block) {
    return block*50;
}

// Updates cursor position for testing purposes
$("#game_wrap").on( "mousemove", function( event ) {
    cursor.pX = event.pageX - parseInt( $("#stage1").offset().left );
    cursor.pY = event.pageY - parseInt( $("#stage1").offset().top );
    cursor.bX = pxToBlockFloor(cursor.pX);
    cursor.bY = pxToBlockFloor(cursor.pY);
});

// Move Rameses using cursor control for testing purposes
$("#game_wrap").click(function() {
    if( cursor.control ) {
        //$("#rameses").stop(true,false);
        rameses.move(cursor.bX - rameses.X, cursor.bY - rameses.Y);
        rameses.distanceLeft += Math.abs(cursor.bX - rameses.X) + Math.abs(cursor.bY - rameses.Y);
    }
})

var screenHeight = $("#game_wrap").outerHeight();
var screenWidth = $("#game_wrap").outerWidth();

// Center object on screen
function center(object, callBack) {
    if(object == null) {
        throw new TypeError("center() only accepts objects");
    }
    $("#stage1").animate({
            left: (screenWidth/2 - object.pX - 25),
            top: (screenHeight/2 - object.pY - 25),
        }, 250, callBack
    ) 
}

// Triggers when Rameses collides with boundaries or obstagles
function ramesesCollided() {
    $("#rameses").stop(true,false);
    rameses.distanceLeft = 0;
    clearTimeouts();
    $("#rameses_sprite").append("<div id='hit_mark'></div>");
    setTimeout(function() {
        $("#rameses_sprite").empty();
    },1000)
    thump.play();
    ramesesCollisionReaction();

    if(rameses.direction == "W") {
        $("#rameses").css( "left", blockToPx(rameses.X+1) );
    }
    if(rameses.direction == "N") {
        $("#rameses").css( "top", blockToPx(rameses.Y+1) );
    }
    if(rameses.direction == "S") {
        $("#rameses").css( "top", blockToPx(rameses.Y-1) );
    }
    if(rameses.direction == "E") {
        $("#rameses").css( "left", blockToPx(rameses.X-1) );
    }
}

function getBlockFront() {
    if(rameses.direction == "N") {
        return {
            x: rameses.X,
            y: rameses.Y-1,
        }
    } else if(rameses.direction == "S") {
        return {
            x: rameses.X,
            y: rameses.Y+1,
        }
    } else if(rameses.direction == "E") {
        return {
            x: rameses.X+1,
            y: rameses.Y,
        }
    } else if(rameses.direction == "W") {
        return {
            x: rameses.X-1,
            y: rameses.Y,
        }
    }
}

// Centers Rameses if minimap is clicked
$("#minimap").click(function() {
    center(rameses, function() {followRam = true});
})


// Center Rameses on screen on startup
center(rameses);
var followRam = true;

// Checks for window drop on dropzone

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1 - 1;
    var r1 = x1 + w1 - 1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2 - 1;
    var r2 = x2 + w2 - 1;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function clearTimeouts() {
    for (var i = 0; i < movementDelays.length; i++) {
        clearTimeout(movementDelays[i]);
    }
    movementDelays = [];
}

// Game update loop, updates every 1/1000 of a second
setInterval(update, 1);

function update() {
    
    // Basic variables updates
    screenHeight = $("#game_wrap").outerHeight();
    screenWidth = $("#game_wrap").outerWidth();
    
    rameses.pX = parseInt($("#rameses").css("left"));
    rameses.pY = parseInt($("#rameses").css("top"));
    rameses.X = pxToBlock(rameses.pX);
    rameses.Y = pxToBlock(rameses.pY);
    rameses.onScreen = $("#rameses").visible();
    
    render.offX = parseInt($("#stage1").css("left"));
    render.offY = parseInt($("#stage1").css("top"));
    render.height = screenHeight;
    render.width = screenWidth;
    
    // Attaches graphics to Rameses
    $("#rameses_shadow").css("left", rameses.pX - 10);
    $("#rameses_shadow").css("top", rameses.pY - 10);
    
    $("#rameses_sprite").css("left", rameses.pX);
    $("#rameses_sprite").css("top", rameses.pY);
    
    $("#rameses_pointer").css("left", blockToPx(rameses.X));
    $("#rameses_pointer").css("top", blockToPx(rameses.Y));
    
    $("#rameses_shadow, #rameses_sprite").css("transform", $("#rameses").css("transform"))
    
    // Centers Rameses on screen for follow cam mode
    if(followRam) {
        $("#stage1").animate({
            left: (screenWidth/2 - rameses.pX - 25),
            top: (screenHeight/2 - rameses.pY - 25),
        }, 0);
    }
    
    // Draws Rameses to cursor directions
    if(cursor.control) {
        $("#x_dir").show();
        $("#y_dir").show();
        
        var xWidth = ((cursor.bX - rameses.X)*50);
        $("#x_dir").css("width", Math.abs(xWidth) );
        if( xWidth < 0 ) {
            $("#x_dir").css("left", blockToPx(rameses.X) + 25 + xWidth);
        } else {
            $("#x_dir").css("left", blockToPx(rameses.X) + 25);
        }
        $("#x_dir").css("top", blockToPx(rameses.Y)+23);


        var yHeight = ((cursor.bY - rameses.Y)*50);
        $("#y_dir").css("height", Math.abs(yHeight) );
        if( yHeight < 0 ) {
            $("#y_dir").css("top", blockToPx(rameses.Y) + 25 + yHeight);
        } else {
            $("#y_dir").css("top", blockToPx(rameses.Y) + 25);
        }
        $("#y_dir").css("left", blockToPx(cursor.bX)+23);
    } else {
        $("#x_dir").hide();
        $("#y_dir").hide();
    }
        
    // Moves on-screen border clip to Rameses
    $("#collision_border.overlay").css(
        "-webkit-mask-position",
        "calc(" + rameses.pX + "px - 225px) calc(" + rameses.pY + "px - 225px)"
    )
    
    // Checks for out of bound movements
    if( parseInt( $("#rameses").css("top") ) < 0 ) {
        ramesesCollided();
    } else if( (parseInt($("#rameses").css("top")) + 50) > $("#stage1").outerHeight() ) {
        ramesesCollided();
    }

    if( parseInt( $("#rameses").css("left") ) < 0 ) {
        ramesesCollided();
    } else if( (parseInt($("#rameses").css("left")) + 50) > $("#stage1").outerWidth() ) {
        ramesesCollided();
    }
        
    // Checks for building collision at Rameses' position
    var pixelData = canvas.getContext('2d').getImageData(rameses.X, rameses.Y, 1, 1).data;
    // Checks for walls in the 4 directions around Rameses
    var pixelDataN = canvas.getContext('2d').getImageData(rameses.X, rameses.Y-1, 1, 1).data;
    var pixelDataS = canvas.getContext('2d').getImageData(rameses.X, rameses.Y+1, 1, 1).data;
    var pixelDataE = canvas.getContext('2d').getImageData(rameses.X+1, rameses.Y, 1, 1).data;
    var pixelDataW = canvas.getContext('2d').getImageData(rameses.X-1, rameses.Y, 1, 1).data;
    
    var pixelDataFront = canvas.getContext('2d').getImageData(getBlockFront().x, getBlockFront().y, 1, 1).data;
    
    if( pixelData[3] != 0 ) {
        rameses.isColliding = true;
    } else {
        rameses.isColliding = false;
    }
    
    if( pixelDataN[3] != 0 || pixelDataS[3] != 0 || pixelDataE[3] != 0 || pixelDataW[3] != 0 ) {
        rameses.isAgainstWall = true;
    } else {
        rameses.isAgainstWall = false;
    }
    
    if( pixelDataFront[3] != 0 ) {
        rameses.isFacingWall = true;
    } else {
        rameses.isFacingWall = false;
    }
    
    if( rameses.isColliding && rameses.collision) {
        ramesesCollided();
        //console.warn("Rameses collided with a building");
    }
    
    // Updates moving state
    if( $("#rameses_sprite").hasClass("running") ) {
        rameses.isMoving = true;
    } else {
        rameses.isMoving = false;
    }
    
    if( rameses.distanceLeft > 0 ) {
        if( $("#rameses_sprite").attr("class").indexOf("running") < 0 ) {
            $("#rameses_sprite").addClass("running");
        }
    } else if( rameses.distanceLeft <= 0 ) {
        $("#rameses_sprite").removeClass("running");
    }
    
    if(rameses.direction == "E") {
        $("#rameses").css("transform", "rotate(-90deg) scale(1.5)");
    } else if(rameses.direction == "W") {
        $("#rameses").css("transform", "rotate(90deg) scale(1.5)");
    } else if(rameses.direction == "S") {
        $("#rameses").css("transform", "rotate(0deg) scale(1.5)");
    } else if(rameses.direction == "N") {
        $("#rameses").css("transform", "rotate(180deg) scale(1.5)");
    }
    
    // Plays galloping sound effect
    if(rameses.isMoving) {
        gallop.volume(0.5);
    } else {
        gallop.volume(0);
    }
    
    
    $("#speech_wrap2").css("left", render.width/2-25 + "px")
    
    $("#speech_wrap2").css("top", "calc(100% - " + ($("#speech_wrap2").outerHeight()+20) + "px)");
    
    
    /*
    // Collapses windows
    $(".collapsible").each(function() {
        if( $(this).attr("class").indexOf("collapsed") >= 0 ) {
            $(this).css("height", "30px");
        } else {
            $(this).css("height", "initial");
        }
    })
    */
    
    $(".resizer").each(function() {
        var width = parseInt($(this).css("left"))+15;
        var height = parseInt($(this).css("top"))+15;
        $(this).closest(".resizable").css("width", width);
        $(this).closest(".resizable").css("height", height);
    })
    
    if( parseInt($("#lessons_resize").css("left")) <= (400-15) ) {
        $("#lessons_resize").css("left", (400-15));
    } 
    
    if( parseInt($("#lessons_resize").css("top")) <= (400-15) ) {
        $("#lessons_resize").css("top", (400-15));
    } 
    
    if( parseInt($("#editor_resize").css("left")) <= (400-15) ) {
        $("#editor_resize").css("left", (400-15));
    } 
    
    if( parseInt($("#editor_resize").css("top")) <= (400-15) ) {
        $("#editor_resize").css("top", (400-15));
    } 
    
    $("#editor_resize").mousedown(function() {
        editor1.resize();
        editor2.resize();
        editor3.resize();
    })
    
    $("#editor_resize").mouseup(function() {
        editor1.resize();
        editor2.resize();
        editor3.resize();
    })
    
    var speechHeight = $("#speech_wrap").outerHeight();
    $("#speech_wrap").css("left", rameses.pX);
    $("#speech_wrap").css("top", rameses.pY - speechHeight - 20);
    
    // Check for dock drop
    if( collision( $("#editorWrap"), $("#sideDropZone") ) || collision( $("#lessons"), $("#sideDropZone") ) ) {
        $("#sideDropZone").css("opacity", 1);
    } else {
        $("#sideDropZone").css("opacity", 0);
    }
    
    // Updates minimap
    $("#coords").text("Rameses is at X: " + rameses.X + " | Y: " + rameses.Y);
    
    $("#minimap_pointer").css("top", ((rameses.pY/50+1) * 2.083 - 1)+30);
    $("#minimap_pointer").css("left", ((rameses.pX/50+1) * 2.083 - 1));
    
    $("#view_area").css("left", pxToBlock(render.offX) * 2.083 *-1 );
    $("#view_area").css("top", (pxToBlock(render.offY) * 2.083 *-1)+30 );
    $("#view_area").css("width", pxToBlock(render.width) * 2.083 );
    $("#view_area").css("height", pxToBlock(render.height) * 2.083 );
    
    var vaX = parseInt($("#view_area").css("left")) + $("#view_area").outerWidth()/2;
    var vaY = parseInt($("#view_area").css("top")) + $("#view_area").outerHeight()/2;
    
    var mpX = parseInt($("#minimap_pointer").css("left")) + 1;
    var mpY = parseInt($("#minimap_pointer").css("top")) + 1;
    
    var distanceLine = Math.sqrt(  Math.pow((mpX-vaX),2)+Math.pow((mpY-vaY),2)  );
    var midX = (mpX + vaX)/2;
    var midY = (mpY + vaY)/2;
    var angleDeg = Math.atan2(mpY - vaY, mpX - vaX) * 180 / Math.PI;
    
    $("#line").css("width", distanceLine + "px");
    $("#line").css("top", midY + "px");
    $("#line").css("left", (midX - distanceLine/2) + "px");
    $("#line").css("transform", "rotate(" + angleDeg + "deg)");
    
    if( followRam ) {
        $("#line").hide();
    } else {
        $("#line").show();
    }
    
    // Displays debug data debug panel
    $("#collision_state").text("isColliding: " + rameses.isColliding);
    $("#wall").text("isAgainstWall: " + rameses.isAgainstWall);
    $("#faceWall").text("isFacingWall: " + rameses.isFacingWall);
    $("#moving").text("isMoving: " + rameses.isMoving);
    $("#direction").text("direction: " + rameses.direction);
    $("#distance").text("distanceLeft: " + rameses.distanceLeft);
    $("#pxX").text("pixel X: " + rameses.pX);
    $("#pxY").text("pixel Y: " + rameses.pY);
    $("#blockX").text("block X: " + rameses.X);
    $("#blockY").text("block Y: " + rameses.Y);
    $("#onScreen").text("onScreen: " + rameses.onScreen);
    //---Rameses above, cursor below----//
    $("#cControl").text("control: " + cursor.control);
    $("#cpX").text("pixel X: " + cursor.pX);
    $("#cpY").text("pixel Y: " + cursor.pY);
    $("#cbX").text("block X: " + cursor.bX);
    $("#cbY").text("block Y: " + cursor.bY);    
    //---Viewport---//
    $("#osX").text("offset X: " + render.offX);
    $("#osY").text("offset Y: " + render.offY);
    $("#h").text("height: " + render.height);
    $("#w").text("width: " + render.width); 
}
