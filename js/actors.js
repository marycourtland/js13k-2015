// ACTORS ============================================================
// they move around
// ** parent object

function Actor(p) {
  this.p = p || xy(0, 0);
  this.v = xy(0, 0);
  this.gravity = false;
  this.platform = environment.ground;
  this.stay_on_platform = false;

  this.tick = function() {
    this.p.x += this.v.x;
    this.p.y += this.v.y;

    if (this.gravity) {
      this.v = vec_add(this.v, gravAccel());
    }

    // Ground collision
    var y0 = this.platform.yAt(this.p.x);
    if (this.p.y < y0) {
      this.p.y = y0;

      // Don't do this every frame so that actor doesn't get stuck
      this.v.y = max(this.v.y, 0);
      // this.color = 'red';

      if (this.stay_on_platform) {
        // Set y coordinate to be the platform's y coordinate
        this.p =this.platform.pointAt(this.p.x);
      }
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
  this.current_behavior_params = {};

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
