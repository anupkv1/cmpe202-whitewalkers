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
    
    /** The game play state... */
var PlayScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true);
        me.input.bindKey(me.input.KEY.SPACE, "shoot");
        this.baddies = [];
        this.pickups = [];
        this.overworld = true;
        this.subscription = me.event.subscribe(me.event.KEYDOWN, this.keyDown.bind(this));

        this.HUD = new LD30.HUD.Container();
        me.game.world.addChild(this.HUD);
        LD30.data.beatGame = false;

    },

    toUnderworld: function() {
        if (this.overworld) {
            me.audio.mute("ld30-real");
            me.audio.unmute("ld30-spirit");

            me.audio.play("portal");
            me.audio.play("lostsouls");

            this.overworld = false;
            this.updateLayerVisibility(this.overworld);
            this.HUD.toUnderworld();
            me.game.viewport.shake(5, 1000);
        }
    },

    endGame: function() {
        LD30.data.beatGame = true;
        me.state.change(me.state.GAMEOVER);
    },

    goToLevel: function(level) {
        if (!this.overworld) {
            this.baddies = [];
            this.pickups = [];
            this.overworld = true;
            me.levelDirector.loadLevel(level);
            me.state.current().changeLevel(level);
            this.HUD.startGame();
        }
    },

    updateLayerVisibility: function(overworld) {
        var level = me.game.currentLevel;
        level.getLayers().forEach(function(layer) {
            if (layer.name.match(/overworld/)) {
                layer.alpha = overworld ? 1 : 0;
            } else if (layer.name.match(/underworld/)) {
                layer.alpha = overworld ? 0 : 1;
            }
        }, this);

        this.baddies.forEach(function(baddie) {
            var m = baddie.overworld && overworld || (!baddie.overworld && !overworld);
            if (m) {
                baddie.renderable.alpha = .5;
                // baddie.collidable = false;
            } else {
                baddie.renderable.alpha = 1;
                //baddie.collidable = true;
            }
        });

        this.pickups.forEach(function(pickup) {
            var m = pickup.overworld && overworld || (!pickup.overworld && !overworld);
            if (m) {
                pickup.renderable.alpha = .5;
                //pickup.collidable = false;
            } else {
                pickup.renderable.alpha = 1;
                //pickup.collidable = true;
            }
        });

        me.game.repaint();
    },

    keyDown: function(action) {
        if (action == "shoot") {
            this.player.shoot();
        }
    },

    getLevel: function() {
        return this.parseLevel(me.levelDirector.getCurrentLevelId());
    },

    parseLevel: function(input) {
        var re = /level(\d+)/;
        var results = re.exec(input);
        return results[1];
    },

    /** Update the level display & music. Called on all level changes. */
    changeLevel: function(level) {
        me.audio.mute("ld30-spirit");
        me.audio.unmute("ld30-real");

        // TODO: Makethis track the real variable...
        this.updateLayerVisibility(this.overworld);
        // this only gets called on start?
        me.game.world.sort();

        me.game.viewport.fadeOut('#000000', 1000, function() {});
    },

    // this will be called on state change -> this
    onResetEvent: function() {
        this.baddies = [];
        this.pickups = [];
        this.overworld = true;
        LD30.data.beatGame = false;
        LD30.data.collectedSouls = 0;
        LD30.data.souls = 1;
        var level = location.hash.substr(1) || "level1";
        me.levelDirector.loadLevel(level);

        me.audio.stopTrack();
        me.audio.play("ld30-real", true);
        me.audio.play("ld30-spirit", true);
        me.audio.play("portalrev");

        this.changeLevel(level);
        this.HUD.startGame();
    },

    onDestroyEvent: function() {
        this.HUD.endGame();
        me.audio.stop("ld30-real");
        me.audio.stop("ld30-spirit");
    },

    update: function() {
        me.game.frameCounter++;
    }
});

var TitleScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.radmars = new RadmarsRenderable();
        me.game.world.addChild(this.radmars);

        this.subscription = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
            if (keyCode === me.input.KEY.ENTER) {
                me.state.change(me.state.MENU);
            }
        });

        me.audio.playTrack("radmarslogo");
    },

    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.audio.stopTrack();
        me.game.world.removeChild(this.radmars);
        me.event.unsubscribe(this.subscription);
    }
});

