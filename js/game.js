// Defining Rameses object
var rameses = {
    name: "Rameses",
    thought: "What a GDTBATH...",
    direction: "E",
    isColliding: false,
    isMoving: false,
    onScreen: true,
    speed: 250,
    pX: 2600,
    pY: 1650,
    bX: 52,
    bY: 33,
    move: function(x,y) {
        if(isNaN(x) || isNaN(x)) {
            throw new TypeError("move() only accepts legal numbers");
        }

        var moveX = x;
        var moveY = y;
        
        var speed = this.speed;
        
        $("#rameses").stop(true,false);
        $("#rameses").css("left", blockToPx(rameses.bX));
        $("#rameses").css("top", blockToPx(rameses.bY));

        if( moveX > 0 ) {
            $("#rameses").css("transform", "rotate(-90deg) scale(1.5)");
            rameses.direction = "E";
        } else if( moveX < 0 ) {
            $("#rameses").css("transform", "rotate(90deg) scale(1.5)");
            rameses.direction = "W";
        }

        $("#rameses_sprite").addClass("running");

        $("#rameses").animate({
            left: "+=" + (moveX * 50),
        }, speed * Math.abs(moveX), function() {

            if( moveY > 0 ) {
                $("#rameses").css("transform", "rotate(0deg) scale(1.5)");
                rameses.direction = "S";
            } else if( moveY < 0 ) {
                $("#rameses").css("transform", "rotate(180deg) scale(1.5)");
                rameses.direction = "N";
            }

            $("#rameses").animate({
                top: "+=" + (moveY * 50),
            }, speed * Math.abs(moveY), function() {
                $("#rameses_sprite").removeClass("running");
            })
        })
        return null;
    },
    moveRight: function(amount) {
        this.move(amount);
    },
    moveLeft: function(amount) {
        this.move(-1*amount);
    },
    moveUp: function(amount) {
        this.move(0,-1*amount);
    },
    moveDown: function(amount) {
        this.move(0,amount);
    },
}

var cursor = {
    control: true,
    pX: 0,
    pY: 0,
    bX: 0,
    bY: 0
}

// Declaring sound assets
var bgMusic = new Howl({
    src: ['../sound/fightsong.wav'],
    autoplay: false,
    loop: true,
    volume: 0.5,
});

var gallop = new Howl({
    src: ['../sound/gallop.mp3'],
    autoplay: true,
    loop: true,
    volume: 0,
});

var thump = new Howl({
    src: ['../sound/thump.mp3'],
    autoplay: false,
    loop: false,
    volume: 4,
});

// Test
function speak(input) {
    alert(input);
}

/*
// Help players locate DOM elements by ID
function locate(target) {
    if(typeof(target) != "string") {
        throw new TypeError("locate() only accepts string values");
    }
    var id = "#" + String(target);
    $(id).addClass("highlight").delay(1000).queue(function(){
        $(this).removeClass("highlight").dequeue();
    });
}
*/

// Shows which button is clicked in js console
$("#buttons button").click(function() {
    console.log( "Button '" + $(this).attr("id") + "' clicked" );
})

// Makes stage and debug pane draggable and disables follow cam when being dragged
$("#stage1").draggable({
    delay: 10,
    start: function() {
        followRam = false;  
    },
    scroll: false,
});

$("#debug").draggable({
    scroll: false,
    containment: "#game_wrap"
});

// Creates out of view HTML canvas with collision map to detect collision with buildings
var img = document.getElementById('collision');
var canvas = document.createElement('canvas');
canvas.width = img.width;
canvas.height = img.height;
canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

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

$("#game_wrap").on( "mousemove", function( event ) {
    cursor.pX = event.pageX - parseInt( $("#stage1").offset().left );
    cursor.pY = event.pageY - parseInt( $("#stage1").offset().top );
    cursor.bX = pxToBlockFloor(cursor.pX);
    cursor.bY = pxToBlockFloor(cursor.pY);
});

