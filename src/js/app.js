require('../css/main.css');
import $ from 'jquery';

import assBackground from '../assets/images/game/background.png';
import assCar        from '../assets/images/game/car.png';
import assBike       from '../assets/images/game/bike.png';
import assTrain      from '../assets/images/game/train.png';
import assTaxi       from '../assets/images/game/taxi.png';


// prevent default
window.addEventListener('mousewheel', (e) => e.preventDefault());


let car, train, bike, taxi, background, cursors, scale;
let scrolling = { down: false, up: false };
let direction = { down: false, up: false };

const BG_HEIGHT = 11994,
      BG_WIDTH  = 2560;

const CAR_TURN = {
  first:  { y: 1368, xTo: 1474, yTo: 1779 },
  second: { y: 4464, xTo: 751,  yTo: 4891 },
  third:  { y: 7437, xTo: 960,  yTo: 7692 },
  fourth: { y: 7692, xTo: 1380, yTo: 7692 },
}

const START_POS = {
  car:    { x: 900,   y: 800 },
  taxi:   { x: 1000,  y: 100 },
  train:  { x: 800,   y: 100 },
  bike:   { x: 1200,  y: 100 },

};

let speed = {
  car: 1000,
  bike: 600,
}

var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.image('background', assBackground);
  game.load.image('car', assCar);
  game.load.image('train', assTrain);
  game.load.image('taxi', assTaxi);
  game.load.image('bike', assBike);
}

function create() {
  game.renderer.clearBeforeRender = false;
  game.renderer.roundPixels = true;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  background = game.add.sprite(0, 0, 'background');

  scale = $(window).width() / background.width;
  game.world.setBounds(0, 0, BG_WIDTH * scale, BG_HEIGHT * scale);

  // Add the sprites
  car   = game.add.sprite(START_POS.car.x * scale, START_POS.car.y * scale, 'car');
  train = game.add.sprite(START_POS.train.x * scale, START_POS.train.y * scale, 'train');
  bike  = game.add.sprite(START_POS.bike.x * scale, START_POS.bike.y * scale, 'bike');
  taxi  = game.add.sprite(START_POS.taxi.x * scale, START_POS.taxi.y * scale, 'taxi');

  let spritesArr = [car, train, bike, taxi, background];

  for (let i in spritesArr) {
    spritesArr[i].scale.setTo(scale);
    if (i < 4) {
      spritesArr[i].anchor.set(0.5);
      game.physics.arcade.enable(spritesArr[i], Phaser.Physics.ARCADE);

      spritesArr[i].body.maxVelocity.set(400, 400);

    }
  }


  cursors = game.input.keyboard.createCursorKeys();
  game.camera.follow(car);
  car.body.drag.set(2500 * scale);
  car.body.maxVelocity.set(400);

  game.input.mouse.mouseWheelCallback = mouseWheel; 

}


function mouseWheel(event) {
  switch (game.input.mouse.wheelDelta) {

    case 1:
      scrolling.up = true;
      scrolling.down = false;

      break;


    case -1:
      scrolling.up = false;
      scrolling.down = true;

    default:


  };

}



function update() {
  game.physics.arcade.collide(car, train);
  game.physics.arcade.collide(car, bike);
  game.physics.arcade.collide(car, taxi);

  // Conditionals
  let carWithinFirst = car.position.y >= CAR_TURN.first.y * scale && car.position.y <= CAR_TURN.first.yTo * scale;
  let carWithinSecond = car.position.y >= CAR_TURN.second.y * scale && car.position.y <= CAR_TURN.second.yTo * scale;
  let carWithinThird = car.position.y >= CAR_TURN.third.y * scale && car.position.y <= CAR_TURN.third.yTo * scale;
  let carWithinFourth = false;

  if (car.position.y > CAR_TURN.first.y * scale && car.position.y < CAR_TURN.first.yTo * scale) {
    scrolling.down = true;
  } 

  if (car.position.y > CAR_TURN.second.y * scale && car.position.y < CAR_TURN.second.yTo * scale) {
    scrolling.down = true;
  }  

  if (car.position.y > CAR_TURN.third.y * scale && car.position.y < CAR_TURN.third.yTo * scale) {
    scrolling.down = true;
  }  

  if (car.position.y >= CAR_TURN.fourth.y * scale && car.position.y <= CAR_TURN.fourth.yTo * scale) {
    scrolling.down = true;
  } 
  

  if (scrolling.down) {
   
   // FIRST MOVEMENT POINT
    if (carWithinFirst) {
      let rotation = game.physics.arcade.angleToXY(car, CAR_TURN.first.xTo * scale, CAR_TURN.first.yTo * scale);
      console.log(rotation)
      car.rotation = -rotation - 0.5;
      game.physics.arcade.velocityFromRotation(rotation, speed.car * scale, car.body.velocity);

    } else {
      car.body.velocity.y = speed.car * scale;
      car.rotation = 0;
    }

    // Second movement Point
    if (carWithinSecond) {
      let rotation = game.physics.arcade.angleToXY(car, CAR_TURN.second.xTo * scale, CAR_TURN.second.yTo * scale);
      console.log(rotation);

      car.rotation = (-rotation * -rotation + 0.5);
      game.physics.arcade.velocityFromRotation(rotation, speed.car * scale, car.body.velocity);
    }

    // Third movement Point
    if (carWithinThird) {
      let rotation = game.physics.arcade.angleToXY(car, CAR_TURN.third.xTo * scale, CAR_TURN.third.yTo * scale);
      console.log(rotation)
      car.rotation = -rotation - 0.5;
      game.physics.arcade.velocityFromRotation(rotation, speed.car * scale, car.body.velocity);
    }

    // Fourth movement point
    if (carWithinFourth) {
      
      game.physics.arcade.velocityFromRotation(-1.5, speed.car * scale, car.body.velocity);
    }
    
    scrolling.down = false;
    scrolling.up = false;

  }

  if (scrolling.up) {
    
    //  Move to the left
    car.body.velocity.y = -speed.car * scale;
    scrolling.up = false;
    scrolling.down = false;
  }
}


function render() {
  // game.debug.spriteCoords(car, 32, 500);

    game.debug.body(car);
    game.debug.spriteInfo(car, 30, 30);
}
