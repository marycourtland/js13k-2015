wnd.onload = function() {

  // Global game ideas - things NPC people talk about to each other
  wnd.ideas = {
    smalltalk: new Idea('smalltalk'), // this is basically the null/default idea

    drone: new Idea('drone', {
      draw: Player.drone.drawRepr
    })
  }

  // `temp sample people/items
  wnd.p1 = (new Person()).init({p: xy(14, 3), v: xy(0.05, 0)});
  wnd.p2 = (new Person()).init({p: xy(18, 3)});
  wnd.p3 = (new Person()).init({p: xy(27, 3), v: xy(-0.05, 0)});

  wnd.battery1 = new Battery(xy(25, 3));
  wnd.battery2 = new Battery(xy(28, 3));

  Player.drone.controlFull((new Person()).init({p: xy(Player.drone.p.x  + 3, environment.y0)}));

  wnd.loop_objects = [
    battery1, battery2,
    Player.drone, Player.drone.person, Player,
    p1, p2, p3,
    environment, lightning,
    Camera, Hud
  ];
  environment.generate();
  
  gameplay_on = true;
  reqAnimFrame(go);
};