global.wind = {
  pts: [],
  remaining_propagations: 0,

  slowness: 1,

  curl: 0,
  curl_frequency: 10,
  previous_angle: 0,
  curl_amplitude: 0.1,
  propagation_length: 1,
  num_propagations: [50, 60],
  angle_window: [-pi/4, pi/4],
  height_window: [environment.ground.y0, game_size.y - 4],
  next_curl_dir: 1,

  curl: 0,
  curl_frequency: 10,
  previous_angle: 0,
  curl_amplitude: 0.1,
  propagation_length: 1,

  total_angle: 0,

  starting_angles: [0, pi],
  starting_angles: [0],

  visible_gust_length: 6,

  bezier_control_fraction: 0.18,
  bezier_controls: {},

  startGust: function(origin) {
    // Random walk in a general direction (rightwards, for now - `temp)
    this.pts = [origin];
    this.bezier_controls = {};
    this.curl = 0;
    this.remaining_propagations = rnds.apply(null, this.num_propagations);
    this.previous_angle = rnd_choice(this.starting_angles);
    this.total_angle = 0;
    this.propagation_frames = -1;
    this.next_curl_dir = rnd_choice([1, -1]);
  },

  influenceDrone: function() {
    if (this.pts.length < 2) { return; } // `todo: maybe i want to limit this to < 3 because of the rendering
    for (var i = this.getStart() - 1; i < this.pts.length - 2; i++) {
      var dp = cart2polar(vec_subtract(Player.drone.p_drawn, this.pts[i]));
      if (dp.r < wind_influence_distance) {
        Player.drone.experienceWind(dp, cart2polar(vec_subtract(this.pts[i + 1], this.pts[i])));
      }
    }
  },

  reset: function() {
  },

  tick: function() {
    // `todo: modulate speed?
    this.propagation_frames += 1;
    if (this.propagation_frames % this.slowness !== 0) { return; }

    if (this.remaining_propagations > 0 && this.pts.length > 0) {
      // redo the curl every few frames

      // `crunch
      // var min_curl = (this.total_angle < this.angle_window[0] || this.last().y < this.height_window[0]) ? 0 : -this.curl_amplitude;
      // var max_curl = (this.total_angle > this.angle_window[1] || this.last().y > this.height_window[1]) ? 0 : this.curl_amplitude;

      var min_curl = 0;
      var max_curl = this.curl_amplitude;
      if ((gameplay_frame * this.slowness) % this.curl_frequency === 0) {
        if (this.next_curl_dir === 1) {
          this.curl = rnds(min_curl, max_curl);
        }

        // this causes alternating curl directions
        this.curl *= this.next_curl_dir;
        this.next_curl_dir *= -1;
      }

      var propagation = rth(this.propagation_length, this.previous_angle + this.curl);
      this.pts.push(vec_add(
        this.last(),
        polar2cart(propagation)
      ));

      this.calculateNextControlPoint();

      this.previous_angle = propagation.th;
      this.total_angle += this.previous_angle;
      this.remaining_propagations -= 1;
    }

    this.influenceDrone();
  },

  calculateNextControlPoint: function() {
    // this is used for the drawing. each point has two bezier controls on either side
    if (this.pts.length < 2) { return; }
    if (this.pts.length === 2) {
      this.bezier_controls[0] = [this.pts[0], this.pts[0]]; // meh, it's the first point
    }
    else {
      var n = this.pts.length - 2;
      var p1 = this.pts[n-1], p2 = this.pts[n], p3 = this.pts[n+1];
      var dp = vec_subtract(p3, p1);
      var dprth = cart2polar(dp);
      var dcontrol = rth(dprth.r * this.bezier_control_fraction * this.curl, dprth.th);
      var dcontrolxy = polar2cart(dcontrol);

      var c1 = xy(p2.x - dcontrolxy.x, p2.y - dcontrolxy.y);
      var c2 = xy(p2.x + dcontrolxy.x, p2.y + dcontrolxy.y);

      this.bezier_controls[n] = this.curl > 0 ? [c1, c2] : [c2, c1];
    }
  },

  // `crunch not sure how much this is used
  last: function() {
    if (this.pts.length < 1) { return null; }
    return this.pts[this.pts.length - 1]
  },

  draw: function() {
    if (this.pts.length < 3) { return; }

    var pts = this.pts;
    var controls = this.bezier_controls;

    wind_colors.forEach(function(data) {
      draw.do(windlayer.ctx, draw.lineStyle(data[0], {lineWidth: data[1], globalAlpha: data[2], lineCap:'round'}), function() {
        var start = wind.getStart();
        windlayer.ctx.beginPath();
        windlayer.ctx.moveTo(pts[start - 1].x, pts[start - 1].y);

        for (var i = start; i < pts.length - 1; i++) {
          var c0 = controls[i-1][1];
          var c1 = controls[i][0];
          var p1 = pts[i];
          windlayer.ctx.bezierCurveTo(c0.x, c0.y, c1.x, c1.y, p1.x, p1.y);
        }
        // Note: the last point doesn't get drawn (it doesn't have an associated bezier control yet)
      })
    })

  },

  getStart: function() {
    // Get the point in the gust to start rendering
    var start = max(1, this.pts.length - this.visible_gust_length);
    if (this.remaining_propagations < this.visible_gust_length) {
      start = Math.floor(this.pts.length - 1 - this.remaining_propagations);
    }
    return start;
  }
}
