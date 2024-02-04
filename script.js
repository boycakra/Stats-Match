document.addEventListener("DOMContentLoaded", function () {
    let marking = false;
    let currentPlayer = "";
    let currentMove = "";
    let currentFormattedTime = "";
    let markingCircleClass = "";
    const addedCircles = [];
    const player1Marks = [];
    const player2Marks = [];
    const video = document.querySelector("#video-container video");
    const skipBackwardButton = document.getElementById("skip-backward");
    const skipForwardButton = document.getElementById("skip-forward");
    const imageDiv = document.querySelector("#image-container #image1");
    const imageDiv2 = document.querySelector("#image-container #image2");

    const coordinateDisplays = {
        Player: document.getElementById("coordinate-display"),
        Player2: document.getElementById("coordinate-display_player2"),
    };

    const valueDisplays = {
        Player: document.getElementById("value-display"),
        Player2: document.getElementById("value-display_player2"),
    };

    function updateTimer(video) {
        const minutes = Math.floor(video.currentTime / 60);
        const seconds = Math.floor(video.currentTime % 60);
        const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        timerDisplay.textContent = formattedTime;
        currentFormattedTime = formattedTime;
    }

    const timerDisplay = document.getElementById("timer-display");

    function printMousePos(event, element, relativeX, relativeY) {
        const circle = document.createElement("div");
        const imgWidth = element.offsetWidth;
        const imgHeight = element.offsetHeight;
        const percentageX = (relativeX / imgWidth) * 100;
        const percentageY = (relativeY / imgHeight) * 100;

        circle.style.left = `${event.clientX + window.scrollX - 5}px`;
        circle.style.top = `${event.clientY + window.scrollY - 5}px`;
        circle.style.position = "absolute";
        circle.style.zIndex = 10;
        circle.style.width = "16px";
        circle.style.height = "16px";
        circle.style.borderRadius = "50%";
        circle.classList.add(markingCircleClass);

        document.body.appendChild(circle);
        addedCircles.push(circle);

        return `(${percentageX.toFixed(2)}%, ${percentageY.toFixed(2)}%)`;
    }

    function boxingMoveHandler(player, move) {
        return function () {
            marking = true;
            currentPlayer = player;
            currentMove = move;

            if (currentMove === "Pg") {
                markingCircleClass = "lead-uppercut-mark-circle";
                valueDisplays[currentPlayer].innerHTML = "Value: Pg";
            } else if (currentMove === "Sg") {
                markingCircleClass = "rear-uppercut-mark-circle";
                valueDisplays[currentPlayer].innerHTML = "Value: Sg";
            } else if (currentMove === "Sf") {
                markingCircleClass = "croos-mark-innercircle";
                valueDisplays[currentPlayer].innerHTML = "Value: Sf";
            } else if (currentMove === "Center") {
                markingCircleClass = "Center-mark-innercircle";
                valueDisplays[currentPlayer].innerHTML = "Value: Center";
            } else if (currentMove === "Pf") {
                markingCircleClass = "Pf-mark-innercircle";
                valueDisplays[currentPlayer].innerHTML = "Value: Pf";
            } else if (currentMove === "Inisiasi") {
                markingCircleClass = "Inisiasi-mark-circle";
                valueDisplays[currentPlayer].innerHTML = "Value: Inisiasi";
            }
        };
    }

    function tableToCSV(tableId) {
        const table = document.getElementById(tableId);
        const rows = Array.from(table.querySelectorAll('tr'));
        const headers = Array.from(rows[0].querySelectorAll('th')).map(header => header.textContent);
        const dataRows = rows.slice(1).map(row => Array.from(row.querySelectorAll('td')).map(cell => cell.textContent));
        const csvContent = [headers, ...dataRows].map(row => row.join(',')).join('\n');
        return csvContent;
    }

    function downloadCSV(fileName, csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    document.getElementById("Pg").addEventListener("click", boxingMoveHandler("Player", "Pg"));
    document.getElementById("Sf").addEventListener("click", boxingMoveHandler("Player", "Sf"));
    document.getElementById("Inisiasi").addEventListener("click", boxingMoveHandler("Player", "Inisiasi"));
    document.getElementById("Pf").addEventListener("click", boxingMoveHandler("Player", "Pf"));
    document.getElementById("Sg").addEventListener("click", boxingMoveHandler("Player", "Sg"));
    document.getElementById("Center").addEventListener("click", boxingMoveHandler("Player", "Center"));

    document.getElementById("Pgplayer2").addEventListener("click", boxingMoveHandler("Player2", "Pg"));
    document.getElementById("Sfp2").addEventListener("click", boxingMoveHandler("Player2", "Sf"));
    document.getElementById("Inisiasiplayer2").addEventListener("click", boxingMoveHandler("Player2", "Inisiasi"));
    document.getElementById("Pfp2").addEventListener("click", boxingMoveHandler("Player2", "Pf"));
    document.getElementById("Sgp2").addEventListener("click", boxingMoveHandler("Player2", "Sg"));
    document.getElementById("Centerp2").addEventListener("click", boxingMoveHandler("Player2", "Center"));

    document.getElementById("Shoot-2p").addEventListener("click", function () {
        if (marking && currentPlayer && currentMove) {
            markingCircleClass = `${currentMove}-Fail-mark-circle`;
            valueDisplays[currentPlayer].innerHTML = `Value: Shoot-2p ${currentMove}`;
        }
    });

    document.getElementById("assisted").addEventListener("click", function () {
        if (marking && currentPlayer && currentMove) {
            markingCircleClass = `${currentMove}-assisted-mark-circle`;
            valueDisplays[currentPlayer].innerHTML = `Value: assisted ${currentMove}`;
        }
    });

    document.getElementById("Shoot-3p").addEventListener("click", function () {
        if (marking && currentPlayer && currentMove) {
            markingCircleClass = `${currentMove}-Shoot-3p-mark-circle`;
            valueDisplays[currentPlayer].innerHTML = `Value: Shoot-3p ${currentMove}`;
            const time = timerDisplay.textContent;
            addDataToTable(time, currentPlayer, currentMove);
        }
    });

    document.getElementById("Steals").addEventListener("click", function () {
        if (marking && currentPlayer && currentMove) {
            markingCircleClass = `${currentMove}Steals-mark-circle`;
            valueDisplays[currentPlayer].innerHTML = `Value: Steals ${currentMove}`;
            const time = timerDisplay.textContent;
            addDataToTable(time, currentPlayer, currentMove);
        }
    });
    document.getElementById("Fouls").addEventListener("click", function () {
        if (marking && currentPlayer && currentMove) {
            markingCircleClass = `${currentMove}Fouls-mark-circle`;
            valueDisplays[currentPlayer].innerHTML = `Value: Fouls ${currentMove}`;
            const time = timerDisplay.textContent;
            addDataToTable(time, currentPlayer, currentMove);
        }
    });

    document.getElementById("Free Throw").addEventListener("click", function () {
    if (marking && currentPlayer && currentMove) {
            markingCircleClass = `${currentMove}Free Throw-mark-square`;
            valueDisplays[currentPlayer].innerHTML = `Value: Free Throw ${currentMove}`;
            const time = timerDisplay.textContent;
            addDataToTable(time, currentPlayer, currentMove);
        
    }
    });
    
    document.getElementById("Block").addEventListener("click", function () {
    if (marking && currentPlayer && currentMove) {
        const moveClassMap = {
            "Pg": "Pg-Block-mark-circle",
            "Sg": "Sg-Block-mark-circle",
            "Sf": "Sf-Block-mark-circle",
            "Pf": "Pf-Block-mark-circle",
            "Center": "jungle-lane-Block-mark-circle",
        };

        markingCircleClass = moveClassMap[currentMove] || "";
        valueDisplays[currentPlayer].innerHTML = `Value: Block ${currentMove}`;
        const time = timerDisplay.textContent;
        addDataToTable(time, currentPlayer, currentMove);
    }
});



    

    document.getElementById("undo-player1").addEventListener("click", function () {
        console.log("Undo Player 1 clicked");
        undoMark(player1Marks, tableBody1);
    });

    document.getElementById("undo-player2").addEventListener("click", function () {
        console.log("Undo Player 2 clicked");
        undoMark(player2Marks, tableBody2);
    });

    function undoMark(playerMarks, tableBody) {
        if (playerMarks.length > 0) {
            const lastMark = playerMarks.pop();
            removeTableEntry(lastMark, tableBody);
            removeLastCircle();
            renderMarks(playerMarks, tableBody);
        }
    }

    function removeLastCircle() {
        if (addedCircles.length > 0) {
            const lastCircle = addedCircles.pop();
            lastCircle.parentNode.removeChild(lastCircle);
        }
    }

    function removeTableEntry(mark, tableBody) {
        const rowIndex = Array.from(tableBody.children).findIndex(row => {
            const cellCoordinates = row.cells[0].innerText;
            const cellTime = row.cells[3].innerText;
            return cellCoordinates === mark.coordinates && cellTime === mark.time;
        });

        if (rowIndex !== -1) {
            tableBody.deleteRow(rowIndex);
        }
    }

    document.getElementById('export-player1').addEventListener('click', function () {
        const csvContent = tableToCSV('player1-table');
        downloadCSV('player1.csv', csvContent);
    });

    document.getElementById('export-player2').addEventListener('click', function () {
        const csvContent = tableToCSV('player2-table');
        downloadCSV('player2.csv', csvContent);
    });


       // Function to handle various actions based on key
       function handleShortcut(key) {
        switch (key) {
            case "z":
            case "Z":
                // "Z" key is pressed, perform Pg action
                boxingMoveHandler("Player", "Pg")();
                break;
            case "x":
            case "X":
                // "Z" key is pressed, perform Pg action
                boxingMoveHandler("Player", "Sg")();
                break;
            case "c":
            case "C":
                // "Z" key is pressed, perform Pg action
                boxingMoveHandler("Player", "Sf")();
                break;
            case "v":
            case "V":
                // "Z" key is pressed, perform Pg action
                boxingMoveHandler("Player", "Pf")();
                break;
            case "b":
            case "B":
                // "Z" key is pressed, perform Pg action
                boxingMoveHandler("Player", "Center")();
                break;
            case "a":
            case "A":
                // "K" key is pressed, perform Shoot-2p action
                if (marking && currentPlayer && currentMove) {
                    markingCircleClass = `${currentMove}-Fail-mark-circle`;
                    valueDisplays[currentPlayer].innerHTML = `Value: Shoot-2p ${currentMove}`;
                }
                break;
            case "s":
            case "S":
                // "K" key is pressed, perform Shoot-2p action
                if (marking && currentPlayer && currentMove) {
                    markingCircleClass = `${currentMove}-assisted-mark-circle`;
                    valueDisplays[currentPlayer].innerHTML = `Value: assisted ${currentMove}`;
                }
                break;
            case "d":
            case "D":
                // "K" key is pressed, perform Shoot-2p action
                if (marking && currentPlayer && currentMove) {
                    markingCircleClass = `${currentMove}-Shoot-3p-mark-circle`;
                    valueDisplays[currentPlayer].innerHTML = `Value: Shoot-3p ${currentMove}`;
                }
                break;
            case "f":
            case "F":
                // "K" key is pressed, perform Shoot-2p action
                if (marking && currentPlayer && currentMove) {
                    markingCircleClass = `${currentMove}-Steals-mark-circle`;
                    valueDisplays[currentPlayer].innerHTML = `Value: Steals ${currentMove}`;
                }
                break;
            case "g":
            case "G":
                // "K" key is pressed, perform Shoot-2p action
                if (marking && currentPlayer && currentMove) {
                    markingCircleClass = `${currentMove}Steals-mark-circle`;
                    valueDisplays[currentPlayer].innerHTML = `Value: Steals ${currentMove}`;
                }
                break;
            case "h":
            case "H":
                // "K" key is pressed, perform Shoot-2p action
                if (marking && currentPlayer && currentMove) {
                    markingCircleClass = `${currentMove}Fouls-mark-circle`;
                    valueDisplays[currentPlayer].innerHTML = `Value: Fouls ${currentMove}`;
                }
                break;
            case "j":
            case "J":
                // "K" key is pressed, perform Shoot-2p action
                if (marking && currentPlayer && currentMove) {
                    markingCircleClass = `${currentMove}Free Throw-mark-square`;
                    valueDisplays[currentPlayer].innerHTML = `Value: Free Throw ${currentMove}`;
                }
                break;
            
            case "k":
            case "K":
                // "M" key is pressed, perform Block action
                if (marking && currentPlayer && currentMove) {
                    const moveClassMap = {
                        "Pg": "Pg-Block-mark-circle",
                        "Sg": "Sg-Block-mark-circle",
                        "Sf": "Sf-Block-mark-circle",
                        "Pf": "Pf-Block-mark-circle",
                        "Center": "jungle-lane-Block-mark-circle",
                    };

                    markingCircleClass = moveClassMap[currentMove] || "";
                    valueDisplays[currentPlayer].innerHTML = `Value: Block ${currentMove}`;
                    const time = timerDisplay.textContent;
                    addDataToTable(time, currentPlayer, currentMove);
                }
                break;
           
            case "q":
            case "Q":
                // "Q" key is pressed, perform Pg action for Player 2
                boxingMoveHandler("Player2", "Pg")();
                break;
            case "w":
            case "W":
                // "W" key is pressed, perform Sg action for Player 2
                boxingMoveHandler("Player2", "Sg")();
                break;
            case "e":
            case "E":
                // "E" key is pressed, perform Sf action for Player 2
                boxingMoveHandler("Player2", "Sf")();
                break;
            case "r":
            case "R":
                // "R" key is pressed, perform Pf action for Player 2
                boxingMoveHandler("Player2", "Pf")();
                break;
            case "t":
            case "T":
                // "T" key is pressed, perform Center action for Player 2
                boxingMoveHandler("Player2", "Center")();
                break;
            // Add more cases for other shortcuts as needed
            // For example:
            // case "x":
            //     // "X" key is pressed, perform another action
            //     // ...
            //     break;
            default:
                // Do nothing for other keys
                break;
        }
    }

    // Event listener for keydown event
    document.addEventListener("keydown", function (event) {
        const key = event.key;
        handleShortcut(key);
    });

        // Event listener for export button
    document.getElementById("export-Match").addEventListener("click", function () {
        const csvContent = tableToCSV("match-table");
        downloadCSV("combined-marks.csv", csvContent);
    });

    const tableBody1 = document.getElementById("mark-table-body");
    const tableBody2 = document.getElementById("mark-table-body-2");

    imageDiv.addEventListener("click", function (event) {
        if (marking && currentPlayer === "Player") {
            const rect = imageDiv.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const percentageText = printMousePos(event, imageDiv, x, y);

            player1Marks.push({
                coordinates: percentageText,
                value: valueDisplays[currentPlayer].innerText.split(": ")[1],
                player: currentPlayer,
                time: currentFormattedTime,
            });
            

            renderMarks(player1Marks, tableBody1);
            renderCombinedMarks();
        }
    });

    imageDiv2.addEventListener("click", function (event) {
        if (marking && currentPlayer === "Player2") {
            const rect = imageDiv2.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const percentageText = printMousePos(event, imageDiv2, x, y);

            player2Marks.push({
                coordinates: percentageText,
                value: valueDisplays[currentPlayer].innerText.split(": ")[1],
                player: currentPlayer,
                time: currentFormattedTime,
            });

            renderMarks(player2Marks, tableBody2);
            renderCombinedMarks();
        }
    });

     // Function to combine and render marks from both players
     function renderCombinedMarks() {
        const combinedMarks = [...player1Marks, ...player2Marks];
        combinedMarks.sort((a, b) => a.time.localeCompare(b.time));
    
        renderMarks(combinedMarks, document.getElementById("match-table-body"));
    }   

    // Modify renderMarks function to accept the target table body
    function renderMarks(marks, tableBody) {
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        marks.forEach((mark) => {
            const newRow = tableBody.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);

            cell1.innerHTML = mark.coordinates;
            cell2.innerHTML = mark.value;
            cell3.innerHTML = mark.player;
            cell4.innerHTML = mark.time;
        });
    }


});
