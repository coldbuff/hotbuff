document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addButton = document.getElementById("add-btn");
    const todoTableBody = document.querySelector("#todo-table1");
    const finishedTableBody = document.getElementById("todo-table2");

    let todoList = JSON.parse(localStorage.getItem("todos")) || [];
    let finishedList = JSON.parse(localStorage.getItem("finished")) || [];

    // 목록 저장
    function saveTodos() {
        console.log("저장된 진행 목록:", todoList);
        localStorage.setItem("todos", JSON.stringify(todoList));
    }

    function saveFinishedTodos() {
        console.log("저장된 완료 목록:", finishedList);
        localStorage.setItem("finished", JSON.stringify(finishedList));
    }

    // 현재 날짜 표시
    const currentDateElement = document.querySelector('.current-date');
    const updateCurrentDate = () => {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateElement.textContent = now.toLocaleDateString('ko-KR', options);
    };
    updateCurrentDate();
    setInterval(updateCurrentDate, 1000 * 60);

    // 사이드바 및 페이지 전환
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const dashboardSection = document.getElementById('dashboard-section');
    const calendarSection = document.getElementById('calendar-section');
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('closed');
    });

    // 메뉴 클릭 이벤트
    document.querySelector('.main a').addEventListener('click', (e) => {
        e.preventDefault();
        dashboardSection.style.display = 'block';
        calendarSection.style.display = 'none';
    });

    document.querySelector('.calendar a').addEventListener('click', (e) => {
        e.preventDefault();
        dashboardSection.style.display = 'none';
        calendarSection.style.display = 'block';
        renderCalendar();
    });

    // 캘린더 관련 변수
    let calendarCurrentDate = new Date();
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarDays = document.getElementById('calendar-days');
    const todoDetails = document.getElementById('todo-details');

    // 캘린더 네비게이션
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            console.log('이전 달 버튼 클릭');
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            console.log('다음 달 버튼 클릭');
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    // 캘린더 렌더링
    function renderCalendar() {
        console.log('캘린더 렌더링 시작');
        if (!calendarDays || !currentMonthElement) {
            console.error('캘린더 요소를 찾을 수 없습니다');
            return;
        }

        const year = calendarCurrentDate.getFullYear();
        const month = calendarCurrentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        console.log('캘린더 정보:', { year, month, startingDay, totalDays });

        currentMonthElement.textContent = year + '년 ' + (month + 1) + '월';
        calendarDays.innerHTML = '';

        // 빈 날짜 채우기
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarDays.appendChild(emptyDay);
        }

        // 날짜 채우기
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;

            // 해당 날짜의 할 일 확인
            const currentDateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
            
            // 진행 중인 할 일 유무 확인
            const hasTodo = todoList.some(todo => todo.date === currentDateStr);

            // 중요 할 일 유무 확인 (진행 중 + 완료)
            const hasPriority = todoList.some(todo => todo.date === currentDateStr && todo.priority) || 
                               finishedList.some(todo => todo.date === currentDateStr && todo.priority);

            // 완료된 할 일 유무 확인
            const hasFinished = finishedList.some(todo => todo.date === currentDateStr);

            // 클래스 추가
            if (hasTodo) {
                dayElement.classList.add('has-todo');
            }
            if (hasPriority) {
                dayElement.classList.add('has-priority');
            }
            if (hasFinished) {
                dayElement.classList.add('has-finished');
            }

            dayElement.addEventListener('click', () => showTodoDetails(currentDateStr));
            calendarDays.appendChild(dayElement);
        }
    }

    // 선택된 날짜의 진행할 일 및 완료된 일 표시
    function showTodoDetails(dateStr) {
        const activeTodos = todoList.filter(todo => todo.date === dateStr);
        const finishedTodos = finishedList.filter(todo => todo.date === dateStr);

        let html = '<h3>' + dateStr + ' 할 일</h3>';
        
        if (activeTodos.length > 0) {
            html += '<h4>진행 중</h4><ul>';
            activeTodos.forEach(todo => {
                html += '<li>' + todo.text + (todo.priority ? ' ⭐' : '') + '</li>';
            });
            html += '</ul>';
        }

        if (finishedTodos.length > 0) {
            html += '<h4>완료됨</h4><ul>';
            finishedTodos.forEach(todo => {
                html += '<li>' + todo.text + (todo.priority ? ' ⭐' : '') + '</li>';
            });
            html += '</ul>';
        }

        if (activeTodos.length === 0 && finishedTodos.length === 0) {
            html += '<p>이 날짜에는 할 일이 없습니다.</p>';
        }

        todoDetails.innerHTML = html;

        // 선택된 날짜 표시
        document.querySelectorAll('.day').forEach(day => day.classList.remove('selected'));
        const days = document.querySelectorAll('.day:not(.empty)');
        const selectedDay = Array.from(days).find(day => {
            const dayNum = parseInt(day.textContent);
            const dayStr = String(dayNum).padStart(2, '0');
            const formattedDate = calendarCurrentDate.getFullYear() + '-' + 
                                 String(calendarCurrentDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                 dayStr;
            console.log('날짜 비교:', {
                formattedDate,
                dateStr,
                year: calendarCurrentDate.getFullYear(),
                month: calendarCurrentDate.getMonth(),
                day: dayStr
            });
            return formattedDate === dateStr;
        });
        if (selectedDay) {
            selectedDay.classList.add('selected');
        }
    }

    // date와 checkbox 변경
    todoTableBody.addEventListener("change", (event) => {
        const row = event.target.closest("tr");
        const todoText = row.cells[0].textContent;
        const index = todoList.findIndex(todo => todo.text === todoText);

        if (index !== -1) {
            if (event.target.classList.contains("datetime")) {
                // date 변경
                todoList[index].date = event.target.value;
                console.log(`날짜 변경: ${todoText} -> ${event.target.value}`);
            } else if (event.target.classList.contains("check1")) {
                // checkbox 변경
                todoList[index].priority = event.target.checked;
                console.log(`우선순위 변경: ${todoText} -> ${event.target.checked}`);
            }
            saveTodos();
        }
    });

    // 리스트 저장 목록
    function loadTodos() {
        console.log("로딩된 진행 목록:", todoList);
        console.log("로딩된 완료 목록:", finishedList);
        todoList.forEach(todo => createTodoItem(todo.text, todo.date, todo.priority, false));
        finishedList.forEach(todo => moveToFinished(todo.text, todo.date, todo.priority, false));
    }

    // 진행할 일 추가버튼
    function createTodoItem(todoText, todoDate = '', todoPriority = false, save = true) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${todoText}</td>
            <td><input type="date" class="datetime" value="${todoDate}"></td>
            <td><input type="checkbox" class="check1" ${todoPriority ? "checked" : ""}></td>
            <td><button class="finish-btn">완료</button></td>
            <td><button class="delete-btn">삭제</button></td>
        `;
        todoTableBody.appendChild(row);

        if (save) {
            todoList.push({ text: todoText, date: todoDate, priority: todoPriority });
            saveTodos();
        }
    }

    // 입력 필드 초기화
    function clearInput() {
        todoInput.value = "";
        todoInput.focus();
    }

    // 공백 방지
    addButton.addEventListener("click", () => {
        const todoText = todoInput.value.trim();
        if (todoText === "") {
            alert("진행할 일을 입력하세요!");
            return;
        }
        createTodoItem(todoText);
        clearInput();
    });

    // enterkey로 일 추가
    todoInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addButton.click();
            updateChart();
        }
    });

    // 진행할 일 삭제버튼
    todoTableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            let row = event.target.closest("tr");
            let text = row.children[0].textContent;
            todoList = todoList.filter(todo => todo.text !== text);
            saveTodos();
            row.remove();
            updateChart();
        }
    });

    // finish-btn을 눌렀을 때 index로 원하는 값만 저장하고 나머지 값은 삭제
    todoTableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("finish-btn")) {
            let row = event.target.closest("tr");
            let text = row.children[0].textContent;
            let date = row.children[1].querySelector("input").value;
            if (date === ""){
                alert("진행할 일의 기한을 정해주세요!");
                return;
            }
            let priority = row.children[2].querySelector("input").checked;
            moveToFinished(text, date, priority);
            todoList = todoList.filter(todo => todo.text !== text);
            saveTodos();
            row.remove();
            updateChart();
        }
    });

    // 완료된 일로 원하는 값만 보냄
    function moveToFinished(todoText, todoDate, todoPriority, save = true) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${todoText}</td>
            <td><input type="date" class="datetime" value="${todoDate}"></td>
            <td><input type="checkbox" class="check1" ${todoPriority ? "checked" : ""}></td>
            <td><button class="delete-btn">삭제</button></td>
        `;
        finishedTableBody.appendChild(row);

        if (save) {
            finishedList.push({ text: todoText, date: todoDate, priority: todoPriority});
            saveFinishedTodos();
        }
    }

    // 완료된 일 삭제버튼
    finishedTableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            let row = event.target.closest("tr");
            let text = row.children[0].textContent;
            finishedList = finishedList.filter(todo => todo.text !== text);
            saveFinishedTodos();
            row.remove();
            updateChart();
        }
    });

    // 리스트 통계
    const ctx = document.getElementById("myChart");
    const todoCount = todoList.length;
    const finishedCount = finishedList.length;

    let myChart;

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['진행 중', '완료'],
            datasets: [{
                    label: '일정 통계',
                    data: [todoCount, finishedCount],
                    borderWidth: 1,
                    backgroundColor: ['#94B6DE','#c2e529']
                }]
        },
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center'
                }
            }
        }
    });

    // 차트 데이터 생성 함수
    function getChartData() {
        return {
            labels: ['진행 중', '완료'],
            datasets: [{
                label: '일정 통계',
                data: [todoList.length, finishedList.length],
                borderWidth: 1,
                backgroundColor: ['#94B6DE', '#c2e529']
            }]
        };
    }

    // 차트 옵션 생성 함수
    function getChartOptions() {
        return {
            layout: {
            padding: {
                left: 50,
                right: 50
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'center'
            }
        }
    };
    }

    // 차트 업데이트 함수
    function updateChart() {
        if (myChart) {
            myChart.destroy(); // 기존 차트 제거
        }
        myChart = new Chart(document.getElementById("myChart").getContext("2d"), {
            type: 'bar',
            data: getChartData(),
            options: getChartOptions()
        });
    }
    
    loadTodos();
});