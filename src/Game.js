import React from 'react';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 80;
const REPEAT_DISTANCE = 80;
const MIN_PIPE_HEIGHT = 50;
const FPS = 120;

class Bird{
    constructor(ctx) {
        this.ctx = ctx;
        this.x = 200;
        this.y = 250;
        this.gravity = 0;
        this.velocity = 0.1;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'green';                     
        this.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);        
        this.ctx.fill();
    }

    update = () => {
        // this.velocity += this.gravity;
        // if (this.velocity > 1) {
        //     this.velocity = 1;   
        // }
        this.gravity += this.velocity;
        this.gravity = Math.min(4, this.gravity);
        this.y += this.gravity;

    }

    jump = () => {
        this.gravity = -4;
    }
}

class Pipe{
    constructor(ctx, height, space) {
        this.ctx = ctx;

        this.space = space;
        this.x = WIDTH;
        this.y = height ? HEIGHT - height : 0;
        this.width = PIPE_WIDTH;
        this.height = height || MIN_PIPE_HEIGHT + Math.floor(Math.random() * (HEIGHT - space - MIN_PIPE_HEIGHT * 2));
    }

    draw() {
        this.ctx.fillStyle = '#000';              
        this.ctx.fillRect(this.x, this.y, this.width, this.height);        
    }

    update() {
        this.x -= 1.2;

        if ((this.x + PIPE_WIDTH) < 0) {
            this.isDead = true;
        }
    }
}


class Game extends React.Component{

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.space = 120;
        this.frameCount = 0;
        this.birds = [];
        this.gameEnd = false; 
    }

    componentDidMount() {    
        document.addEventListener('keydown', this.onKeyDown);
        this.pipes = this.genaratePipes();

        setInterval(() => {
            this.gameLoop();
        }, 1000 / FPS);
        
        var ctx = this.canvasRef.current.getContext("2d");
        this.birds = [new Bird(ctx)];
       
    }

    onKeyDown = (e) => {
        if (e.keyCode == 32)
        {
            console.log('space');
            this.birds[0].jump();
        }
    }

    genaratePipes = () => {
        var ctx = this.canvasRef.current.getContext("2d");

        const firstPipe = new Pipe(ctx, null, this.space);
        const secondPipeHeigth = HEIGHT - firstPipe.height - this.space; 
        const secondPipe = new Pipe(ctx, secondPipeHeigth , this.space);

        return [firstPipe,secondPipe];
    }

    gameLoop() {   
        console.log("his.gameLoop");
        this.update(); 
        this.draw();
    }

    update() {
        this.frameCount = this.frameCount + 1;

        if (this.frameCount % 320 === 0) {
            const pipes = this.genaratePipes();
            this.pipes.push(...pipes);
        }

        this.pipes.forEach(pipe => pipe.update());
        this.pipes = this.pipes.filter(x => !x.isDead);  
        
        this.birds.forEach(bird => bird.update());
        if (this.gameEnd || this.isGameOver() === true) {
            alert("Game Over");
            clearInterval(this, this.gameLoop);
            this.gameEnd = true;
        }
    }

    draw() {
        var ctx = this.canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.pipes.forEach(pipe => pipe.draw());

        this.birds.forEach(bird => bird.draw());
    }

    isGameOver = () => {
        let gameoOver = false;
        this.birds.forEach(bird => {
            this.pipes.forEach(pipe => {
               
                if (
                    bird.y < 0 || bird.y > HEIGHT || (
                    bird.x > pipe.x && bird.x < pipe.x + pipe.width
                    && bird.y > pipe.y && bird.y < pipe.y + pipe.height)) {
                    gameoOver = true;
                }
            });
        });
        return gameoOver;
    }

    render() {
        return (
            <div className="App">
                <canvas
                    ref={this.canvasRef}
                    width={WIDTH}
                    height={HEIGHT}
                    style={{ border: '1px solid #d3d3d3' }}
                >
                </canvas>
            </div>
        );
    }
}

export default Game;