"use strict"

function disjoints(p1, p2) {
   return p1[0] != p2[0] || p1[1] != p2[1];
}

function notInCircle(p1, p2, p3, radius) {
   let diameter = radius * 2;

   return (distance(p1, p2) > diameter &&
	   distance(p1, p3) > diameter);
}

function inCircle(p1, p2, p3, radius) {
   let diameter = radius * 2;

   return (distance(p1, p2) <= diameter &&
	   distance(p1, p3) <= diameter);
}

function validAngle(p1, c, p2, epsilon) {
   if (!disjoints(p1, c) || !disjoints(c, p1))
      	 return false;

      let c1 = distance(c, p1);
      let c2 = distance(c, p2);
      let d1to2 = distance(p1, p2);
      let angle = Math.acos((c1 * c1 + c2 * c2 - d1to2 * d1to2) /
			    (2 * c1 * c2));

      return (angle < (Math.PI - epsilon) ||
	      angle > (Math.PI + epsilon))
}

function heron(p1, p2, p3) {
   // Heron's formula
   let a = distance(p1, p2);
   let b = distance(p2, p3);
   let c = distance(p1, p3);
   let sp = (a + b + c) / 2;

   return Math.sqrt(sp * (sp - a) * (sp - b) * (sp - c));
}

function distance(p1, p2) {
   return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
}

function consecutive(pts, callback) {
   return consecutiveArray(pts, callback.length, callback, true);
}

function consecutiveArray(pts, n, callback, apply/*=false*/) {
   for (let i = 0; i < pts.length; i++) {
      let args = [];

      if (i + n - 1 >= pts.length)
	 break;

      for (let j = 0; j < n; j++)
	 args[j] = pts[i + j];

      if (apply ? callback.apply(null, args) : callback.call(null, args))
	 return true;
   }
   return false;
}

function lic0(len, pts) {
   if (len < 0)
      return false;

   return consecutive(pts, (p1, p2) => distance(p1, p2) > len);
}

function lic1(radius, pts) {
   if (radius < 0)
      return false;

   return consecutive(pts, function(p1, p2, p3) {
      return notInCircle(p1, p2, p3, radius);
   });
}

function lic2(epsilon, pts) {
   if (epsilon < 0 || epsilon >= Math.PI)
      return false;

   return consecutive(pts, function(p1, c, p2) {
      return validAngle(p1, c, p2, epsilon);
   });
}

function lic3(area, pts) {
   if (area < 0)
      return false;

   return consecutive(pts, function(p1, p2, p3) {
      return heron(p1, p2, p3) > area;
   });
}

function lic4(qpts, quads, pts) {
   if (qpts < 2 || quads < 1 || quads > 3)
      return false;

   return consecutiveArray(pts, qpts, function(args) {
      let quad1 = false;
      let quad2 = false;
      let quad3 = false;
      let quad4 = false;
      let sum = 0;

      for (let i in args) {
	 let x = args[i][0];
	 let y = args[i][1];

	 if (x >= 0 && y >= 0)
	    quad1 = true;
	 else if (x < 0 && y >= 0)
	    quad2 = true;
	 else if (x >= 0 && y < 0)
	    quad3 = true;
	 else if (x < 0 && y < 0)
	    quad4 = true;
      }

      if (quad1)
	 sum++;
      if (quad2)
	 sum++;
      if (quad3)
	 sum++;
      if (quad4)
	 sum++

      return sum > quads;
   });
}

function lic5(pts) {
   return consecutive(pts, function(p1, p2) {
      return p2[0] - p1[0];
   });
}

function lic6(npts, dist, pts) {
   if (npts < 3 || dist < 0)
      return false;

   return consecutiveArray(pts, npts, function(args) {
      let firstPt = args[0];
      let lastPt = args[args.length - 1];

      if (args.length < 3)
	 return false;

      if (!disjoints(firstPt, lastPt)) {
	 for (let i = 1; i < args.length - 1; i++)
	    if (distance(args[i], firstPt) > dist)
	       return true;
      } else {
	 let a = lastPt[1] - firstPt[1]
	 let b = -(lastPt[0] - firstPt[0]);
	 let c = -(a * lastPt[0] + b * lastPt[1]);

	 let aPow = a * a;
	 let bPow = b * b;

	 for (let i = 1; i < args.length - 1; i++) {
	    let pt = args[i];

	    if ((Math.abs(pt[0] + pt[1] + c) / Math.sqrt(aPow + bPow)) > dist)
	       return true;
	 }
      }
   });
}

function lic7(kpts, len, pts) {
   if (kpts < 1)
      return false;

   return consecutiveArray(pts, kpts + 2, function(args) {
      return distance(args[0], args[args.length - 1]) > len;
   })
}

function lic8(apts, bpts, radius, pts) {
   if (apts < 1 || bpts < 1)
      return false;

   return consecutiveArray(pts, apts + bpts + 3, function(args) {
      let p1 = args[0];
      let p2 = args[apts + 1];
      let p3 = args[args.length - 1];

      return notInCircle(p1, p2, p3, radius);
   });
}

function lic9(cpts, dpts, epsilon, pts) {
   if (cpts < 1 || dpts < 1)
      return false;

   return consecutiveArray(pts, cpts + dpts + 3, function(args) {
      let p1 = args[0];
      let c = args[cpts + 1];
      let p2 = args[args.length - 1];

      return validAngle(p1, c, p2, epsilon);
   });
}

