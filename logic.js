// To check the added code to fix the bugs the game, you may search the [BUG FIXED] keyword.

let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
let startX = 0;
let startY = 0;

function setGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // console.table(board)

	for(let r=0; r < rows; r++){
	    for(let c=0; c < columns; c++){
	       
	        let tile = document.createElement("div");
	                
	        tile.id = r.toString() + "-" + c.toString(); 
	     
	        let num = board[r][c];
	               
	        updateTile(tile, num); 
	        
	        document.getElementById("board").append(tile); 


	    }
	}

    setTwo();
    setTwo();
}

function updateTile(tile, num){

    tile.innerText = ""; 
    
    tile.classList.value = ""; 
   
    tile.classList.add("tile");

    if(num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}


window.onload = function() {
    setGame();
}

function handleSlide(e) {
	// console.log(e.code)
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        
        e.preventDefault(); 
        // [BUG FIXED] Added the canMove...() functions to fixed bugs related to random tile showing upon tile slide. 
        if (e.code == "ArrowLeft" && canMoveLeft()) {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight" && canMoveRight()) {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp" && canMoveUp()) {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown" && canMoveDown()) {
            slideDown();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;     // Update score

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
}

// When any key is pressed, the handleSlide function is called to handle the key press.
document.addEventListener("keydown", handleSlide);

function filterZero(row){
    
    return row.filter(num => num != 0) ;
}

// Core function for sliding and merging tiles in a row.
function slide(row){

    row = filterZero(row);

    for(let i = 0; i < row.length - 1; i++){
        if(row[i] == row[i+1]){  
            row[i] *= 2;       
            row[i+1] = 0;
            score += row[i]; 
        }       
    }

    row = filterZero(row);

    while(row.length < columns){
        row.push(0);
    }
    // console.log(row);
    return row;
}

function slideLeft(){
    console.log("slide left");
    for(let r = 0; r < rows; r++){
        let row = board[r];

        // This line for animation
        // 
        let originalRow = row.slice(); // store the array in a new variable

        row = slide(row);
        board[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Line for animation 
            if (originalRow[c] !== num && num !== 0) {  // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-right 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num)
        }
        
    }
}

function slideRight() {
    console.log("slide right");
    for(let r = 0; r < rows; r++){
        let row = board[r]

        // original is for animation
        let originalRow = row.slice();

        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {   // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-left 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

function slideUp(){
    console.log("slide up");
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // For animation
        let originalRow = row.slice();

        row = slide(row);

        // Check which tiles have changed in this column
        // This will record the current position of tiles that have change. 
        let changedIndices = [];
        for (let r = 0; r < rows; r++) { 
            if (originalRow[r] !== row[r]) {
                /* 
                originalRow = [2, 0, 2, 0]
                row = [4, 0, 0, 0]

                1st iteration: 2 !== 4 (True) changeIndices = [0]
                2nd iteration: 0 !== 0 (False)
                3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
                4th iteration: 0 !== 0 (False)
                */
                changedIndices.push(r);
            }
        }

        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Animation - Add sliding effect by animating the movement of the tile
            if (changedIndices.includes(r) && num !== 0) {
                /* changeIndices [0, 2]
                1st iteration: 0 is in changeIndices, board[0][0] !==0 (True)(Apply slide-from-bottom Animation to the current tile)
                2nd iteration: 1 is not changeIndices, board[1][0]  (False)
                3rd iteration: 2 is in changeIndices, but board[2][0] !== 0 (False)
                4th iteration: 3 is not changeIndices, board[3][0] (False)
                */
                tile.style.animation = "slide-from-bottom 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

function slideDown(){
    console.log("slide down");
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]]

        // Animation
        let originalRow = row.slice();

        row.reverse();   
        row = slide(row); 
        row.reverse();
        
        // Check which tiles have changed in this column
        let changedIndices = [];
        for (let r = 0; r < rows; r++) {
                /* 
                originalRow = [2, 0, 2, 0]
                row = [0, 0, 0, 4]

                1st iteration: 2 !== 0 (True) changeIndices = [0]
                2nd iteration: 0 !== 0 (False)
                3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
                4th iteration: 0 !== 4 (True) changeIndices = [0, 2, 3]
                */

            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }   // [0, 2, 3]

        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Animation - Add sliding effect by animating the movement of the tile
            if (changedIndices.includes(r) && num !== 0) {
                /*  changeIndices [0, 2, 3]
                    1st iteration: 0 is in changeIndices, board[0][0] !==0 (False)
                    2nd iteration: 1 is not changeIndices, board[1][0] (False)
                    3rd iteration: 2 is in changeIndices, but board[2][0] !== 0 (False)
                    4th iteration: 3 is in changeIndices, board[3][0] !== 0 (True) (Apply slide-from-top animation to the current tile)
                */

                tile.style.animation = "slide-from-top 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true
            }
        }
    }
    return false;
}

function setTwo(){
    if(!hasEmptyTile()){
        return;
    }

    let found = false;

    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            tile.style.animation = "zoom-tile 0.5s";
            // Remove the animation class after the animation is complete
            setTimeout(() => {
                tile.style.animation = "";
            }, 500);
            found = true;
        }
    }
}

// [BUG FIXED] Added the canMove...() functions to fixed bugs related to random tile showing upon tile slide. 

// Check if there are available merging moves in the left direction
function canMoveLeft() {
    // It goes through each row of the grid, one by one (a row is like a horizontal line in the grid).
    for (let r = 0; r < rows; r++) {
        // For each row, it starts from the second column (position) because moving to the left means it's checking if the number can slide to the left.
        for (let c = 1; c < columns; c++) {
            console.log(`${r} - ${c}`);
            // This line checks if the current position on the grid (board[r][c]) has a number in it (not empty). If there's a number there, it means the function is looking at a tile that needs to be checked for moving left.
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position to the left of the current tile is empty (0).
                    // It also checks if the number to the left is the same as the current number.
                if (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
                    // If the conditions are met (you can move a tile to the left), the function immediately says, "Yes, you can move left in this row!" and stops checking.
                    return true;
                }
            }
        }
    }
    return false;
}

// Check if there are available merging moves in the right direction
function canMoveRight() {
    for (let r = 0; r < rows; r++) {
        //  This loop starts from the second-to-last column and goes backwards because moving to the right means checking the number's interaction with the one to its right.
        for (let c = columns - 2; c >= 0; c--) {
            console.log(`${r} - ${c}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position to the right of the current tile is empty (0).
                    // It also checks if the number to the right is the same as the current number.
                if (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

 // Check if there are available merging moves in the upward direction
function canMoveUp() {
    // This line starts a loop that goes through each column in the game grid. A column is like a vertical line in the grid, and this loop checks one column at a time.
    for (let c = 0; c < columns; c++) {
        // This loop starts from the second row because moving upward means checking the number's interaction with the one above it.
        for (let r = 1; r < rows; r++) {
            console.log(`${c} - ${r}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position above the current tile is empty (0).
                    // It also checks if the number above is the same as the current number.
                if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Check if there are available merging moves in the downward direction
function canMoveDown() {
    for (let c = 0; c < columns; c++) {
        // This loop starts from the second-to-last row and goes backward because moving downward means checking the number's interaction with the one below it.
        for (let r = rows - 2; r >= 0; r--) {
            console.log(`${c} - ${r}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position below the current tile is empty (0).
                    // It also checks if the number below is the same as the current number.
                if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right)
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }
    setTwo()    // new tile   
    score = 0;   
}

// document.addEventListener("click", (event) => {
//     console.log(event.target.id);

//     // Checks if the target of the click is the change-button
//     if(event.target.id != "change-button"){
//         console.log("running")
//         return
//     }

//     tile02 = document.getElementById("02")
//     tile04 = document.getElementById("04")
//     tile08 = document.getElementById("08")
//     tile16 = document.getElementById("16")
//     tile32 = document.getElementById("32")
//     tile64 = document.getElementById("64")
//     tile128 = document.getElementById("128")
//     tile256 = document.getElementById("256")
//     tile512 = document.getElementById("512")
//     tile1024 = document.getElementById("1024")
//     tile2048 = document.getElementById("2048")
//     tile4096 = document.getElementById("4096")
//     tile8192 = document.getElementById("8192")

//     if(tile02.value != ''){
//         console.log("tile02")
//         document.documentElement.style.setProperty("--background-image-url-02", "url('" + tile02.value + "')");
//     }
//     if(tile04.value != ''){
//         console.log("tile04")
//         document.documentElement.style.setProperty("--background-image-url-04", "url('" + tile04.value + "')");
//     }
//     if(tile08.value != ''){
//         console.log("tile08")
//         document.documentElement.style.setProperty("--background-image-url-08", "url('" + tile08.value + "')");
//     }
//     if(tile16.value != ''){
//         console.log("tile16")
//         document.documentElement.style.setProperty("--background-image-url-16", "url('" + tile16.value + "')");
//     }
//     if(tile32.value != ''){
//         console.log("tile32")
//         document.documentElement.style.setProperty("--background-image-url-32", "url('" + tile32.value + "')");
//     }
//     if(tile64.value != ''){
//         console.log("tile64")
//         document.documentElement.style.setProperty("--background-image-url-64", "url('" + tile64.value + "')");
//     }
//     if(tile128.value != ''){
//         console.log("tile128")
//         document.documentElement.style.setProperty("--background-image-url-128", "url('" + tile128.value + "')");
//     }
//     if(tile256.value != ''){
//         console.log("tile256")
//         document.documentElement.style.setProperty("--background-image-url-256", "url('" + tile256.value + "')");
//     }
//     if(tile512.value != ''){
//         console.log("tile512")
//         document.documentElement.style.setProperty("--background-image-url-512", "url('" + tile512.value + "')");
//     }
//     if(tile1024.value != ''){
//         console.log("tile1024")
//         document.documentElement.style.setProperty("--background-image-url-1024", "url('" + tile1024.value + "')");
//     }
//     if(tile2048.value != ''){
//         console.log("tile2048")
//         document.documentElement.style.setProperty("--background-image-url-2048", "url('" + tile2048.value + "')");
//     }
//     if(tile4096.value != ''){
//         console.log("tile4096")
//         document.documentElement.style.setProperty("--background-image-url-4096", "url('" + tile4096.value + "')");
//     }
//     if(tile8192.value != ''){
//         console.log("tile8192")
//         document.documentElement.style.setProperty("--background-image-url-8192", "url('" + tile8192.value + "')");
//     }
// })

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    console.log(startX);
    startY = e.touches[0].clientY;
    console.log(startY);
});


document.addEventListener('touchmove', (e) => {

    if(!e.target.className.includes("tile")){
        return
    }

    e.preventDefault(); // This line disables scrolling
}, { passive: false }); // Use passive: false to make preventDefault() work


document.addEventListener('touchend', (e) => {
    
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Define a threshold to distinguish between a tap and a swipe
    const threshold = 5; // Adjust this value as needed

    // If the difference is below the threshold, consider it a tap
    if (Math.abs(diffX) < threshold && Math.abs(diffX) < threshold) {
        // It's a tap, you can handle tap actions here
        // For example, display information about the tile, open a modal, etc.
        return;
    }

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // [BUG FIXED] Added the canMove...() functions to fixed bugs related to random tile showing upon tile slide. 
        // Horizontal swipe
        if (diffX > 0) {
            if(canMoveLeft()){
                slideLeft(); // Call a function for sliding left
                setTwo(); // Call a function named "setTwo"
            }
        } else {
            if(canMoveRight()){
                slideRight(); // Call a function for sliding right
                setTwo(); // Call a function named "setTwo"
            }
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            if(canMoveUp()){
                slideUp(); // Call a function for sliding up
                setTwo(); // Call a function named "setTwo"
            }
        } else {
            if(canMoveDown()){
                slideDown(); // Call a function for sliding down
                setTwo(); // Call a function named "setTwo"
            }
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
});