var movementDelays = [];

var ramesesCollisionReaction = function(){};

var rameses = {};
    rameses.name = "Rameses";
    rameses.thought= "What a GDTBATH...";
    rameses.direction= "E";
    rameses.isColliding= false;
    rameses.isAgainstWall= false;
    rameses.isFacingWall= false;
    rameses.collision= true;
    rameses.isMoving= false;
    rameses.onScreen= true;
    rameses.speed= 250;
    rameses.pX= 2600;
    rameses.pY= 1650;
    rameses.bX= 52;
    rameses.bY= 33;
    rameses.distanceLeft= 0;

    rameses.pendingCallback= function(){};

    rameses.setCollisionReaction= function(colCallback) {
    	ramesesCollisionReaction = colCallback;
    };

    

    rameses.move = function(x,y) {
        
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
    };


	rameses.moveWithCB = function(x,y, callback) {
        
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

        rameses.pendingCallback = callback;

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
                rameses.pendingCallback = function(){};
                callback();
            })
        })
        return null;
    };

    rameses.moveRight = function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.move(amount,0);
        },delay + 200));
        
    };

    rameses.moveLeft = function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.move(-1*amount,0);
        },delay + 200));
    };

    rameses.moveUp = function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.move(0,-1*amount);
        },delay + 200));
    };

    rameses.moveDown = function(amount) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            $("#rameses_sprite").addClass("running");
            rameses.move(0, amount);
        },delay + 200));
    };

    rameses.alert = function(speak){
       var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += 16;
        movementDelays.push(setTimeout(function() {
            //var currentDelay = rameses.distanceLeft;
            //rameses.distanceLeft = 0;
            $("#bubble").text(speak);
            $("#speech_wrap").fadeIn(500);
            setTimeout(function() {
                $("#speech_wrap").fadeOut(500);
                rameses.distanceLeft -= 16;
            }, 3000);
        },delay));
    };

    rameses.moveRightWithCallback = function(amount, callback) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.moveWithCB(amount,0,callback);
        },delay + 200));
        
    };

    rameses.moveLeftWithCallback = function(amount, callback) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.moveWithCB(-1*amount,0,callback);
        },delay + 200));
    };

    rameses.moveUpWithCallback = function(amount, callback) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            rameses.moveWithCB(0,-1*amount,callback);
        },delay + 200));
    };
	
    rameses.moveDownWithCallback = function(amount, callback) {
        var delay = rameses.distanceLeft * 250;
        rameses.distanceLeft += Math.abs(amount);
        movementDelays.push(setTimeout(function() {
            $("#rameses_sprite").addClass("running");
            rameses.moveWithCB(0, amount, callback);
        },delay + 200));
    };

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
