global.onload = function() {
  environment.generate();

  // Global game ideas - things NPC people talk about to each other
  global.ideas = {
    smalltalk: new Idea('smalltalk'), // this is basically the null/default idea

    drone: new Idea('drone', {
      draw: Player.drone.drawRepr
    })
  }


  // `temp sample people/items
  global.p1 = (new Person()).init({p: xy(19, 3), v: xy(0.05, 0)});
  global.p2 = (new Person()).init({p: xy(18, 3)});
  global.p3 = (new Person()).init({p: xy(27, 3), v: xy(-0.05, 0), role: roles.guard});
  

  // Game target: if you overpower this one, you win
  global.target = (new Person()).init({p: xy(37, 3), v: xy(-0.05, 0), role: roles.game_target});

  global.battery1 = new Battery(xy(23, 3));
  global.battery2 = new Battery(xy(28, 3));

  global.p = (new Person()).init({p: xy(Player.drone.p.x  + 3, environment.ground.y0)});
  Player.drone.controlFull(p);


  addToLoop('background', [Player]);

  addToLoop('background', environment.buildings)

  addToLoop('foreground1', [
      battery1,
      battery2,
      Player.drone,
      Player.drone.person,
      p1,
      p2,
      p3,
      target
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