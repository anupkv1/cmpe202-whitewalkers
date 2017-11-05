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