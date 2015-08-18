// ACTORS ============================================================
// they move around
// ** parent object

function Actor(p) {
  this.p = p || xy(0, 0);
  this.v = xy(0, 0);
  this.gravity = false;

  this.tick = function() {
    this.p.x += this.v.x;
    this.p.y += this.v.y;
    if (this.gravity) {
      this.v = vec_add(this.v, gravAccel());
    }

    // Ground collision
    if (this.p.y < environment.y0) {
      this.p.y = environment.y0;
      this.v.y = 0;
    }

    this.handleBehavior();
  }

  // Behavior stuff ============================

  this.behaviors = {
    idle: function() {
      // do nothing
      return;
    }
  }

  this.current_behavior = 'idle';
  this.current_behavior_timeleft = -1;

  this.handleBehavior = function() {
    this.current_behavior_timeleft -= 1;
    
    var start_behavior = false;
    if (this.current_behavior_timeleft < 0) {
      this.switchBehavior();
      start_behavior = true;
    }

    this.behaviors[this.current_behavior].call(this, start_behavior);
  }

  this.switchBehavior = function(new_behavior) {
    // For now, choose another behavior at random
    this.current_behavior = new_behavior || rnd_choice(Object.keys(this.behaviors));
    this.current_behavior_timeleft = rnds(50, 300);
  };

}
