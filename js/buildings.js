// Buildings:
// (a) exist on other platforms (like the ground)
// (b) provide more platforms (like their roof) - NOT FULLY DECIDED/IMPLEMENTED - `todo `decide
// (c) can store people inside
// (d) have a doorway to admit people

// position p is the building's center

global.buildings = []; // index of all buildings in game

function Building(x0, size, platform) {
  this.container_platform = platform || environment.ground;
  this.p = this.container_platform.pointAt(x0); // lower left corner
  this.size = size; // xy of width and height
  this.platforms = [];
  this.people = [];
  this.door_p = vec_add(this.p, xy(rnd() * this.size.x, 0));
  this.__proto__.setupPlatform.call(this, makePlatform(this.p, this.size));
  global.buildings.push(this);
}

Building.prototype = {

  // peopleCounts: maps person role -> number of people
  prepopulate: function(peopleCounts) {
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

  // make it function like a platform
  pointAt: function() { return xy(this.door_p.x + door_size.x/2, this.door_p.y); },
  yAt: function() { return this.door_p.y; }
}