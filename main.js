const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.height = field.length;
    this.width = field[0].length;
    this.playerRow = 0;
    this.playerCol = 0;
    this.gameOver = false;
  }

  print() {
    console.log('\x1Bc');
    this.field.forEach(row => {
      console.log(row.join(''));
    });
  }

  move(direction) {
    switch (direction) {
      case 'U':
        this.playerRow -= 1;
        break;
      case 'D':
        this.playerRow += 1;
        break;
      case 'L':
        this.playerCol -= 1;
        break;
      case 'R':
        this.playerCol += 1;
        break;
      default:
        console.log('Invalid direction. Please enter U, D, L, or R.');
        break;
    }

    this.checkGameStatus();
    if (!this.gameOver) {
      this.updateField();
      this.print();
      this.promptNextMove();
    }
  }

  checkGameStatus() {
    const cell = this.field[this.playerRow][this.playerCol];

    if (cell === hat) {
      console.log('Congratulations! You found the hat! You win!');
      this.gameOver = true;
    } else if (cell === hole) {
      console.log('Oops! You fell into a hole. Game over!');
      this.gameOver = true;
    } else if (
      this.playerRow < 0 ||
      this.playerRow >= this.height ||
      this.playerCol < 0 ||
      this.playerCol >= this.width
    ) {
      console.log('You moved outside the field. Game over!');
      this.gameOver = true;
    }
  }

  updateField() {
    this.field[this.playerRow][this.playerCol] = pathCharacter;
  }

  promptNextMove() {
    const direction = prompt('Enter your next move (U, D, L, R): ').toUpperCase();
    this.move(direction);
  }

  static generateField(height, width, percentageHoles) {
    const field = [];
    const totalCells = height * width;
    const numHoles = Math.floor((percentageHoles / 100) * totalCells);

    // Initialize the field with background characters
    for (let i = 0; i < height; i++) {
      field.push(Array(width).fill(fieldCharacter));
    }

    // Randomly place the hat
    const hatRow = Math.floor(Math.random() * height);
    const hatCol = Math.floor(Math.random() * width);
    field[hatRow][hatCol] = hat;

    // Randomly place holes
    for (let i = 0; i < numHoles; i++) {
      let holeRow, holeCol;
      do {
        holeRow = Math.floor(Math.random() * height);
        holeCol = Math.floor(Math.random() * width);
      } while (field[holeRow][holeCol] !== fieldCharacter); // Ensure the cell is empty
      field[holeRow][holeCol] = hole;
    }

    return field;
  }
}

// Example usage:
const generatedField = Field.generateField(5, 5, 20);
const myField = new Field(generatedField);

myField.print();
myField.promptNextMove();
