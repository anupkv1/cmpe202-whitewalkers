/**
 * Player Entity
 */


game.PlayerEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function(x, y, settings) {
        //console.log("***entities.js class: PlayerEntity fn:init*** ");
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal and vertical velocity (accel vector)
        this.body.setVelocity(3, 15);

        //set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //ensure that player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        //define the basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7]);

        // define the standing animation using first frame
        this.renderable.addAnimation("stand", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        var scoreHandler = function(score, lives, shots) {
            scoreboard.increaseScore(score, lives, shots);
        };
        this.scoreSubject = new ScoreSubject();
        this.scoreSubject.subscribe(scoreHandler);
    },

    /**
     * update the entity
     */
    update: function(dt) {
        // console.log("***entities.js class: PlayerEntity fn:update***");

        if (me.input.isKeyPressed('left')) {
            //console.log("***entities.js fn:update*** if:left");

            // flip the sprite on horizontal axis
            this.renderable.flipX(true);

            //update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;

            //change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (me.input.isKeyPressed('right')) {
            // console.log("***entities.js fn:update if:right ***");

            // unflip the sprite
            this.renderable.flipX(false);

            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;

            //change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            // console.log("***entities.js fn:update*** else***");
            this.body.vel.x = 0;

            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }

        if (me.input.isKeyPressed('jump')) {
            // console.log("***entities.js fn:update if: jump***");

            // make sure we are not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

                // set the jumping flag
                this.body.jumping = true;

                me.audio.play("jump");
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function(response, other) {
        //console.log("***entities.js  class: PlayerEntity fn:onCollision***");
        switch (response.b.body.collisionType){
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform"){
                    if(this.body.falling && !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (reponse.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ){
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if ((response.overlapV.y>0) && !this.body.jumping) {
                    // bounce (force jump)
                    this.body.falling = false;
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

                    // set the jumping flag
                    this.body.jumping = true;
                    console.log("Score counter: Player collision with enemy");
                    this.scoreSubject.updateScore(0,-1,0);

                    me.audio.play("stomp");
                }
                else {
                    // let's flicker in case we touched an enemy
                    this.renderable.flicker(750);
                }
                return true;
                break;
            case me.collision.types.COLLECTABLE_OBJECT:
                console.log("Score counter: Player collision with coin");
                this.scoreSubject.updateScore(1, 0, 0); //score, lives, shots
                return true;
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }
});

/** A coin entitty **/

game.CoinEntity = me.CollectableEntity.extend({

    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function (x, y, settings) {
        // console.log("****Entity.js*** class:CoinEntity**** fn:init");
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y , settings]);

    },

    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision : function (response, other) {
        // do something when collected

        // game.data.score +=250;
        // make sure it cannot be collected "again"
        me.audio.play("cling");

        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        // remove it
        me.game.world.removeChild(this);

        return false
    }

});

/*An Enemy Entity*/

game.EnemyEntity = me.Entity.extend({
    init: function (x, y, settings) {
        settings.image = "wheelie_right"; /*Definfing image instead of Tiled*/

        //save the area size defined in tiled
        var width = settings.width;
        var height = settings.height;


        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // redefine the default shape (used to define path) with a shape matching the renderable
        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

        // call the parent constructor
        this._super(me.Entity, 'init',[x, y, settings]);

        // set start/end position based on the initial area size

        x = this.pos.x;
        this.startX = x;
        this.endX = x+width - settings.framewidth;
        this.pos.x = x+width - settings.framewidth;

        // to remember which side we were walking
        this.walkLeft = false;

        // walking & jumping speed
        this.body.setVelocity(4,6);



    },

    /**
     * update the enemy pos
     */

    update : function (dt) {
        if(this.alive){
            if(this.walkLeft && this.pos.x <= this.startX){
                this.walkLeft = false;
            }
            else if(!this.walkLeft && this.pos.x >= this.endX){
                this.walkLeft = true;
            }

            //    make it walk
            this.renderable.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        }
        else{
            this.body.vel.x = 0;
        }

        // update the body movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!= 0 || this.body.vel.y != 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function (response, other) {
        // if (response.b.body.collisionType = me.collision.types.PLAYER_OBJECT){
        //     this.pos.sub(response.overlapV);
        // }
        if(response.b.body.collisionType != me.collision.types.WORLD_SHAPE){
            // res.y >0 means touched by something on the bottom
            // which mean at top position for this one
            if(this.alive && (response.overlapV.y > 0 )&& response.a.body.falling){
                this.renderable.flicker(750);
            }
            return false;
        }
        // Make all other objects solid
        return true;
    }
});

function ScoreSubject() {
    this.handlers = [];  // observers
}

ScoreSubject.prototype = {

    subscribe: function(fn) {
        console.log("Player subscribed to score board");
        this.handlers.push(fn);
    },

    unsubscribe: function(fn) {
        this.handlers = this.handlers.filter(
            function(item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    },

    updateScore: function(score, lives, shots, thisObj) {
        var scope = thisObj;
        this.handlers.forEach(function(item) {
            item.call(scope, score, lives, shots);
        });
    }
}

var scoreboard = (function() {
    //var score = 0;
    return {
        increaseScore: function(score, lives, shots) {
            // console.log("Score board: Increase Score function called");
            // console.log(score);
            // console.log(lives);
            // console.log(shots);
            game.data.score += score;
            game.data.noOfLives += lives;
            game.data.noOfShots += shots;
        },
        show: function() { console.log(score); }
    }
})();




