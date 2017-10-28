
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
        });
