class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10; // 何フレームごとにアニメするか（数字小さいと速くなる）
    this.sprites = sprites;
    this.moving = false; // 最初は止まってる
  }

  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frames.max),
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );

    if (!this.moving) return;

    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.frames.max - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }
}
