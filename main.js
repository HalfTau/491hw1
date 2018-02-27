var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX * frameWidth;
    this.startY = startY * frameHeight;
    this.frameWidth = frameWidth;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }

    var colIndex = this.currentFrame() % this.sheetWidth
    var rowIndex = Math.floor(this.currentFrame() / this.sheetWidth);

    if ((colIndex + 1) * this.frameWidth > this.spriteSheet.width) {
        rowIndex++;
    }

    ctx.drawImage(this.spriteSheet, colIndex * this.frameWidth + this.startX,
        rowIndex * this.frameHeight + this.startY, this.frameWidth,
        this.frameHeight, x, y, this.frameWidth * this.scale, this.frameHeight * this.scale);
}


Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Knight(game, img) {
  this.animation = [];
  this.currAnimation = null;
  this.speed = 150;
  this.ctx = game.ctx;
  this.animation["S"] = new Animation(img, 0, 0, 32, 32, 160,0.1, 4, true, 1.25);
  this.animation["N"] = new Animation(img, 0, 1, 32, 32, 160,0.1, 4, true, 1.25);
  this.animation["W"] = new Animation(img, 0, 2, 32, 32, 160,0.1, 4, true, 1.25);
  this.animation["E"] = new Animation(img, 0, 3, 32, 32, 160,0.1, 4, true, 1.25);
  this.animation["Ssword"] = new Animation(img, 0, 4, 32, 32, 160,0.1, 4, true, 1.25);
  this.animation["Nsword"] = new Animation(img, 0, 5, 32, 32, 160,0.1, 4, true, 1.25);
  this.animation["Wsword"] = new Animation(img, 0, 6, 32, 32, 160,0.1, 4, true, 1.25);
  this.animation["Esword"] = new Animation(img, 0, 7, 32, 32, 160,0.1, 4, true, 1.25);
  this.currAnimation = this.animation["S"];
  Entity.call(this, game, 10, 20);

}

Knight.prototype = new Entity();
Knight.prototype.constructor = Knight;

Knight.prototype.update = function () {
  if (this.game.chars["KeyD"] === true)  {
    this.direction = "E";
    this.game.player.x += this.game.player.speed * this.game.clockTick;
    this.currAnimation = this.animation["E"];
  }
  if (this.game.chars["KeyA"] === true) {
    this.direction = "W";
    this.game.player.x -= this.game.player.speed * this.game.clockTick;
    this.currAnimation = this.animation["W"];
  }
  if (this.game.chars["KeyW"] === true) {
    this.direction = "N";
    this.game.player.y -= this.game.player.speed * this.game.clockTick;
        this.currAnimation = this.animation["N"];
  }
  if (this.game.chars["KeyS"] === true) {
    this.direction = "S";
    this.game.player.y += this.game.player.speed * this.game.clockTick;
        this.currAnimation = this.animation["S"];
  }
  if (this.game.chars["Space"] === true) {
    if(this.direction === "E") {
      this.currAnimation = this.animation["Esword"];
    }
    if(this.direction === "W") {
      this.currAnimation = this.animation["Wsword"];
    }
    if(this.direction === "N") {
      this.currAnimation = this.animation["Nsword"];
    }
    if(this.direction === "S") {
      this.currAnimation = this.animation["Ssword"];
    }
  }
  if (this.x > 805) this.x = -10;
  if (this.y > 705) this.y = 0;
  if (this.x < -10) this.x = 810;
  if (this.y < 0) this.y = 700;
  Entity.prototype.update.call(this);
}


Knight.prototype.draw = function () {

  this.currAnimation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y );

      Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/player.PNG");
AM.queueDownload("./img/tile1.PNG");
AM.queueDownload("./img/tile2.PNG")

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();

    gameEngine.map = new Map(gameEngine);

    gameEngine.map.readMap(new MapData().map);

    gameEngine.init(ctx);
    gameEngine.start();



    gameEngine.player = new Knight(gameEngine, AM.getAsset("./img/player.PNG"));
    gameEngine.addEntity(gameEngine.player);
    console.log("All Done!");
});