function lic10(epts, fpts, area, pts) {
   if (epts < 1 || fpts < 1 || area < 0)
      return false;

   return consecutiveArray(pts, epts + fpts + 3, function(args) {
      let p1 = args[0];
      let p2 = args[epts + 1];
      let p3 = args[args.length - 1];

      return heron(p1, p2, p3) > area;
   });
}

function lic11(gpts, pts) {
   if (gpts < 1)
      return false;

   return consecutiveArray(pts, gpts + 2, function(args) {
      return args[args.length - 1][0] - args[0][0] < 0;
   });
}

function lic12(kpts, len1, len2, pts) {
   if (kpts < 1 || len1 < 0 || len2 < 0)
      return false;

   return consecutiveArray(pts, kpts + 2, function(args) {
      let p1 = args[0];
      let p2 = args[args.length - 1];
      let d = distance(p1, p2);

      return d > len1 && d < len2;
   });
}

function lic13(apts, bpts, radius1, radius2, pts) {
   if (apts < 1 || bpts < 1 || radius1 < 0 || radius2 < 0)
      return false;

   return consecutiveArray(pts, apts + bpts + 3, function(args) {
      let p1 = args[0];
      let p2 = args[apts + 1];
      let p3 = args[args.length - 1];

      return notInCircle(p1, p2, p3, radius1) && inCircle(p1, p2, p3, radius2);
   });
}

function lic14(epts, fpts, area1, area2, pts) {
   if (epts < 1 || fpts < 1 || area1 < 0 || area2 < 0)
      return false;

   return consecutiveArray(pts, epts + fpts + 3, function(args) {
      let p1 = args[0];
      let p2 = args[epts + 1];
      let p3 = args[args.length - 1];
      let area = heron(p1, p2, p3);

      return area > area1 && area < area2;
   });
}

function lic(params, pts) {
   return (lic0(params.LENGTH1, pts) &&
	   lic1(params.RADIUS1, pts) &&
	   lic2(params.EPSILON, pts) &&
	   lic3(params.AREA1, pts) &&
	   lic4(params.Q_PTS, params.QUADS, pts) &&
	   lic5(pts) &&
	   lic6(params.N_PTS, params.DIST, pts) &&
	   lic7(params.K_PTS, params.LENGTH1, pts) &&
	   lic8(params.A_PTS, params.B_PTS, params.RADIUS1, pts) &&
	   lic9(params.C_PTS, params.D_PTS, params.EPSILON, pts) &&
	   lic10(params.E_PTS, params.F_PTS, params.AREA1, pts) &&
	   lic11(params.G_PTS, pts) &&
	   lic12(params.K_PTS, params.LENGTH1, params.LENGTH2, pts) &&
	   lic13(params.A_PTS, params.B_PTS, params.RADIUS1, params.RADIUS2,
		 pts) &&
	   lic14(params.E_PTS, params.F_PTS, params.AREA1, params.AREA2, pts));
}

function decide(input) {
   var params = input.PARAMETERS;
   var pts = input.points;
   var cmv = [];
   var pum = [];
   var fuv = [];

   cmv[0] = lic0(params.LENGTH1, pts);
   cmv[1] = lic1(params.RADIUS1, pts);
   cmv[2] = lic2(params.EPSILON, pts);
   cmv[3] = lic3(params.AREA1, pts);
   cmv[4] = lic4(params.Q_PTS, params.QUADS, pts);
   cmv[5] = lic5(pts);
   cmv[6] = lic6(params.N_PTS, params.DIST, pts);
   cmv[7] = lic7(params.K_PTS, params.LENGTH1, pts);
   cmv[8] = lic8(params.A_PTS, params.B_PTS, params.RADIUS1, pts);
   cmv[9] = lic9(params.C_PTS, params.D_PTS, params.EPSILON, pts);
   cmv[10] = lic10(params.E_PTS, params.F_PTS, params.AREA1, pts);
   cmv[11] = lic11(params.G_PTS, pts);
   cmv[12] = lic12(params.K_PTS, params.LENGTH1, params.LENGTH2, pts);
   cmv[13] = lic13(params.A_PTS, params.B_PTS, params.RADIUS1, params.RADIUS2,
		   pts);
   cmv[14] = lic14(params.E_PTS, params.F_PTS, params.AREA1, params.AREA2, pts);

   for (let i = 0; i < 15; i++) {
      pum[i] = [];
      for (let j = 0; j < 15; j++) {
	 switch (input.LCM[i][j]) {
	 case "ANDD":
	    pum[i][j] = cmv[i] && cmv[j];
	    break;
	 case "ORR":
	    pum[i][j] = cmv[i] || cmv[j];
	    break;
	  default:
	    pum[i][j] = true;
	 }
      }

      fuv[i] = !input.PUV[i];
      if (input.PUV[i]) {
      	 fuv[i] = true;
      	 for (let j = 0; j < 15; j++)
      	    if (!pum[i][j]) {
      	       fuv[i] = false;
      	       break;
      	    }
      }
   }

   for (let i = 0; i < 15; i++)
      if (!fuv[i])
	 return false;

   return true;
}

exports.decide = decide;
