var rocket, rocketImg;
var rock, rockImg, rocksG;
var alien, alienImg, alienG;
var shootSound, crashSound, levelUpSound, playSound, winSound;
var bg, bg2, bgImg;
var level= 1;
var score= 0;
var bullet, bulletImg, bulletG;
var gameOver, gT;
var replay, rB;
var startG, sB, inst, instpic, instpg, pgimg, back, backimg;
var station, img;
var complete, pic;


BEGIN= 3;
PLAY= 2;
WIN= 1;
END= 0;
var gameState= BEGIN;

function preload(){

    rocketImg= loadImage("rocket.png");
    rockImg= loadImage("rock.png");
    alienImg= loadImage("alien.png");
    shootSound= loadSound("shoot.wav");
    crashSound= loadSound("crash.wav");
    levelUpSound= loadSound("levelUp.mp3")
    playSound= loadSound("click.mp3");
    bgImg= loadImage("stars.jpeg");
    bulletImg = loadImage("bullet.png");
    rB= loadImage("replay.png");
    gT= loadImage("over.png");
    sB= loadImage("start.png");
    img= loadImage("station.png");
    pic= loadImage("complete.png");
    instpic= loadImage("inst.png");
    pgimg= loadImage("instpg.png");
    backimg= loadImage("back.png");
    winSound= loadSound("win.mp3");
}


function setup() {
createCanvas(windowWidth-15, windowHeight-15);

    bg2= createSprite(windowWidth/2, windowHeight/2);
    bg2.addImage(bgImg);
    bg2.scale= 2.3;
        
    bg= createSprite(windowWidth/2, windowHeight/2);
    bg.addImage(bgImg);
    bg.velocityY= (10+ 3*score/100);
    bg.scale= 2.3;
    bg.visible= false;

    rocket= createSprite(windowWidth/2,windowHeight-150);
    rocket.addImage("rocket", rocketImg);
    rocket.scale= 0.4;
    rocket.visible=false

    alienG= new Group();
    bulletG= new Group();
    rocksG= new Group();

    //console.log(bg.y);

    startG= createSprite(windowWidth/2, windowHeight/1.5);
    startG.addImage(sB);
    startG.scale= 0.5;

    gameOver= createSprite(windowWidth/2, windowHeight/3);
    gameOver.addImage(gT);
    gameOver.scale= 0.5;
    gameOver.visible=false;

    replay= createSprite(windowWidth/2, windowHeight/1.2);
    replay.addImage(rB);
    replay.scale=0.3;
    replay.visible=false;

    station= createSprite(windowWidth/2, windowHeight/6);
    station.addImage(img);
    station.scale=0.25;
    //station.debug=true;
    station.setCollider("circle", 0, 0, 300);
    station.visible= false;

    complete= createSprite(windowWidth/2, windowHeight/1.5);
    complete.addImage(pic);
    complete.scale=0.5;
    complete.visible=false;

    inst= createSprite(windowWidth/2, windowHeight/2.5);
    inst.addImage(instpic);

    instpg= createSprite(windowWidth/2, windowHeight/2);
    instpg.addImage(pgimg);
    instpg.scale=0.8;
    instpg.visible=false;

    back= createSprite(windowWidth/2, windowHeight/1.25);
    back.addImage(backimg);
    back.scale= 0.3;
    back.visible=false;
}


function draw() {
 background(0);

 if (gameState ==BEGIN) {
    

     if (mousePressedOver(inst)|| touches.length>0) {
        instpg.visible=true;
        back.visible=true;
        touches=0;
     }

     if (mousePressedOver(back)|| touches.length>0) {
        instpg.visible=false;
        back.visible=false;
        touches=0;
     }

     if (mousePressedOver(startG)|| touches.length>0) {
        startG.destroy();
        inst.destroy();
        instpg.destroy();
        back.destroy();
        gameState= PLAY;
        playSound.play();
        touches=0;
     }

     fill("black");
     textFont("Courier New");
 }


 if (gameState == PLAY) {
    
    rocket.visible=true;
    bg.visible=true;
    rocket.x = World.mouseX;

    score= score + Math.round(frameCount/60);
   
    if (bg.y>height/1.3) {
       bg.y= height/2
    }
   
    edges= createEdgeSprites();
    rocket.collide(edges);
    
    rocks();
    ufo();
   
    if (keyWentDown("space")|| touches.length>0) {
       shootSound.play();
       shootBullet();
       touches=0;
    }
   
    
    if(score>0 && score%500 === 0){
       
       levelUpSound.play();
       level= level+1;
   
       }
   
    if (bulletG.isTouching(alienG)) {
       bulletG.destroyEach();
       alienG.destroyEach();
    }
   
    if (bulletG.isTouching(rocksG)) {
       bulletG.destroyEach();
    }

    fill("red");
    textFont("Courier New");

    if (level==3) {
        gameState=WIN;
        station.visible= true;
        playSound.play();
    }

    if (rocket.isTouching(alienG)||
        rocket.isTouching(rocksG)) {
        gameState=END;
        crashSound.play();
    }


   
 }

 if (gameState== WIN) {
    
    fill("black");
    textFont("Courier New");

    bg.destroy();
    rocksG.destroyEach();
    alienG.destroyEach();
    bulletG.destroyEach();

    rocket.x= station.x;
    rocket.velocityY= -7;

    if (station.isTouching(rocket)) {
        rocket.destroy();
        complete.visible=true;
        winSound.play();
    }

 }

 if (gameState==END) {
    rocksG.destroyEach();
    alienG.destroyEach();
    bulletG.destroyEach();
    rocket.visible=false;
    bg.visible=false;
    bg2.visible=false;

    gameOver.visible=true;
    replay.visible=true;

    fill("black");
    textFont("Courier New");

    if (mousePressedOver(replay)) {
        reset();
    }
 }



 
 drawSprites();

 textSize(35);
 text(score, windowWidth-500, windowHeight-30);
 textSize(50);
 text("Level "+level, windowWidth/20, windowHeight-30);

}

function rocks() {
    if (frameCount % 10 === 0) {
      rock = createSprite(Math.round(random(windowWidth), windowHeight+50));
      rock.addImage(rockImg);
      rock.velocityY = 7;
      rock.scale = 0.3;
      rock.lifetime= 350;

      rocksG.add(rock);

        rock.depth = rocket.depth;
    rocket.depth = rocket.depth + 1;
    }
}

function ufo() {
    if (frameCount%110 == 0 && level>=2) {
        alien= createSprite(Math.round(random(windowWidth), windowHeight+50));
        alien.velocityY= 7;
        alien.addImage(alienImg);
        alien.scale= 0.3;
        alien.lifetime= 350;

        alienG.add(alien);

        alien.depth= rocket.depth;
        rocket.depth= rocket.depth+1;
    }
    
}

function shootBullet() {
    bullet= createSprite(rocket.x, rocket.y, 10,10);
    bullet.velocityY= -10;
    bulletG.add(bullet);

    bullet.addImage(bulletImg);
    bullet.scale= 0.1;

    bullet.depth= rocket.depth;
    rocket.depth= rocket.depth+1;
}

function reset() {
    gameOver.visible=false;
    replay.visible=false;

    score=0;
    level=1;

    gameState=PLAY;

    rocket.visible=true;
    bg.visible=true;
    bg2.visible=true;
}

