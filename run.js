wnd.onload = function() {

  // `temp sample people/items
  window.p1 = new Person(xy(14, 3));
  window.p2 = new Person(xy(18, 3));
  window.p3 = new Person(xy(27, 3));
  p1.v = xy(0.05, 0);
  p3.v = xy(-0.05, 0);

  window.battery1 = new Battery(xy(25, 3));
  window.battery2 = new Battery(xy(28, 3));

  Player.drone.controlFull(new Person(xy(Player.drone.p.x  + 3, 3)));

  window.loop_objects = [
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