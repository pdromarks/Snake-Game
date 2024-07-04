const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio('../audios/audio.mp3')

const size = 30
const initialPosition = { x: 270, y: 240 }
let snake = [initialPosition]

const countScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) =>{
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () =>{
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number/30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}
 
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId
let speed = 300

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 25
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    snake.forEach((position, index) => {

        if (index === snake.length - 1){
            ctx.shadowColor = headColor;
            ctx.shadowBlur = 6;
            ctx.fillStyle = headColor;
        } else{
            ctx.fillStyle = "#f1f1f1"
            ctx.shadowBlur = 0;
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
    ctx.shadowBlur = 0;
    ctx.shadowColor = null;
}

const moveSnake = () =>{
    if(!direction) return

    const head = snake[snake.length - 1]

    if(direction == "right"){
        snake.push({ x: head.x + size, y: head.y })
    }
    if(direction == "left"){
        snake.push({ x: head.x - size, y: head.y })
    }
    if(direction == "down"){
        snake.push({ x: head.x, y: head.y + size })
    }
    if(direction == "up"){
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 0.5
    ctx.strokeStyle = "greenyellow"

    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()

    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y){
        countScore()
        snake.push(head)
        audio.play()

        if (speed > 50) {
            speed -= 10
        }

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()

        clearInterval(loopId)
        gameLoop()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        gameOver()
    }
} 

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    canvas.style.filter = "blur(2px)"
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';

    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
let headColor = "#f1f1f1"
const changeHeadColor = () =>{
    headColor = getRandomColor();
};
setInterval(() => {
    changeHeadColor();
    drawSnake();
}, 250)

gameLoop()
document.addEventListener("keydown", ({key}) => {
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }    
    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }    
    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }    
    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }    
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]

    speed = 300
    gameLoop()
})