Enemy = me.Entity.extend({
		init : function (x, y, feature) {

			feature = feature || {};
			feature.width = feature.width || 32;
			feature.height = feature.height || 32;
			feature.framewidth = feature.framewidth || 32;
			feature.frameheight =  feature.frameheight || 32;
			this.speed =  feature.speed || 1;
			feature.hp = feature.hp || 2;


			if(!feature.path) {
				this.currentPoint = -1;
			}
			else {
				this.path = feature.path;
				this.currentPoint = 0;
			}

			this.renderable.addAnimation("idle", [0, 1, 2]);
			this.renderable.addAnimation("hit", [3, 2]);
			this.changeAnimation("idle");
			this.hp = feature.hp;
			this._super(me.Entity, 'init', [x, y, feature]);
			this.pos.z = 5;

			this.body.setMaxVelocity(this.speed, this.speed);
			this.body.gravity = 0;

}
	
	startGame: function(){
        this.render = true;
        var self = this;
        this.showHarvestSouls = false;
        this.showFindGate = true;
        this.findGatePos.x = -500;
        new me.Tween(self.findGatePos).to({x:100}, 500).easing(me.Tween.Easing.Quintic.Out).delay(1000).onComplete(function(){
            new me.Tween(self.findGatePos).to({x:1000}, 1000).easing(me.Tween.Easing.Quintic.In).delay(2000).onComplete(function(){
                self.showFindGate = false;
            }).start();
        }).start();

        var h = this.getGaugeHeight();
        this.gaugeRenderHeight.val = h;
    },

    endGame: function(){
        this.render = false;
    },
	
(function() {
	current.EnemyBoomer = current.Enemy.extend({
		init: function(x, y, initializeSet) {
			initializeSet = initializeSet || {};
			initializeSet.image = 'enemy2';
			initializeSet.shapes = [ new me.Rect( 0, 0, 16, 18) ];
			initializeSet.speed = current.Constant.speed.slow;
			initializeSet.hp = 3;

			this.bullet = {
				type: 'BulletShooter',
				speed: current.Constant.speed.slow,
			};
			this.bulletCount = 10;

			this._super(current.Enemy, 'init', [x, y, initializeSet]);
		},

		chooseDirection: function() {
			// Always move in the direction of the player.
			return new me.Vector2d(this.speed, 0).rotate(this.angleToPlayer());
		},

		die: function() {
			for (var i = 0; i < this.bulletCount; i++) {
				var angle = i * (Math.PI * 2) / this.bulletCount;

				this.shoot({
					angle: angle,
				});
			}
			this._super(current.Enemy, 'die', []);
		},

		getDeathSound: function() {
			return "enemy2death";
		}
	});
})();
