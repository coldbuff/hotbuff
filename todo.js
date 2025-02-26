// 숫자를 2자리 문자열로 변환 (예: 1 -> "01")
function formatNumber(num) {
    return num < 10 ? "0".concat(num) : "".concat(num);
}
// 날짜를 YYYY-MM-DD 형식의 문자열로 변환
function formatDate(year, month, day) {
    return "".concat(year, "-").concat(formatNumber(month), "-").concat(formatNumber(day));
}
document.addEventListener("DOMContentLoaded", function () {
    var todoInput = document.getElementById("todo-input");
    var addButton = document.getElementById("add-btn");
    var todoTableBody = document.querySelector("#todo-table1");
    var finishedTableBody = document.getElementById("todo-table2");
    var todoList = JSON.parse(localStorage.getItem("todos") || "[]");
    var finishedList = JSON.parse(localStorage.getItem("finished") || "[]");
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
    var currentDateElement = document.querySelector('.current-date');
    var updateCurrentDate = function () {
        var now = new Date();
        var options = {
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
    var sidebarToggle = document.querySelector('.sidebar-toggle');
    var sidebar = document.querySelector('.sidebar');
    var dashboardSection = document.getElementById('dashboard-section');
    var calendarSection = document.getElementById('calendar-section');
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('closed');
    });
    // 메뉴 클릭 이벤트
    var mainLink = document.querySelector('.main a');
    var calendarLink = document.querySelector('.calendar a');
    mainLink.addEventListener('click', function (e) {
        e.preventDefault();
        dashboardSection.style.display = 'block';
        calendarSection.style.display = 'none';
    });
    calendarLink.addEventListener('click', function (e) {
        e.preventDefault();
        dashboardSection.style.display = 'none';
        calendarSection.style.display = 'block';
        renderCalendar();
    });
    // 캘린더 관련 변수
    var calendarCurrentDate = new Date();
    var prevMonthBtn = document.getElementById('prevMonth');
    var nextMonthBtn = document.getElementById('nextMonth');
    var currentMonthElement = document.getElementById('currentMonth');
    var calendarDays = document.getElementById('calendar-days');
    var todoDetails = document.getElementById('todo-details');
    // 캘린더 네비게이션
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', function () {
            console.log('이전 달 버튼 클릭');
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
            renderCalendar();
        });
        nextMonthBtn.addEventListener('click', function () {
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
        var year = calendarCurrentDate.getFullYear();
        var month = calendarCurrentDate.getMonth();
        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
        var startingDay = firstDay.getDay();
        var totalDays = lastDay.getDate();
        console.log('캘린더 정보:', { year: year, month: month, startingDay: startingDay, totalDays: totalDays });
        currentMonthElement.textContent = "".concat(year, "\uB144 ").concat(month + 1, "\uC6D4");
        calendarDays.innerHTML = '';
        // 빈 날짜 채우기
        for (var i = 0; i < startingDay; i++) {
            var emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarDays.appendChild(emptyDay);
        }
        var _loop_1 = function (day) {
            var dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = String(day);
            var currentDateStr = formatDate(year, month + 1, day);
            var hasTodo = todoList.some(function (todo) { return todo.date === currentDateStr; });
            var hasPriority = todoList.some(function (todo) { return todo.date === currentDateStr && todo.priority; }) ||
                finishedList.some(function (todo) { return todo.date === currentDateStr && todo.priority; });
            var hasFinished = finishedList.some(function (todo) { return todo.date === currentDateStr; });
            if (hasTodo)
                dayElement.classList.add('has-todo');
            if (hasPriority)
                dayElement.classList.add('has-priority');
            if (hasFinished)
                dayElement.classList.add('has-finished');
            dayElement.addEventListener('click', function () { return showTodoDetails(currentDateStr); });
            calendarDays.appendChild(dayElement);
        };
        // 날짜 채우기
        for (var day = 1; day <= totalDays; day++) {
            _loop_1(day);
        }
    }
    // 선택된 날짜의 할 일 표시
    function showTodoDetails(dateStr) {
        var activeTodos = todoList.filter(function (todo) { return todo.date === dateStr; });
        var finishedTodos = finishedList.filter(function (todo) { return todo.date === dateStr; });
        var html = "<h3>".concat(dateStr, " \uD560 \uC77C</h3>");
        if (activeTodos.length > 0) {
            html += '<h4>진행 중</h4><ul>';
            activeTodos.forEach(function (todo) {
                html += "<li>".concat(todo.text).concat(todo.priority ? ' ⭐' : '', "</li>");
            });
            html += '</ul>';
        }
        if (finishedTodos.length > 0) {
            html += '<h4>완료됨</h4><ul>';
            finishedTodos.forEach(function (todo) {
                html += "<li>".concat(todo.text).concat(todo.priority ? ' ⭐' : '', "</li>");
            });
            html += '</ul>';
        }
        if (activeTodos.length === 0 && finishedTodos.length === 0) {
            html += '<p>이 날짜에는 할 일이 없습니다.</p>';
        }
        todoDetails.innerHTML = html;
        // 선택된 날짜 표시
        document.querySelectorAll('.day').forEach(function (day) { return day.classList.remove('selected'); });
        var days = document.querySelectorAll('.day:not(.empty)');
        var selectedDay = null;
        days.forEach(function (day) {
            var dayNum = parseInt(day.textContent || "0");
            var dayStr = formatNumber(dayNum);
            var formattedDate = formatDate(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() + 1, parseInt(dayStr));
            if (formattedDate === dateStr) {
                selectedDay = day;
            }
        });
        if (selectedDay) {
            selectedDay.classList.add('selected');
        }
    }
    // Todo 아이템 생성
    function createTodoItem(todoText, todoDate, todoPriority, save) {
        if (todoDate === void 0) { todoDate = ''; }
        if (todoPriority === void 0) { todoPriority = false; }
        if (save === void 0) { save = true; }
        var row = document.createElement("tr");
        row.innerHTML = "\n            <td>".concat(todoText, "</td>\n            <td>").concat(todoDate, "</td>\n            <td>").concat(todoPriority ? '⭐' : '', "</td>\n            <td>\n                <input type=\"checkbox\" class=\"complete-checkbox\">\n                <button class=\"delete-btn\">\uC0AD\uC81C</button>\n            </td>\n        ");
        todoTableBody.appendChild(row);
        if (save) {
            todoList.push({ text: todoText, date: todoDate, priority: todoPriority });
            saveTodos();
            renderCalendar();
            updateChart();
        }
    }
    // 완료된 일로 이동
    function moveToFinished(todoText, todoDate, todoPriority, save) {
        if (save === void 0) { save = true; }
        var row = document.createElement("tr");
        row.innerHTML = "\n            <td>".concat(todoText, "</td>\n            <td>").concat(todoDate, "</td>\n            <td>").concat(todoPriority ? '⭐' : '', "</td>\n            <td><button class=\"delete-btn\">\uC0AD\uC81C</button></td>\n        ");
        finishedTableBody.appendChild(row);
        if (save) {
            finishedList.push({ text: todoText, date: todoDate, priority: todoPriority });
            saveFinishedTodos();
            renderCalendar();
            updateChart();
        }
    }
    // 입력 필드 초기화
    function clearInput() {
        todoInput.value = "";
        var dateInput = document.getElementById("todo-date");
        var priorityInput = document.getElementById("todo-priority");
        if (dateInput)
            dateInput.value = "";
        if (priorityInput)
            priorityInput.checked = false;
    }
    // 초기 데이터 로드
    function loadTodos() {
        todoList.forEach(function (todo) { return createTodoItem(todo.text, todo.date, todo.priority, false); });
        finishedList.forEach(function (todo) { return moveToFinished(todo.text, todo.date, todo.priority, false); });
        renderCalendar();
        updateChart();
    }
    // 차트 데이터 생성
    function getChartData() {
        var today = new Date();
        var labels = [];
        var data = [];
        var _loop_2 = function (i) {
            var date = new Date(today.getTime());
            date.setDate(today.getDate() - i);
            var dateStr = date.toISOString().split('T')[0];
            labels.push(dateStr);
            data.push(finishedList.filter(function (todo) { return todo.date === dateStr; }).length);
        };
        for (var i = 6; i >= 0; i--) {
            _loop_2(i);
        }
        return { labels: labels, data: data };
    }
    // 차트 옵션
    function getChartOptions() {
        return {
            responsive: true,
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
                    display: false
                },
                title: {
                    display: true,
                    text: '최근 7일간 완료한 할 일'
                }
            }
        };
    }
    // 차트 업데이트
    function updateChart() {
        var chartCanvas = document.getElementById('completionChart');
        if (!chartCanvas)
            return;
        var ctx = chartCanvas.getContext('2d');
        if (!ctx)
            return;
        var _a = getChartData(), labels = _a.labels, data = _a.data;
        // @ts-ignore
        if (window.myChart) {
            // @ts-ignore
            window.myChart.destroy();
        }
        // @ts-ignore
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                        data: data,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
            },
            options: getChartOptions()
        });
    }
    // 이벤트 리스너
    addButton.addEventListener("click", function () {
        var todoText = todoInput.value.trim();
        if (todoText === "") {
            alert("할 일을 입력해주세요!");
            return;
        }
        var dateInput = document.getElementById("todo-date");
        var priorityInput = document.getElementById("todo-priority");
        var todoDate = dateInput ? dateInput.value : '';
        var todoPriority = priorityInput ? priorityInput.checked : false;
        createTodoItem(todoText, todoDate, todoPriority);
        clearInput();
    });
    todoTableBody.addEventListener("change", function (event) {
        var target = event.target;
        if (target.classList.contains("complete-checkbox")) {
            var row = target.closest("tr");
            if (!row)
                return;
            var todoText = row.cells[0].textContent || "";
            var todoDate = row.cells[1].textContent || "";
            var todoPriority = row.cells[2].textContent === "⭐";
            var index = -1;
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].text === todoText) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                todoList.splice(index, 1);
                saveTodos();
            }
            row.remove();
            moveToFinished(todoText, todoDate, todoPriority);
        }
    });
    finishedTableBody.addEventListener("click", function (event) {
        var target = event.target;
        if (target.classList.contains("delete-btn")) {
            var row = target.closest("tr");
            if (!row)
                return;
            var todoText = row.cells[0].textContent || "";
            var index = -1;
            for (var i = 0; i < finishedList.length; i++) {
                if (finishedList[i].text === todoText) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                finishedList.splice(index, 1);
                saveFinishedTodos();
            }
            row.remove();
            renderCalendar();
            updateChart();
        }
    });
    loadTodos();
});
