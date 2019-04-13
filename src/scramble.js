function two() {
  let total = Math.floor(Math.random()*2) + 9;
  var key = ['U', 'R','F', 'U\'', 'R\'', 'F\'', 'U2', 'R2', 'F2'];
  let last = .5;
  var i = 0;
  var x;
  let solution = "";
  for (i = 0; i < total; i++) {
    x = Math.floor(Math.random()*9);
    if (x % 3 === last % 3) {
      if (x !== 0) {
        x--;
      } else {
        x++;
      }
    }
    last = x;
    solution += (key[x] + ' ');
  }
  return solution
}

function three() {
  let total = Math.floor(Math.random()*4) + 23;
  var key = ['U', 'B', 'R', 'D', 'F', 'L', 'U\'', 'B\'', 'R\'', 'D\'',
            'F\'', 'L\'', 'U2', 'B2', 'R2', 'D2', 'F2', 'L2'];
  let last = .5;
  let morelast = .5;
  var i = 0;
  var x;
  let solution = "";
  for (i = 0; i < total; i++) {
    x = Math.floor(Math.random()*18);
    if (x % 6 === last % 6 || (x % 6 === morelast % 6 && x % 3 === last % 3)) {
      if (x !== 0) {
        x--;
      } else {
        x++;
      }
    }
    morelast = last;
    last = x;
    solution += (key[x] + ' ');
  }
  return solution
}

function four() {
  let total = Math.floor(Math.random()*6) + 37;
  var key = ['U', 'B', 'R', 'D', 'F', 'L', 'U\'', 'B\'', 'R\'', 'D\'',
            'F\'', 'L\'', 'U2', 'B2', 'R2', 'D2', 'F2', 'L2',
            'Rw', 'Uw', 'Fw', 'Rw\'', 'Uw\'', 'Fw\'', 'Rw2', 'Uw2', 'Fw2'];
  let last = .5;
  let morelast = .5;
  var i = 0;
  var x;
  let solution = "";
  for (i = 0; i < total; i++) {
    x = Math.floor(Math.random()*27);
    if ((x % 6 === last % 6 && x < 18 && last < 18) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3 && x < 18 && last < 18) ||
        (x >= 18 && last >= 18 && x % 3 === last % 3)
    ){
      if (x !== 0) {
        x--;
      } else {
        x++;
      }
    }
    morelast = last;
    last = x;
    solution += (key[x] + ' ');
  }
  return solution
}

function five() {
  let total = 60  ;
  var key = ['U', 'B', 'R', 'D', 'F', 'L', 'U\'', 'B\'', 'R\'', 'D\'',
            'F\'', 'L\'', 'U2', 'B2', 'R2', 'D2', 'F2', 'L2',
            'Uw', 'Bw', 'Rw', 'Dw', 'Fw', 'Lw', 'Uw\'', 'Bw\'',
            'Rw\'', 'Dw\'', 'Fw\'', 'Lw\'', 'Uw2', 'Bw2', 'Rw2',
            'Dw2', 'Fw2', 'Lw2'];
  let last = .5;
  let morelast = .5;
  var i = 0;
  var x;
  let solution = "";
  for (i = 0; i < total; i++) {
    x = Math.floor(Math.random()*36);
    if ((x < 18 && last < 18 &&(x % 6 === last % 6) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3)) ||
        (x >= 18 && last >= 18 && (x % 6 === last % 6) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3))
    ){
      if (x !== 0) {
        x--;
      } else {
        x++;
      }
    }
    morelast = last;
    last = x;
    solution += (key[x] + ' ');
  }
  return solution
}

function six() {
  let total = 80;
  var key = ['U', 'B', 'R', 'D', 'F', 'L', 'U\'', 'B\'', 'R\'', 'D\'',
            'F\'', 'L\'', 'U2', 'B2', 'R2', 'D2', 'F2', 'L2',
            'Uw', 'Bw', 'Rw', 'Dw', 'Fw', 'Lw', 'Uw\'', 'Bw\'',
            'Rw\'', 'Dw\'', 'Fw\'', 'Lw\'', 'Uw2', 'Bw2', 'Rw2',
            'Dw2', 'Fw2', 'Lw2', '3Rw', '3Uw', '3Fw', '3Rw\'', '3Uw\'',
            '3Fw\'', '3Rw2', '3Uw2', '3Fw2'];
  let last = .5;
  let morelast = .5;
  var i = 0;
  var x;
  let solution = "";
  for (i = 0; i < total; i++) {
    x = Math.floor(Math.random()*45);
    if ((x < 18 && last < 18 &&(x % 6 === last % 6) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3)) ||
        (x >= 18 && last >= 18 && x < 36 && last < 36 && (x % 6 === last % 6) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3)) ||
        (x > 36 && last > 36 && x % 3 === last % 3)
    ){
      if (x !== 0) {
        x--;
      } else {
        x++;
      }
    }
    morelast = last;
    last = x;
    solution += (key[x] + '  ');
  }
  return solution
}

function seven() {
  let total = 100;
  var key = ['U', 'B', 'R', 'D', 'F', 'L', 'U\'', 'B\'', 'R\'', 'D\'',
            'F\'', 'L\'', 'U2', 'B2', 'R2', 'D2', 'F2', 'L2',
            'Uw', 'Bw', 'Rw', 'Dw', 'Fw', 'Lw', 'Uw\'', 'Bw\'',
            'Rw\'', 'Dw\'', 'Fw\'', 'Lw\'', 'Uw2', 'Bw2', 'Rw2',
            'Dw2', 'Fw2', 'Lw2', '3Uw', '3Bw', '3Rw', '3Dw', '3Fw', '3Lw',
            '3Uw\'', '3Bw\'', '3Rw\'', '3Dw\'', '3Fw\'', '3Lw\'',
            '3Uw2', '3Bw2', '3Rw2', '3Dw2', '3Fw2', '3Lw2'];
  let last = .5;
  let morelast = .5;
  var i = 0;
  var x;
  let solution = "";
  for (i = 0; i < total; i++) {
    x = Math.floor(Math.random()*54);
    if ((x < 18 && last < 18 &&(x % 6 === last % 6) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3)) ||
        (x >= 18 && last >= 18 && x < 36 && last < 36 && (x % 6 === last % 6) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3)) ||
        (x > 36 && last > 36 && (x % 3 === last % 3) ||
        (x % 6 === morelast % 6 && x % 3 === last % 3))
    ){
      if (x !== 0) {
        x--;
      } else {
        x++;
      }
    }
    morelast = last;
    last = x;
    solution += (key[x] + '  ');
  }
  return solution
}

export {
  two,
  three,
  four,
  five,
  six,
  seven,
};
