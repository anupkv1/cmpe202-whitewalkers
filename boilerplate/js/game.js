
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if ( !me.video.init( 'canvas', screenWidth, screenHeight ) ) {
            alert ("Yer browser be not workin");
        }

        me.audio.init ("m4a,ogg" );

        // Sync up post loading stuff.
        me.loader.onload = this.loaded.bind( this );

        me.loader.preload( GameResources );

        me.state.change( me.state.LOADING );


        return;
    },

    // Run on game resources loaded.
    "loaded" : function () {
      me.state.set( me.state.INTRO, new RadmarsScreen() );
      me.state.set( me.state.MENU, new TitleScreen() );
      me.state.set( me.state.PLAY, new PlayScreen() );
      me.state.set( me.state.GAMEOVER, new GameOverScreen() );

      me.state.change( me.state.INTRO);

      me.pool.register( "player", Player );
      me.pool.register( "baddie", Baddie );

      me.pool.register( "fish", Fish );
      me.pool.register( "wasp", Wasp );
      me.pool.register( "crab", Crab );
      me.pool.register( "cat", Cat );

      me.pool.register( "pickup", Pickup );
      me.pool.register( "underworld", Underworld );
      me.pool.register( "levelchanger", LevelChanger );
      me.pool.register( "gameender", GameEnder );
    };
};

game.data = {souls:1, collectedSouls:0, collectedSoulsMax:15, beatGame:false};

game.HUD = game.HUD || {};

game.HUD.Container = me.ObjectContainer.extend({
    init: function() {
        // call the constructor
        this.parent();

        this.isPersistent = true;
        this.collidable = false;

        // make sure our object is always draw first
        this.z = Infinity;
        this.name = "HUD";
        this.soulDisplay = new game.HUD.SoulDisplay(25, 25);
        this.addChild(this.soulDisplay);
    },

    startGame:function(){
        this.soulDisplay.startGame();
    },

    endGame: function(){
        this.soulDisplay.endGame();
    },

    toUnderworld: function() {
        this.soulDisplay.toUnderworld();
    }
});

Game.HUD.SoulDisplay = me.Renderable.extend( {

});

var HitEnter = me.Renderable.extend({

  init: function( x, y ) {
        this.cta = me.loader.getImage("introcta");
        this.parent( new me.Vector2d(x,y), this.cta.width, this.cta.height );
        this.floating = true;
        this.z = 5;
        this.ctaFlicker = 0;
    },

    draw: function(context) {
        this.ctaFlicker++;
        if( this.ctaFlicker > 20 )
        {
            context.drawImage( this.cta, this.pos.x, this.pos.y );
            if( this.ctaFlicker > 40 ) this.ctaFlicker = 0;
        }
    },

    update: function(dt) {
        me.game.repaint();
    }

});

var GameOverScreen = me.ScreenObject.extend({

});

var TitleScreen = me.ScreenObject.extend({
});

var LevelChanger = me.ObjectEntity.extend({

});

var Baddie = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        settings = settings || {}
        settings.image = settings.image || 'robut';
        settings.spritewidth = settings.spritewidth || 141;
        settings.spriteheight = settings.spriteheight || 139;
        
        this.type = settings.type;
        this.skel = settings.skel;
        if( settings.skel ) {
            settings.image = settings.image + '_skel';
        }
        
        this.parent( x, y, settings );
        this.alwaysUpdate = false;
        this.baddie = true;
        this.setVelocity( 3, 15 );
        this.setFriction( 0.4, 0 );
        this.direction = 1;
        this.collidable = true;
        this.overworld = settings.overworld ? true : false;

        // Hack...
        me.state.current().baddies.push(this);

        this.renderable.animationspeed = 70;
    },
        checkBulletCollision: function(){
        me.game.world.collide(this, true).forEach(function(col) {
            if(col && col.obj.bullet && !this.overworld ) {
                col.obj.die();
                me.state.current().baddies.remove(this);
                me.game.viewport.shake(2, 250);
                //TODO: spawn death particle?
                this.collidable = false;
                me.game.world.removeChild(this);

                var p = new Pickup(this.pos.x, this.pos.y-150, {});
                me.game.world.addChild(p);

                // #ProHacks
                var b = new window[this.type](this.pos.x, this.pos.y, {
                    skel: 1,
                    x: this.pos.x,
                    y: this.pos.y,
                    overworld:1,
                    width: 80, // TODO This controls patrol???
                    height: 80
                });
                b.z = 300;
                me.game.world.addChild(b);
                me.game.world.sort();

                me.audio.play( "enemydeath" + Math.round(1+Math.random()*3) );

                me.state.current().updateLayerVisibility(me.state.current().overworld);
            }
        }, this);
    },
    update: function(dt) {
        this.parent(dt);
        this.updateMovement();
        this.checkBulletCollision();
        return true;
    }
        });

