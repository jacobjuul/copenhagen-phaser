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
const BG_HEIGHT = 11994,
      BG_WIDTH  = 2560;

const CAR_TURN = {
  first: { y: 1368, xTo: 1474, yTo: 1779 }
}

const START_POS = {
  car: { x: 900, y: 800 },
  taxi: {x: 1000, y: 100},
  train: {x: 800, y: 100},
  bike: {x: 1200, y: 100},

};

let speed = {
  car: 600,
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
  car = game.add.sprite(START_POS.car.x * scale, START_POS.car.y * scale, 'car');
  train = game.add.sprite(START_POS.train.x * scale, START_POS.train.y * scale, 'train');
  bike = game.add.sprite(START_POS.bike.x * scale, START_POS.bike.y * scale, 'bike');
  taxi = game.add.sprite(START_POS.taxi.x * scale, START_POS.taxi.y * scale, 'taxi');

  let spritesArr = [car, train, bike, taxi, background];

  for (let i in spritesArr) {
    spritesArr[i].scale.setTo(scale);
    if (i < 4) {
      spritesArr[i].anchor.setTo(0.5, 0.5);
      game.physics.arcade.enable(spritesArr[i], Phaser.Physics.ARCADE);

      spritesArr[i].body.maxVelocity.set(800);

    }
  }



  cursors = game.input.keyboard.createCursorKeys();

  game.camera.follow(car);


  game.input.mouse.mouseWheelCallback = mouseWheel;


}


function mouseWheel(event) {
  switch (game.input.mouse.wheelDelta) {
    case 1:
      car.body.velocity.y = -speed.car;
      game.physics.arcade.accelerateToXY(car, 0,0, 0, 0,0);
      break;
    case -1:


     if (car.position.y >= CAR_TURN.first.y * scale && car.position.y < CAR_TURN.first.yTo * scale) {
       car.body.velocity.y = 0;
     } else {
       car.body.velocity.y = speed.car * scale;
     }

    default:

  };

}

function movePoint() {
  if (car.position.y >= CAR_TURN.first.y * scale) {
   let rotation = game.physics.arcade.accelerateToXY(car, CAR_TURN.first.xTo * scale, CAR_TURN.first.yTo * scale, 20000 * scale, 20000, 20000);
   car.rotation = rotation * -1;
  }

  if (car.position.x >= CAR_TURN.first.xTo * scale) {
    game.physics.arcade.accelerateToXY(car, 0,0,0,0);
    car.rotation = 0;
  }
}


function update() {
  game.physics.arcade.collide(car, train);
  game.physics.arcade.collide(car, bike);
  game.physics.arcade.collide(car, taxi);

  console.log(car.position.x)

  movePoint();


  car.body.velocity.x = 0;
  car.body.velocity.y = 0;

  if (cursors.left.isDown)
  {
    //  Move to the left
    car.body.velocity.x = -450;


  }
  else if (cursors.right.isDown)
  {
    //  Move to the right
    car.body.velocity.x = 450;


  }  else if (cursors.up.isDown)
  {
    car.body.velocity.y = -450;
  } else if (cursors.down.isDown) {
    car.body.velocity.y = 450;
  }
}

function render() {
  game.debug.spriteCoords(car, 32, 500);
}
