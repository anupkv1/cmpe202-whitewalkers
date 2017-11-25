var Laser = me.Entity.extend({
    init: function(x, y, settings) {
        settings = settings || {};
        settings.image = settings.image || "laser";
        settings.spritewidth = 111;
        settings.spriteheight = 42;
        settings.width = 111;
        settings.height = 42;
        direction = settings.direction;
        this._super(me.Entity,"init",[x, y, settings]);
        this.laser = true;
        this.alwaysUpdate = true;
        this.collidable = true;
        this.z = 300;
        this.gravity = 0;
        // this.body.setVelocity(direction * 15.0, 0);
        this.body.vel.x = direction * 15.0;
        this.body.vel.y = 0;
        console.log("Direction is :"+ direction);
        console.log("Laser velocity is :"+this.body.vel.x);
        // define the standing animation using first frame
        this.renderable.addAnimation("shooting", [0,1,2]);

        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;

        // set the standing animation as default
        this.renderable.setCurrentAnimation("shooting");
        this.renderable.flipX(direction < 0);

        this.renderable.animationspeed = 5;

        this.lifetime = 500;
    },

    die: function() {
        this.collidable = false;
        me.game.world.removeChild(this);
    },

    onCollision: function(response, other) {
        if(other.name == "EnemyEntity"){
            this.die();
            return false;
        }

    },



    update: function(dt) {
        // this._super(me.Entity,"update",[dt]);

        console.log("Laser update accel is : "+this.body.accel.x);
        if(this.direction >0) {
            this.body.vel.x -= this.body.accel.x * (dt / 1000);
        }
        else{
            this.body.x += this.body.accel.x * (dt/1000);
        }


        this.body.vel.y = 0;
        // this.body.pos.y = this.pos.y;
        // this.updateMovement();
        this.lifetime -= dt;

        if (!this.inViewport && (this.pos.y > me.videoHeight)) {
            // if yes reset the game
            me.game.world.removeChild(this);
        }
        if (this.body.vel.x == 0) {
            // we hit a wall?
            me.game.world.removeChild(this);
        }
        if (this.lifetime <= 0) {
            me.game.world.removeChild(this);
        }

        this.body.update();
        me.collision.check(this);

        return true;
    }

});