global.onload = function() {
  // show the intro animation
  function go() {
    if (gameplay_on) { return; }
    gameplay_frame += 1;
    reqAnimFrame(go);
    introimg.clear();
    Player.drone.drawRepr(
      xy(game_size.x * 0.7, game_size.y * 0.4),
      10,
      draw.shapeStyle('white'),
      {ctx: introimg.ctx, rpm_scale: 0.2}
    );

  }
  reqAnimFrame(go);
}

$("#start-game").onclick = setup;
// $("#skip").onclick = setup; // `todo: fix the skip button

// `temporary SKIP THE INTRO
// global.onload = setup;

function setup () {
  // Clean up intro
  $("#game-intro").style.display = 'none';
  $("#intro-img").style.display = 'none';

  // Setup things!
  environment.generate();

  // Global game ideas - things NPC people talk about to each other
  global.ideas = {
    smalltalk: new Idea('smalltalk'), // this is basically the null/default idea

    drone: new Idea('drone', {
      draw: Player.drone.drawRepr
    })
  }

  // Game target: if you overpower this one, you win
  global.target = (new Person()).init({p: xy(200, 3), v: xy(-0.05, 0), role: roles.game_target});


  addToLoop('background', [Events, Player]);

  addToLoop('background', environment.buildings)

  addToLoop('foreground1', [
      Player.drone,
      (new Person()).init({p: xy(game_size.x + 5, 3)}),
      target,
      new Battery(xy(game_size.x + 8, 3)),
  ]);

  addToLoop('foreground2', [
    environment,
    lightning
  ]);

  addToLoop('overlay', [Camera, Hud]);

  environment.buildings.forEach(function(b) {
    b.prepopulate();
  });


  
  startGame();
};

