// ITEMS ============================================================
// ** Parent object
// ** heldBy must have an actor

function Item(loc) {
  this.p = loc;
  this.heldBy = null;

  this.tick = function() {
    if (this.heldBy) {
      this.p = vec_add(this.heldBy.actor.p, xy(0.45, 0.1));
    }
  }

}
