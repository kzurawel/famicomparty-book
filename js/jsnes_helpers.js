class Canvas {
  constructor (canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, 256, 240);

    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, 256, 240);

    this.buf = new ArrayBuffer(this.imageData.data.length);
    this.buf8 = new Uint8ClampedArray(this.buf);
    this.buf32 = new Uint32Array(this.buf);

    for (let i = 0; i < this.buf32.length; ++i) {
      this.buf32[i] = 0xff000000;
    }
  }

  convertNESBuffer (buffer) {
    var i = 0;
    for (var y = 0; y < 240; ++y) {
      for (var x = 0; x < 256; ++x) {
        i = y * 256 + x;
        this.buf32[i] = 0xff000000 | buffer[i];
      }
    }
  }

  writeBuffer () {
    this.imageData.data.set(this.buf8);
    this.context.putImageData(this.imageData, 0, 0);
  }
}

function fetchAndRunROM (romPath, nes, callback) {
  let romData;
  const reader = new FileReader();
  reader.onload = (event) => {
    romData = event.target.result;
    nes.loadROM(romData);
    callback(nes);
  };

  const req = new XMLHttpRequest();
  req.open('GET', romPath, true);
  req.responseType = 'blob';
  req.onload = (event) => {
    reader.readAsBinaryString(req.response);
  };
  req.send(null);
}

function createFrameHandler (nes) {
  const handler = () => {
    nes.frame();
    requestAnimationFrame(handler);
  };
  handler();
}

