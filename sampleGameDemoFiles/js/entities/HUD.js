/**
 * a HUD container and child items
 * Heads Up Display AKA Status Bar
 */

game.HUD = game.HUD || {};

console.log("Inside HUD.js");
game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(10, 50));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        //create the font object
        //this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'),me.loader.getImage('PressStart2P'));
        this.font = new me.Font("Arial", 20, "white", "left");
        //font alignment to right bottom
        this.font.scale = 1.0
        this.font.textAlign = "left";
        this.font.textBaseline = "bottom";

        // local copy of the global score
        this.score = -1;
        this.noOfLives = -1;
        this.noOfShots = -1;
    },

    /**
     * update function
     */
    update : function (dt) {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        if (this.noOfLives !== game.data.noOfLives) {
            this.noOfLives = game.data.noOfLives;
            return true;
        }
        if (this.noOfShots !== game.data.noOfShots) {
            this.noOfShots = game.data.noOfShots;
            return true;
        }

        return false;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        this.font.draw (renderer, "Score: ", this.pos.x,  this.pos.y);
        this.font.draw (renderer, game.data.score,  this.pos.x + 100, this.pos.y);
        this.font.draw (renderer, "Lives: ", this.pos.x , this.pos.y + 30);
        this.font.draw (renderer, game.data.noOfLives, this.pos.x + 100, this.pos.y + 30);
        this.font.draw (renderer, "Shots: ", this.pos.x, this.pos.y + 60);
        this.font.draw (renderer, game.data.noOfShots, this.pos.x + 100, this.pos.y + 60);
        }
    });

