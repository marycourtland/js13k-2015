wnd.onload = function() {

  // Global game ideas - things NPC people talk about to each other
  wnd.ideas = {
    smalltalk: new Idea('smalltalk'), // this is basically the null/default idea

    drone: new Idea('drone', {
      draw: Player.drone.drawRepr
    })
  }

  // A sample platform
  wnd.platform = makePlatform(xy(15, 6), 10);
  wnd.platform.draw = function() {
    this.drawRepr(draw.shapeStyle('#2E272E'));
  }

  // `temp sample people/items
  wnd.p1 = (new Person()).init({p: xy(19, 3), v: xy(0.05, 0), platform: wnd.platform});
  wnd.p2 = (new Person()).init({p: xy(18, 3)});
  wnd.p3 = (new Person()).init({p: xy(27, 3), v: xy(-0.05, 0)});
  

  // Game target: if you overpower this one, you win
  wnd.target = (new Person()).init({p: xy(37, 3), v: xy(-0.05, 0), role: roles.game_target});

  wnd.battery1 = new Battery(xy(23, 3));
  wnd.battery2 = new Battery(xy(28, 3));

  wnd.battery1.platform = wnd.platform;

  Player.drone.controlFull((new Person()).init({p: xy(Player.drone.p.x  + 3, environment.ground.y0)}));

  wnd.loop_objects = [
    wnd.platform,
    battery1, battery2,
    Player.drone, Player.drone.person, Player,
    p1, p2, p3, target,
    environment, lightning,
    Camera, Hud
  ];
  environment.generate();

  // wnd.onFrame(200, function() {
  //   Player.drone.uncontrol();
  // })
  
  gameplay_on = true;
  reqAnimFrame(go);
};