$("#game_wrap").click(function() {
    if( cursor.control ) {
        rameses.move(cursor.bX - rameses.bX, cursor.bY - rameses.bY);
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

$("#minimap").click(function() {
    center(rameses, function() {followRam = true});
})

// Center Rameses on screen on startup
center(rameses);
var followRam = true;

// Game update loop
setInterval(update, 33.33);

function update() {
    
    // Basic variables
    screenHeight = $("#game_wrap").outerHeight();
    screenWidth = $("#game_wrap").outerWidth();
    rameses.pX = parseInt($("#rameses").css("left"));
    rameses.pY = parseInt($("#rameses").css("top"));
    rameses.bX = pxToBlock(rameses.pX);
    rameses.bY = pxToBlock(rameses.pY);
    rameses.onScreen = $("#rameses").visible();
    
    // Attaches graphics to Rameses
    $("#rameses_shadow").css("left", rameses.pX - 10);
    $("#rameses_shadow").css("top", rameses.pY - 10);
    
    $("#rameses_sprite").css("left", rameses.pX);
    $("#rameses_sprite").css("top", rameses.pY);
    
    $("#rameses_pointer").css("left", blockToPx(rameses.bX));
    $("#rameses_pointer").css("top", blockToPx(rameses.bY));
    
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
        
        var xWidth = ((cursor.bX - rameses.bX)*50);
        $("#x_dir").css("width", Math.abs(xWidth) );
        if( xWidth < 0 ) {
            $("#x_dir").css("left", blockToPx(rameses.bX) + 25 + xWidth);
        } else {
            $("#x_dir").css("left", blockToPx(rameses.bX) + 25);
        }
        $("#x_dir").css("top", blockToPx(rameses.bY)+23);


        var yHeight = ((cursor.bY - rameses.bY)*50);
        $("#y_dir").css("height", Math.abs(yHeight) );
        if( yHeight < 0 ) {
            $("#y_dir").css("top", blockToPx(rameses.bY) + 25 + yHeight);
        } else {
            $("#y_dir").css("top", blockToPx(rameses.bY) + 25);
        }
        $("#y_dir").css("left", blockToPx(cursor.bX)+23);
    } else {
        $("#x_dir").hide();
        $("#y_dir").hide();
    }
        
    // Checks for out of bound movements
    if( parseInt( $("#rameses").css("top") ) < 0 ) {
        $("#rameses").stop(true,false).css("top", 0);
        $("#rameses_sprite").removeClass("running");
        //console.warn("Rameses reached upper y bounds");
        thump.play();
    } else if( (parseInt($("#rameses").css("top")) + 50) > $("#stage1").outerHeight() ) {
        $("#rameses").stop(true,false).css("top", $("#stage1").outerHeight() - 50);
        $("#rameses_sprite").removeClass("running");
        //console.warn("Rameses reached lower y bounds");
        thump.play();
    }

    if( parseInt( $("#rameses").css("left") ) < 0 ) {
        $("#rameses").stop(true,false).css("left", 0);
        $("#rameses_sprite").removeClass("running");
        //console.warn("Rameses reached left x bounds");
        thump.play();
    } else if( (parseInt($("#rameses").css("left")) + 50) > $("#stage1").outerWidth() ) {
        $("#rameses").stop(true,false).css("left", $("#stage1").outerWidth() - 50);
        $("#rameses_sprite").removeClass("running");
        //console.warn("Rameses reached right x bounds");
        thump.play();
    }
        
    // Checks for building collision
//     var pixelData = canvas.getContext('2d').getImageData(rameses.bX, rameses.bY, 1, 1).data;
    
//     if( pixelData[3] != 0 ) {
//         rameses.isColliding = true;
//     } else {
//         rameses.isColliding = false;
//     }
    
    if( rameses.isColliding ) {
        $("#rameses").stop(true,false);
        $("#rameses_sprite").removeClass("running");
        thump.play();
        
        if(rameses.direction == "W") {
            $("#rameses").css( "left", blockToPx(rameses.bX+1) );
        }
        if(rameses.direction == "N") {
            $("#rameses").css( "top", blockToPx(rameses.bY+1) );
        }
        if(rameses.direction == "S") {
            $("#rameses").css( "top", blockToPx(rameses.bY-1) );
        }
        if(rameses.direction == "E") {
            $("#rameses").css( "left", blockToPx(rameses.bX-1) );
        }
        
        //console.warn("Rameses collided with a building");
    }
    
    // Updates moving state
    if( $("#rameses_sprite").hasClass("running") ) {
        rameses.isMoving = true;
    } else {
        rameses.isMoving = false;
    }
    
    // Plays galloping sound effect
    if(rameses.isMoving) {
        gallop.volume(0.5);
    } else {
        gallop.volume(0);
    }
    
    $(".building td").each(function() {
        if( $(this).visible(true) ) {
            $(this).css("opacity", 1);
        }
    })
    
    $(".building td").each(function() {
        if(! $(this).visible(true) ) {
            $(this).css("opacity", 0);
        }
    })
    
    // Updates minimap
    $("#coords").text("X: " + rameses.bX + " | Y: " + rameses.bY);
    
    $("#minimap_pointer").css("top", ((rameses.pY/50+1) * 2.083 - 2));
    $("#minimap_pointer").css("left", ((rameses.pX/50+1) * 2.083 - 2));
    
    // Displays debug data debug panel
    $("#collision_state").text("isColliding: " + rameses.isColliding);
    $("#moving").text("isMoving: " + rameses.isMoving);
    $("#direction").text("direction: " + rameses.direction);
    $("#pxX").text("pixel X: " + rameses.pX);
    $("#pxY").text("pixel Y: " + rameses.pY);
    $("#blockX").text("block X: " + rameses.bX);
    $("#blockY").text("block Y: " + rameses.bY);
    $("#onScreen").text("onScreen: " + rameses.onScreen);
    //---Rameses above, cursor below----//
    $("#cControl").text("control: " + cursor.control);
    $("#cpX").text("pixel X: " + cursor.pX);
    $("#cpY").text("pixel Y: " + cursor.pY);
    $("#cbX").text("block X: " + cursor.bX);
    $("#cbY").text("block Y: " + cursor.bY);


    // console.log = function(msg){
    // $("#console").append("<div>" + msg + "</div>");
    // }

    // window.onerror = function(message, url, linenumber) {
    //     console.log("JavaScript error: " + message + " on line " + 
    //             linenumber + " for " + url);
    // }
    
   
    

//     $("#console").on("keydown", function(e){
//         if(e.which == 13){
//             document.getElementById("#consoleText").innerHTML = $.get(getNextScript());
//         }
//     });
    
}

$("#console").on("keydown", function(e){
    if(e.which == 13){
        $.get(getNextScript(), function(results){
         $("#consoleText").html(results)
        });
    }
});

var scripts = [], scriptIndex = 0, numberOfFiles = 4;

function getNextScript() {
    var nextScript;   
    if(scriptIndex < numberOfFiles){
        //nextScript = scripts[scriptIndex];
        // JSON.stringify(nextScript);
        nextScript = 'js/text_files/'+scriptIndex+".txt";
        scriptIndex++;
        return nextScript;
    }
    
    else{
        alert("Congrats! you have completed scriptUNC!");
    }
}

    
    
