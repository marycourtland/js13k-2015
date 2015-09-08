// Buildings:
// (a) exist on other platforms (like the ground)
// (b) provide more platforms (like their roof) - NOT FULLY DECIDED/IMPLEMENTED - `todo `decide
// (c) can store people inside
// (d) have a doorway to admit people

// position p is the building's center

global.buildings = []; // index of all buildings in game

function Building(x0, size, platform) {
  this.container_platform = platform || environment.ground;
  this.p = xy(
    x0, 
    this.container_platform.getMin(x0, x0 + size.y)
  )

  this.size = size; // xy of width and height
  this.platforms = [];
  this.people = [];
  this.emptied = false;
  this.door_p = vec_add(this.p, xy(door_size.x + rnd() * (this.size.x - 2*door_size.x), 0));
  this.__proto__.setupPlatform.call(this, makePlatform(this.p, this.size));
  global.buildings.push(this);

  this.peopleCounts = {};
}

Building.prototype = {

  // peopleCounts: maps person role -> number of people
  prepopulate: function(peopleCounts) {
    peopleCounts = peopleCounts || this.peopleCounts;
    for (var roleName in peopleCounts) {
      var role = roles[roleName];
      for (var i = 0; i < peopleCounts[roleName]; i++) {
        var p = (new Person()).init({platform: this, role: role});
        this.personEnter(p);
        addToLoop('foreground1', p);
      }
    }
  },

  tick: function() {
    if (!this.emptied && dist(Player.drone.p, this.p) < people_comeout_window) {
      this.everyoneExits();
    }
  },

  draw: function() {
    this.platforms[0].drawRepr(draw.shapeStyle(building_color));
    draw.r(stage.ctx, this.door_p, vec_add(this.door_p, door_size), draw.shapeStyle(door_color));
  },

  setupPlatform: function(platform) {
    this.platforms.push(platform);
    // `todo: a way for people to access the platform
  },

  personEnter: function(person) {
    person.hidden = true;
    person.platform = this;
    this.people.push(person);
  },

  personExit: function() {
    if (this.people.length === 0) { return; }
    var person = this.people.shift(); // take first person
    person.hidden = false;
    person.platform = this.container_platform;
    return person;
  },

  everyoneExits: function(direction) {
    for (var i = 0; i < this.people.length; i++) {
      var building = this;
      scheduleEvent(i*50, function() {
        var dir = direction || rnds(-1, 1)
        building.personExit().v = xy(dir * perturb(0.1, 0.02), 0);
      })
    }
    this.emptied = true;
  },

  // make it function like a platform
  pointAt: function() { return xy(this.door_p.x + door_size.x/2, this.door_p.y); },
  yAt: function() { return this.door_p.y; }
}