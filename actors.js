// ACTORS ============================================================
// they move around
// ** parent object

function Actor(p) {
  this.p = p || xy(0, 0);
  this.v = xy(0, 0);

  this.tick = function(s) {
    this.p.x += this.v.x;
    this.p.y += this.v.y;
  }
}
