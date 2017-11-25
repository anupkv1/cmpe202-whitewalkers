game.FlyingEnemy = me.Entity.extend({
    init: function (x, y, settings) {
        // define this here instead of tiled
        //settings.image = "furball";
        //settings.spritewidth = 110;
        //settings.spriteheight

        // call the parent constructor
        settings.image = "bat";

        this._super(me.Entity, 'init',[x, y, settings]);

        // this.renderable.anim = {};

        var walkarray = new Array();
        for (var i = 0; i < settings.walkframes; i++){
            walkarray[i] = i;
            console.log("walk array: " +walkarray[i]);
        }

        var diearray = new Array();
        for (var i = 0; i < settings.dieframes; i++){
            diearray[i] = settings.walkframes + i;
            console.log("die array: " +walkarray[i]);

        }

        // 0-4
        // 5-12

        this.renderable.addAnimation("flying", [0, 1, 2, 3]);
        this.renderable.addAnimation("die", diearray);
        if (!this.renderable.isCurrentAnimation("flying")) {
            this.renderable.setCurrentAnimation("flying");
        }

        // this.body.updateColRect((settings.spriteheight-80)/2, 80, ((settings.spriteheight-60)/2)-10, 60);

        // walking & jumping speed
        this.body.setVelocity(-5, 0);
        // this.body.setMaxVelocity(5, 15);

        // make it collidable
        this.collidable = true;
        this.spawning = false;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

        this.health = settings.hp;
        this.dying = false;

        this.canKnockback = false;
        this.knockbackTime = 0;

        this.gravity = 0;

        this.alwaysUpdate = true;

        this.renderable.flipX(true);




    },

    // manage the enemy movement
    update: function (dt) {
        // do nothing if not in viewport
        // if (this.inViewport) this.alwaysUpdate = true;
        //return false;

        if (this.alive && !this.dying && !this.spawning) {

            //this.flipX(true);
            this.body.vel.x += this.body.accel.x * dt/1000;

        } else {
            this.body.vel.x = 0;
        }

        if (this.knockbackTime > 0) {
            if (this.body.vel.x > 0) this.body.vel.x -= 0.1;
            if (this.body.vel.x < 0) this.body.vel.x += 0.1;
            //this.vel.x += this.accel.x * me.timer.tick;

            this.knockbackTime -= me.timer.tick;

            if (!this.dying) {
                this.renderable.animationpause = true;
                this.renderable.setAnimationFrame(0);
            }
        }
        else {
            this.body.maxVel.x = 5;
            if (!this.dying) {
                this.renderable.animationpause = false;
            }
        }


        // if (!this.spawning) {
        //     // check and update movement
        //     var res = this.updateMovement();
        //     if (res.x != 0) {
        //         this.die();
        //         //    if (this.walkLeft) {
        //         //        this.walkLeft = false;
        //         //    } else if (!this.walkLeft) {
        //         //        this.walkLeft = true;
        //         //    }
        //     }
        // }

        // if (this.dying && this.renderable.anim["die"].idx == this.renderable.anim["die"].length-1) {
        //     this.renderable.animationpause = true;
        //     this.renderable.alpha -= 0.01;
        //     if (this.renderable.alpha <= 0.01) me.game.remove(this);
        // }

        // update animation if necessary
        if (this.body.vel.x != 0 || this.body.vel.y != 0 || this.dying || this.knockbackTime>0 || this.spawning) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            this.body.update();
            return true;

        }



        return false;
    }
});