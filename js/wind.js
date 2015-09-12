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

  curl: 0,
  curl_frequency: 5,
  previous_angle: 0,
  curl_amplitude: 1,
  propagation_length: 1,

  total_angle: 0,

  starting_angles: [0, pi],
  starting_angles: [0],

  visible_gust_length: 6,

  bezier_control_fraction: 0.18,
  bezier_controls: {},

  reset: function() {
  },

  tick: function() {
    // `todo: modulate speed?
    this.propagation_frames += 1;
    if (this.propagation_frames % this.slowness !== 0) { return; }

    if (this.remaining_propagations > 0 && this.pts.length > 0) {
      // redo the curl every few frames

      // `crunch
      var min_curl = (this.total_angle < this.angle_window[0] || this.last().y < this.height_window[0]) ? 0 : -this.curl_amplitude;
      var max_curl = (this.total_angle > this.angle_window[1] || this.last().y > this.height_window[1]) ? 0 : this.curl_amplitude;
      if ((gameplay_frame * this.slowness) % this.curl_frequency === 0) {
        this.curl = rnds(min_curl, max_curl);
      }
      else if (this.last().y < this.height_window[0]) {
        this.curl = rnds(min_curl, 0);
      }
      else if (this.last().y > this.height_window[1]) {
        this.curl = rnds(0, max_curl);
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

    /// `temp control points

    // draw.c(windlayer.ctx, this.bezier_controls[2][1], 0.2, draw.shapeStyle('blue'));
    // for (var i in this.bezier_controls) {
    //   var color = (i % 2 === 0) ? 'red' : 'orange';
    //   draw.c(windlayer.ctx, this.bezier_controls[i][0], 0.1, draw.shapeStyle(color));
    //   draw.c(windlayer.ctx, this.bezier_controls[i][1], 0.1, draw.shapeStyle(color));
    // }
    // this.pts.forEach(function(pt) {
    //   draw.c(windlayer.ctx, pt, 0.1, draw.shapeStyle('green'));
    // })
    
    ///////////


    var colordata = [
      // color, linewidth, alpha
      ['#ddd', 0.3, 0.05],
      // ['#eee', 0.8, 0.05],
      // ['#eee', 0.6, 0.05],
      // ['#eee', 0.5, 0.05],
      // ['#eee', 0.4, 0.05],
      // ['#eee', 0.3, 0.05],
      // ['#eee', 0.2, 0.05],
      ['#fff', 0.1, 0.05]
    ];
    var pts = this.pts;
    var controls = this.bezier_controls;
    colordata.forEach(function(data) {
      draw.do(windlayer.ctx, draw.lineStyle(data[0], {lineWidth: data[1], globalAlpha: data[2], lineCap:'round'}), function() {
        var start = max(1, pts.length - wind.visible_gust_length);
        if (wind.remaining_propagations < wind.visible_gust_length) {
          start = Math.floor(pts.length - 1 - wind.remaining_propagations);
        }
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

  startGust: function(origin) {
    // Random walk in a general direction (rightwards, for now - `temp)
    this.pts = [origin];
    this.bezier_controls = {};
    this.curl = 0;
    this.remaining_propagations = rnds.apply(null, this.num_propagations);
    this.previous_angle = rnd_choice(this.starting_angles);
    this.total_angle = 0;
    this.propagation_frames = -1;
  }
}