var Player = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        settings.image        = settings.image        || 'player';
        settings.spritewidth =  40*3;
        settings.spriteheight = 48*3;
        settings.height = 40*3;
        settings.width = 48*3;
        this.parent( x, y, settings );
        this.alwaysUpdate = true;
        this.player = true;
        this.hitTimer = 0;
        this.hitVelX = 0;
        this.image =  me.loader.getImage('player2');
        this.necroMode = true;
        this.overworld = false;

        this.z = 200;
        this.shootDelay = 0;
        this.disableInputTimer = 0;

        var shape = this.getShape();
        shape.pos.x = 44;
        shape.pos.y = 0;
        shape.resize(70, 110);
        me.state.current().player = this;

        this.collisionTimer = 0;
        this.deathTimer = 0;
        this.doubleJumped = false;

        this.animationSuffix = "";

        this.setVelocity( 5, 16 );
        this.setFriction( 0.4, 0 );
        this.direction = 1;

        this.centerOffsetX = 75;
        this.centerOffsetY = 0;

        this.followPos = new me.Vector2d(
            this.pos.x + this.centerOffsetX,
            this.pos.y + this.centerOffsetY
        );

        me.game.viewport.follow( this.followPos, me.game.viewport.AXIS.BOTH );
        me.game.viewport.setDeadzone( me.game.viewport.width / 10, 1 );

        this.renderable.animationspeed = 150;
        this.renderable.addAnimation( "idle", [ 0, 1, 2 ] );
        this.renderable.addAnimation( "double_jump", [ 10 , 9  ] );
        this.renderable.addAnimation( "jump", [ 9 ] );
        this.renderable.addAnimation( "jump_extra", [ 9 ] );
        this.renderable.addAnimation( "fall", [ 10 ] );
        this.renderable.addAnimation( "walk", [ 4, 5, 6, 7 ] );
        this.renderable.addAnimation( "shoot", [ 3 ] );
        this.renderable.addAnimation( "shoot_jump", [ 8 ] );
        this.renderable.addAnimation( "hit", [ 11 , 11, 11] );

        var offset = 12;
        this.renderable.addAnimation( "idle_normal", [ 0 + offset, 1 + offset, 2 + offset ] );
        this.renderable.addAnimation( "jump_normal", [ 9 + offset ] );
        this.renderable.addAnimation( "double_jump_normal", [ 10 + offset, 9 + offset ] );
        this.renderable.addAnimation( "jump_extra_normal", [ 9 + offset ] );
        this.renderable.addAnimation( "fall_normal", [ 10 + offset ] );
        this.renderable.addAnimation( "walk_normal", [ 4 + offset, 5 + offset, 6 + offset, 7 + offset ] );
        this.renderable.addAnimation( "shoot_normal", [ 3 + offset ] );
        this.renderable.addAnimation( "shoot_jump_normal", [ 8 + offset ] );
        this.renderable.addAnimation( "hit_normal", [ 11 + offset , 11 + offset, 11 + offset] );

        this.renderable.addAnimation( "die", [ 11 , 23, 11 , 23, 11 , 23, 11 , 23] );

        this.renderable.setCurrentAnimation("idle" + this.animationSuffix);



        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,   "up", true);
        me.input.bindKey(me.input.KEY.W,    "up", true);

        me.input.bindKey(me.input.KEY.A,    "left");
        me.input.bindKey(me.input.KEY.D,    "right");
    },

    toUnderworld: function(){
        if(this.overworld == true) return;

        this.overworld = true;
        this.necroMode = false;
        this.setVelocity( 7, 20 );
        this.setFriction( 0.7, 0 );

        this.disableInputTimer = 1500;

        LD30.data.collectedSouls += LD30.data.souls;
        this.renderable.animationspeed = 165;
        if(LD30.data.souls > 0){
            for( var i=0; i<LD30.data.souls; i++){
                var b = new EnterPortalParticle(this.pos.x, this.pos.y, {delay:i*50});
                me.game.world.addChild(b);
            }
            me.game.world.sort();
            LD30.data.souls = 0;
        }
        this.animationSuffix = "_normal";
    },

    shoot: function(){
        if(this.necroMode && this.shootDelay <= 0){
            me.audio.play( "shoot", false, null, 0.6 );
            var b = new Bullet(this.pos.x + 30*this.direction, this.pos.y+40, { direction: this.direction });
            me.game.world.addChild(b);
            me.game.world.sort();
            this.shootDelay = 200;
            var self = this;
            if(this.jumping || this.falling){
                this.renderable.setCurrentAnimation("shoot_jump" + this.animationSuffix, function() {
                    self.renderable.setCurrentAnimation("fall" + self.animationSuffix);
                });
            }else{
                this.renderable.setCurrentAnimation("shoot" + this.animationSuffix, function() {
                    self.renderable.setCurrentAnimation("idle" + self.animationSuffix);
                })
            }


        }
    },
    
    update: function(dt) {
        var self = this;
        this.parent(dt);

        if(this.shootDelay >0){
            this.shootDelay-=dt;
        }

        if(this.deathTimer > 0){
            this.deathTimer-=dt;
            if( ! this.renderable.isCurrentAnimation("die") ){
                this.renderable.setCurrentAnimation("die");
            }
            this.updateMovement();
            if(this.deathTimer<=0){
                me.state.change( me.state.GAMEOVER);
            }
            return true;
        }

        this.followPos.x = this.pos.x + this.centerOffsetX;
        this.followPos.y = this.pos.y + this.centerOffsetY;

        if(this.disableInputTimer > 0){
            this.disableInputTimer-=dt;
            this.gravity = 0;
            this.vel.x = 0;
            this.vel.y = 0;
            this.updateMovement();
            return true;
        }else{
            this.gravity = 1;
        }



        if(this.collisionTimer > 0){
            this.collisionTimer-=dt;
        }

        if(this.hitTimer > 0){
            this.hitTimer-=dt;
            this.vel.x = this.hitVelX;
            this.updateMovement();
            return true;
        }

        // TODO acceleration
        if (me.input.isKeyPressed('left'))  {
            this.vel.x = -25.5;
            this.flipX(true);
            this.direction = -1;
            if( ! this.renderable.isCurrentAnimation("walk" + this.animationSuffix) ){
                this.renderable.setCurrentAnimation("walk" + this.animationSuffix, function() {
                    self.renderable.setCurrentAnimation("idle" + self.animationSuffix);
                })
            }
        } else if (me.input.isKeyPressed('right')) {
            this.vel.x = 25.5;
            this.flipX(false);
            this.direction = 1;
            if( ! this.renderable.isCurrentAnimation("walk" + this.animationSuffix) ){
                this.renderable.setCurrentAnimation("walk" + this.animationSuffix, function() {
                    self.renderable.setCurrentAnimation("idle" + self.animationSuffix);
                })
            }
        }

        if(this.falling && this.vel.y > 0){
            if( ! this.renderable.isCurrentAnimation("shoot_jump" + this.animationSuffix) ){
                this.renderable.setCurrentAnimation("fall" + this.animationSuffix);
            }
        }

        if(!this.falling && !this.jumping && this.vel.y == 0){
           // console.log("doblejump reset");
            this.doubleJumped = false;
            if(!me.input.isKeyPressed('right') && !me.input.isKeyPressed('left') && ! this.renderable.isCurrentAnimation("idle" + this.animationSuffix)&& ! this.renderable.isCurrentAnimation("shoot" + this.animationSuffix)){
                this.renderable.setCurrentAnimation("idle" + this.animationSuffix);
            }
        }

        if( me.input.isKeyPressed('up')) {
            if(!this.jumping && !this.falling){
                this.vel.y = -40;
                this.jumping = true;
                self.renderable.setCurrentAnimation("jump" + this.animationSuffix);
                me.audio.play( "jump", false, null, 0.6 );
            }
            else if((this.jumping || this.falling) && !this.doubleJumped){
                this.doubleJumped = true;
                this.vel.y = -40;
                self.renderable.setCurrentAnimation("double_jump" + this.animationSuffix);
                me.audio.play( "doublejump", false, null, 0.6 );
            }
        }

        return true;
    }
})

   

