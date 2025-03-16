'use client';
import { useState, useEffect } from 'react';

let gameOverSound;
if (typeof window !== "undefined") {
  gameOverSound = new Audio('/sound/gameover.mp3');
}

function playEatSound() {
  if (typeof window !== "undefined") {
    const sound = new Audio('/sound/eat.mp3');
    sound.play();
  }
}

  

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const CONTROLS = [
  { key: 'w', x: 0, y: -1 },
  { key: 'a', x: -1, y: 0 },
  { key: 's', x: 0, y: 1 },
  { key: 'd', x: 1, y: 0 },
];
const INITIAL_SPEED = 150;
const SPEED_DECREMENT = 5;
const MIN_SPEED = 50;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(() => generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  useEffect(() => {
    const handleKeyDown = (e) => updateDirection(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;
    
    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        if (!prevSnake || prevSnake.length === 0) return INITIAL_SNAKE;
        return moveSnake(prevSnake);
      });
    }, speed);
    
    return () => clearInterval(gameLoop);
  }, [direction, isGameOver, speed]);

  useEffect(() => {
    if (!snake.length) return; 
    if (snake[0].x === food.x && snake[0].y === food.y) {
      setFood(generateFood(snake));
      setSpeed((prevSpeed) => Math.max(prevSpeed - SPEED_DECREMENT, MIN_SPEED));
      playEatSound();
    }
  }, [snake]);
  

  function updateDirection(key) {
    const control = CONTROLS.find((c) => c.key === key);
    if (control && (control.x !== -direction.x || control.y !== -direction.y)) {
      setDirection({ x: control.x, y: control.y });
    }
  }

  function moveSnake(prevSnake) {
    const newHead = {
      x: prevSnake[0].x + direction.x,
      y: prevSnake[0].y + direction.y,
    };

    const newSnake = [newHead, ...prevSnake];

    if (checkCollision(newHead, newSnake.slice(1))) {
      setIsGameOver(true);

      gameOverSound.play();

      return INITIAL_SNAKE; 
    }

    if (newHead.x !== food.x || newHead.y !== food.y) {
      newSnake.pop();
    }

    return newSnake;
  }

  function checkCollision(head, snakeBody) {
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GRID_SIZE ||
      head.y >= GRID_SIZE ||
      snakeBody.some((segment) => segment.x === head.x && segment.y === head.y)
    );
  }

  function generateFood(snake) {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }

  function restartGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setSpeed(INITIAL_SPEED);
  
    if (gameOverSound) {
      gameOverSound.currentTime = 0; 
    }
  }
  

  return (
    <div className="flex flex-col items-center gap-4 p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen">
      {isGameOver && <p className="text-red-500">Game Over! Press Restart.</p>}
      <div className="relative grid grid-cols-20 gap-0.5 border border-gray-300 bg-gray-900 dark:bg-gray-800 p-1 shadow-inner shadow-gray-700">
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isHead = snake.length && snake[0].x === x && snake[0].y === y;
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={index}
              className={`w-5 h-5 rounded-sm ${
                isHead ? 'bg-yellow-500' : isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-800 border border-gray-700'
              }`}
            ></div>
          );
        })}
      </div>
      <button 
        onClick={restartGame} 
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-blue-600">
        Restart
      </button>
      <div className="text-white text-lg">Speed: {speed}ms</div>
      <footer>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Created by{' '}
          <a
            href="www.bekzod1337.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            >
            Bekzod
            </a>
        </p>
      </footer>
    </div>
  );
}
