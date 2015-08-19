wnd.onload = function() {
  window.loop_objects = [environment, Player, Player.drone, lightning, Hud];

  // `temp sample people/items
  window.p1 = new Person(xy(14, 3));
  window.p2 = new Person(xy(18, 3));
  window.p3 = new Person(xy(27, 3));
  p1.v = xy(0.05, 0);
  p3.v = xy(-0.05, 0);

  loop_objects.push(p1);
  loop_objects.push(p2);
  loop_objects.push(p3);

  window.battery1 = new Battery(xy(25, 3));
  window.battery2 = new Battery(xy(28, 3));
  loop_objects.push(battery1);
  loop_objects.push(battery2);

  // console.log('DRONE:', Player.drone)

  Player.drone.control(new Person(xy(Player.drone.p.x  + 3, 3)));
  loop_objects.push(Player.drone.person);

  environment.generate();
  
  gameplay_on = true;
  reqAnimFrame(go);
};