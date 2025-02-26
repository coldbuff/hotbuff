// //DOM 요소
// document.addEventListener("DOMContentLoaded", () => {
//     const todoInput = document.getElementById("todo-input");
//     const addButton = document.getElementById("add-btn");
//     const todoTableBody = document.getElementById("todo-table1");
//     const finishedTable = document.getElementById("todo-table2");
//     let todoCount = 0;

//     // 테이블의 번호를 재정렬
//     function updateTodoNumbers(todoCount) {
//         todoCount = 0;
//         let rows = todoTableBody.querySelectorAll("tr");
//         rows.forEach((row, index) => {
//             todoCount++;
//             row.querySelector("td:first-child").textContent = todoCount;
//         });
//     }

//     // 새로운 할 일 항목 테이블 행 생성
//     function createTodoItem(todoText) {
//         todoCount++;
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${todoCount}</td>
//             <td>${todoText}</td>
//             <td><input type="date" class="datetime"></td>
//             <td><input type="checkbox" class="check1"></td>
//             <td><button class="finish-btn">완료</button></td>
//             <td><button class="delete-btn">삭제</button></td>
//         `;
//         todoTableBody.appendChild(row);
//     }

//     // 입력 필드 초기화
//     function clearInput() {
//         todoInput.value = "";
//         todoInput.focus();
//     }

//     // 할 일 추가
//     addButton.addEventListener("click", () => {
//         const todoText = todoInput.value.trim();
//         if (todoText === "" || todoText === " ") {
//             alert("할 일을 입력하세요!");
//             return;
//         }
//         createTodoItem(todoText);
//         clearInput();
//     });

//     // Enter키로 할 일 추가
//     todoInput.addEventListener("keypress", (event) => {
//         if (event.key === "Enter") {
//             addButton.click();
//         }
//     });

//     // 삭제 버튼
//     todoTableBody.addEventListener("click", (event) => {
//         if (event.target.classList.contains("delete-btn")) {
//             event.target.closest("tr").remove();
//             updateTodoNumbers();
//         }
//     });

//     //완료 버튼(button) 누른 뒤
//     todoTableBody.addEventListener("click", (event) => {
//         if (event.target.classList.contains("finish-btn")) {
//             let row = event.target.closest("tr"); // 클릭된 버튼이 속한 행(tr)을 찾음
//             let clonedRow1 = row.cloneNode(true); // 행을 그대로 복사
//             let clonedRow2 = clonedRow1.querySelector("tr").target.classList.contains("finish-btn").remove(); //완료버튼은 삭제 후 넘김

//             // 완료 테이블로 추가
//             finishedTable.querySelector("tbody").appendChild(clonedRow2);

//             // 원본 테이블에서 삭제
//             row.remove();
//         }
//     });
// });

//  todoTableBody.addEventListener("click", (event) => {
//         if (event.target.classList.contains("finish-btn")) {
//             let row = event.target.closest("tr"); // 클릭된 버튼이 속한 행(tr)
                
//             // 완료된 일로 이동
//             finishedTable.querySelector("tbody2").appendChild(row);
//         }
//         console.log("완료 버튼 누른 뒤");
//     });

//     todoCheck1.addEventListener("click", (event) => {
//         if (event.target.classList.contains("finish-btn")) {
//             //alert("완료된 일 칸으로 이동시킬건가요?");
//             function rowClicked() {
//                 let table1 = document.getElementById("todo-table1");
//                 let rowList = table1.rows;

//                 for (let i = 1; i < rowList.length; i++){
//                     let row = rowList[i];
//                     let tbsNum = row.childElementCount;

//                     row.onclick = function() {
//                         let table2 = ' ';

//                         for (let j = 0; j < tbsNum; j++){
//                             let row_value = this.cells[j].innerHTML;
//                             table2 += row_value + ' ';
//                             document.getElementById("todo-table2").innerHTML = `<tr>${table2}</tr>`;
//                             //document.getElementById("todo-table1").remove("td");
//                         };
//                     };
//                 };
//             };
            
//         } else {
//             console.log("작동 안됨");
//         }
//         window.onload = rowClicked();
//     });