/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal and vertical velocity (accel vector)
        this.body.setVelocity(3, 15);

        //set the display to follow out position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //ensure that player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        //define the basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7]);

        // define the standing animation using first frame
        this.renderable.addAniamtion("stand", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },

    /**
     * update the entity
     */
    update: function(dt) {

        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);

            //update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;

            //change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.renderable.flipX(false);

            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;

            //change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.body.vel.x = 0;

            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
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
        // Make all other objects solid
        return true;
    }
});


// Checking if an entity has collided with a bullet
bulletCollisionDetection: function() {
        console.log("***BULLET HIT***");
        me.game.world.collide(this, true).forEach(function(col) {
            if (col && col.obj.bullet && !this.overworld) { // Bullets are only available in underworld
                col.obj.die(); // Kill the collided object
                me.state.current().enemies.remove(this); // Remove this entity from the enemies list
                me.game.viewport.shake(2, 250); 
                
                this.collidable = false; // set the entity to be uncollidable
                me.game.world.removeChild(this); // remove from the game world

                var p = new Soul(this.pos.x, this.pos.y - 150, {}); // create a soul object
                me.game.world.addChild(p); // add to the world

                // #ProHacks
                var b = new window[this.type](this.pos.x, this.pos.y, {
                    skel: 1,
                    x: this.pos.x,
                    y: this.pos.y,
                    overworld: 1, // set the world to overworld for current entity
                    width: 80, 
                    height: 80
                });
                b.z = 300; update Z coordinate
                me.game.world.addChild(b);
                me.game.world.sort();

                me.state.current().updateLayerVisibility(me.state.current().overworld); // change the current layer state
            }
        }, this);
    }

var Bullet = me.ObjectEntity.extend({ // Base bullet object for all shooting purposes
    init: function(x, y, settings) {
        settings = settings || {};
        settings.image = settings.image || "zap";
        // setting image width an height
        settings.spritewidth = 111; 
        settings.spriteheight = 42;
        settings.width = 111;
        settings.height = 42;
        direction = settings.direction;
        this.parent(x, y, settings);
        this.bullet = true;
        this.alwaysUpdate = true;
        this.collidable = true;
        this.z = 300;
        this.gravity = 0;
        this.vel.x = direction * 15.0;
        this.flipX(direction < 0);
        // Set speed of animating bullet
        this.renderable.animationspeed = 10;
        // bullet should disappear after travel this distance
        this.lifetime = 1200;
    }
    // **** Bullet.onCollision, onUpdate, onDie ****
