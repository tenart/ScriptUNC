var movementDelays = [];

var rameses = {
    name: "Rameses",
    thought: "What a GDTBATH...",
    direction: "E",
    isColliding: false,
    collision: true,
    isMoving: false,
    onScreen: true,
    speed: 250,
    pX: 2600,
    pY: 1650,
    bX: 52,
    bY: 33,
    distanceLeft: 0,
    move: function(x,y) {
        
        if(isNaN(x) || isNaN(x)) {
            throw new TypeError("move() only accepts legal numbers");
        }

        var moveX = x;
        var moveY = y;
        
        var thisDistance = Math.abs(x) + Math.abs(y);
        
        var speed = this.speed;
                
        //$("#rameses").stop(true,false);
        $("#rameses").css("left", blockToPx(rameses.bX));
        $("#rameses").css("top", blockToPx(rameses.bY));

        if( moveX > 0 ) {
            rameses.direction = "E";
        } else if( moveX < 0 ) {
            rameses.direction = "W";
        }


        $("#rameses").animate({
            left: "+=" + (moveX * 50),
        }, speed * Math.abs(moveX), function() {
            
            if( moveY > 0 ) {
                rameses.direction = "S";
            } else if( moveY < 0 ) {
                rameses.direction = "N";
            }

            $("#rameses").animate({
                top: "+=" + (moveY * 50),
            }, speed * Math.abs(moveY), function() {
                rameses.distanceLeft -= thisDistance;
            })
        })
        return null;
    },
    moveRight: function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.move(amount,0);
        },delay + 200));
        
    },
    moveLeft: function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.move(-1*amount,0);
        },delay + 200));
    },
    moveUp: function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.move(0,-1*amount);
        },delay + 200));
    },
    moveDown: function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            $("#rameses_sprite").addClass("running");
            rameses.move(0, amount);
        },delay + 200));
    },
    alert: function(speak) {
        $("#bubble").text(speak);
        $("#speech_wrap").fadeIn();
        setTimeout(function() {
            $("#speech_wrap").fadeOut();
        }, 3000);
    }
}

// Cursor
var cursor = {
    control: false,
    pX: 0,
    pY: 0,
    bX: 0,
    bY: 0
}

// Viewing rectangle
var render = {
    offX: 0,
    offY: 0,
    height: 0,
    width: 0
}