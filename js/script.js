// 全局变量
let classData = [];
let selectedClass = null;
let selectedDay = null;
let selectedSubject = null;
let currentWeekDay = null;

// 绘画相关变量
let isDrawingMode = false;
let isErasing = false;
let isDrawing = false;
let drawingCanvas;
let drawingContext;
let lastX, lastY;
let brushSize = 5;
let brushColor = '#FF0000';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前日期和周次
    updateDateAndWeek();

    // 加载班级数据
    loadClassData();

    // 初始化事件监听
    initEventListeners();
});
ƒ
// 更新日期和周次信息
function updateDateAndWeek() {
    const dateElement = document.getElementById('current-date');
    const weekElement = document.getElementById('current-week');

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = now.getDay(); // 0是周日，1-6是周一到周六

    // 将0-6转换为周日-周六的字符串
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    currentWeekDay = weekdays[day === 0 ? 0 : day]; // 如果是周日(0)，使用sunday，否则使用对应的weekdays[day]

    // 计算当前是第几周（这里简单处理，以年初为第1周）
    const startOfYear = new Date(year, 0, 1);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysPassed = Math.floor((now - startOfYear) / millisecondsPerDay);
    const weekNumber = Math.ceil((daysPassed + startOfYear.getDay() + 1) / 7);

    // 更新DOM
    dateElement.textContent = `${year}年${month}月${date}日`;
    weekElement.textContent = `第 ${weekNumber} 周`;
}

// 加载班级数据
function loadClassData() {
    // 使用XMLHttpRequest，兼容本地文件访问
    const xhr = new XMLHttpRequest();

    // 尝试使用相对路径加载
    xhr.open('GET', 'data/classes.json', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) { // 0表示本地文件
                try {
                    classData = JSON.parse(xhr.responseText);
                    populateClassSelect();
                } catch (e) {
                    console.error('解析班级数据失败:', e);
                    loadHardcodedData(); // 加载硬编码数据作为备份
                }
            } else {
                console.error('获取班级数据失败，状态码:', xhr.status);
                loadHardcodedData(); // 加载硬编码数据作为备份
            }
        }
    };

    xhr.onerror = function() {
        console.error('加载班级数据出错');
        loadHardcodedData(); // 加载硬编码数据作为备份
    };

    try {
        xhr.send();
    } catch (e) {
        console.error('发送请求失败:', e);
        loadHardcodedData(); // 加载硬编码数据作为备份
    }
}

// 加载硬编码的班级数据（作为备份）
function loadHardcodedData() {
    // 硬编码两个班级的数据
    classData = [
        {
            "class": "1",
            "schedule": {
              "monday": [
                {"subject": "数学", "teacher": "林申奥", "period": 1},
                {"subject": "英语", "teacher": "一A英走", "period": 2},
                {"subject": "语文", "teacher": "黄则慧", "period": 3},
                {"subject": "历史", "teacher": "李英睿", "period": 4},
                {"subject": "化学", "teacher": "高有克", "period": 5},
                {"subject": "体育", "teacher": "陈兴可", "period": 6},
                {"subject": "政治", "teacher": "陈金海", "period": 7},
                {"subject": "综合实践课", "teacher": "", "period": 8}
              ],
              "tuesday": [
                {"subject": "历史", "teacher": "李英睿", "period": 1},
                {"subject": "语文", "teacher": "黄则慧", "period": 2},
                {"subject": "化学", "teacher": "高有克", "period": 3},
                {"subject": "物理", "teacher": "赵新洋", "period": 4},
                {"subject": "数学", "teacher": "林申奥", "period": 5},
                {"subject": "英语", "teacher": "一A英人", "period": 6},
                {"subject": "地理", "teacher": "周绍驰", "period": 7},
                {"subject": "周前会", "teacher": "周绍驰", "period": 8}
              ],
              "wednesday": [
                {"subject": "英语", "teacher": "一A英人", "period": 1},
                {"subject": "化学", "teacher": "高有克", "period": 2},
                {"subject": "政治", "teacher": "陈金海", "period": 3},
                {"subject": "地理", "teacher": "周绍驰", "period": 4},
                {"subject": "语文", "teacher": "黄则慧", "period": 5},
                {"subject": "生物", "teacher": "吴正准", "period": 6},
                {"subject": "音乐", "teacher": "黄振付", "period": 7},
                {"subject": "数学", "teacher": "林申奥", "period": 8}
              ],
              "thursday": [
                {"subject": "语文", "teacher": "黄则慧", "period": 1},
                {"subject": "政治", "teacher": "陈金海", "period": 2},
                {"subject": "英语", "teacher": "一A英人", "period": 3},
                {"subject": "物理", "teacher": "赵新洋", "period": 4},
                {"subject": "数学", "teacher": "林申奥", "period": 5},
                {"subject": "生物", "teacher": "吴正准", "period": 6},
                {"subject": "心理", "teacher": "卓旭东", "period": 7},
                {"subject": "地理", "teacher": "周绍驰", "period": 8}
              ],
              "friday": [
                {"subject": "数学", "teacher": "林申奥", "period": 1},
                {"subject": "地理", "teacher": "周绍驰", "period": 2},
                {"subject": "历史", "teacher": "李英睿", "period": 3},
                {"subject": "英语", "teacher": "一A英人", "period": 4},
                {"subject": "生物", "teacher": "吴正准", "period": 5},
                {"subject": "政治", "teacher": "陈金海", "period": 6},
                {"subject": "语文", "teacher": "黄则慧", "period": 7},
                {"subject": "物理", "teacher": "赵新洋", "period": 8}
              ],
              "saturday": [
                {"subject": "英语", "teacher": "一A英人", "period": 1},
                {"subject": "历史", "teacher": "李英睿", "period": 2},
                {"subject": "数学", "teacher": "林申奥", "period": 3},
                {"subject": "语文", "teacher": "黄则慧", "period": 4}
              ],
              "sunday": []
            }
        }
    ];

    populateClassSelect();
}

// 填充班级选择下拉框
function populateClassSelect() {
    const classSelect = document.getElementById('class-select');

    // 清空现有选项（保留默认选项）
    while (classSelect.options.length > 0) {
        classSelect.remove(0);
    }

    // 添加班级选项
    classData.forEach((classInfo, index) => {
        const option = document.createElement('option');
        option.value = classInfo.class;
        option.textContent = `${classInfo.class}班`;
        classSelect.appendChild(option);

        // 如果是第一个班级，默认选中
        if (index === 0) {
            option.selected = true;
        }
    });

    // 如果有班级数据，自动选中第一个班级并触发change事件
    if (classData.length > 0) {
        selectedClass = classData[0].class;

        // 如果自动周次被选中，则自动选择当前周次
        if (document.getElementById('auto-week-checkbox').checked) {
            selectCurrentDay();
        }

        // 更新科目按钮状态
        updateSubjectButtons();

        // 如果有选中的科目，更新周次按钮状态
        if (selectedSubject) {
            console.log('初始化时更新周次按钮状态，科目：', selectedSubject);
            updateWeekdayButtonsForSubject(selectedSubject);
        }
    }
}

// 初始化事件监听
function initEventListeners() {
    // 班级选择变化
    document.getElementById('class-select').addEventListener('change', handleClassChange);

    // 周次按钮点击
    document.querySelectorAll('.weekday-btn').forEach(button => {
        button.addEventListener('click', handleDayClick);
    });

    // 自动周次复选框变化
    document.getElementById('auto-week-checkbox').addEventListener('change', handleAutoWeekChange);

    // 科目按钮点击
    document.querySelectorAll('.subject-btn').forEach(button => {
        button.addEventListener('click', handleSubjectClick);
    });
}

// 处理班级选择变化
function handleClassChange(event) {
    const classId = event.target.value;
    if (!classId) return;

    selectedClass = classId;
    console.log('选中班级：', selectedClass);

    // 如果自动周次被选中，则自动选择当前周次
    if (document.getElementById('auto-week-checkbox').checked) {
        selectCurrentDay();
    } else {
        // 否则清除所有周次按钮的选中状态
        document.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('has-subject');
        });
        selectedDay = null;
    }

    // 更新科目按钮状态
    updateSubjectButtons();

    // 如果有选中的科目，更新周次按钮状态
    if (selectedSubject) {
        console.log('切换班级时更新周次按钮状态，科目：', selectedSubject);
        updateWeekdayButtonsForSubject(selectedSubject);
    }

    // 清空作业展示区
    updateHomeworkDisplay();
}

// 处理周次按钮点击
function handleDayClick(event) {
    if (!selectedClass) {
        alert('请先选择班级');
        return;
    }

    // 移除所有周次按钮的选中状态
    document.querySelectorAll('.weekday-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 添加当前按钮的选中状态
    event.target.classList.add('active');

    // 更新选中的周次
    selectedDay = event.target.dataset.day;
    console.log('选中周次：', selectedDay);

    // 更新科目按钮状态
    updateSubjectButtons();

    // 如果有选中的科目，更新周次按钮状态
    if (selectedSubject) {
        console.log('点击周次按钮时更新周次按钮状态，科目：', selectedSubject);
        updateWeekdayButtonsForSubject(selectedSubject);
    }

    // 如果已选择科目，则更新作业展示
    if (selectedSubject) {
        updateHomeworkDisplay();
    }
}

// 处理自动周次复选框变化
function handleAutoWeekChange(event) {
    if (event.target.checked && selectedClass) {
        selectCurrentDay();
    }
}

// 选择当前周次
function selectCurrentDay() {
    if (!currentWeekDay) return;

    console.log('自动选择当前周次：', currentWeekDay);

    // 找到对应当前周次的按钮并点击它
    const dayButton = document.querySelector(`.weekday-btn[data-day="${currentWeekDay}"]`);
    if (dayButton) {
        // 移除所有周次按钮的选中状态
        document.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 添加当前周次按钮的选中状态
        dayButton.classList.add('active');

        // 更新选中的周次
        selectedDay = currentWeekDay;

        // 更新科目按钮状态
        updateSubjectButtons();

        // 如果有选中的科目，更新周次按钮状态
        if (selectedSubject) {
            console.log('自动选择周次时更新周次按钮状态，科目：', selectedSubject);
            updateWeekdayButtonsForSubject(selectedSubject);
        }
    }
}

// 更新科目按钮状态
function updateSubjectButtons() {
    console.log('更新科目按钮状态');

    if (!selectedClass || !selectedDay) {
        // 如果没有选择班级或周次，则禁用所有科目按钮
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.classList.remove('has-class', 'active');
        });
        return;
    }

    // 获取当前班级当前周次的课表
    const classInfo = classData.find(c => c.class === selectedClass);
    if (!classInfo || !classInfo.schedule[selectedDay]) {
        console.error('未找到课表数据');
        return;
    }

    const daySchedule = classInfo.schedule[selectedDay];

    // 获取当天有课的科目列表
    const subjectsWithClass = daySchedule.map(item => item.subject);
    console.log('当天有课的科目：', subjectsWithClass);

    // 更新科目按钮状态
    document.querySelectorAll('.subject-btn').forEach(btn => {
        const subject = btn.dataset.subject;
        if (subjectsWithClass.includes(subject)) {
            btn.classList.add('has-class');
        } else {
            btn.classList.remove('has-class');
        }

        // 如果当前科目是选中的科目，则添加active类
        if (subject === selectedSubject) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 如果有选中的科目，更新周次按钮状态
    if (selectedSubject) {
        console.log('在updateSubjectButtons中更新周次按钮状态，科目：', selectedSubject);
        updateWeekdayButtonsForSubject(selectedSubject);
    }
}

// 新增函数：更新周次按钮状态
function updateWeekdayButtonsForSubject(subject) {
    console.log('更新周次按钮状态，科目：', subject);

    // 获取当前班级信息
    const classInfo = classData.find(c => c.class === selectedClass);
    if (!classInfo) {
        console.error('未找到班级信息');
        return;
    }

    // 清除所有周次按钮的has-subject类
    document.querySelectorAll('.weekday-btn').forEach(btn => {
        btn.classList.remove('has-subject');
    });

    // 遍历每个周次，检查是否有该科目的课
    let hasSubjectDays = [];

    Object.entries(classInfo.schedule).forEach(([day, lessons]) => {
        if (lessons.some(lesson => lesson.subject === subject)) {
            hasSubjectDays.push(day);
            const weekdayBtn = document.querySelector(`.weekday-btn[data-day="${day}"]`);
            if (weekdayBtn) {
                weekdayBtn.classList.add('has-subject');
                console.log(`周次 ${day} 有 ${subject} 课，添加has-subject类`);
            } else {
                console.error(`未找到周次按钮：${day}`);
            }
        }
    });

    console.log(`科目 ${subject} 在以下周次有课：`, hasSubjectDays);
}

// 处理科目按钮点击
function handleSubjectClick(event) {
    if (!selectedClass) {
        alert('请先选择班级');
        return;
    }

    if (!selectedDay) {
        alert('请先选择周次');
        return;
    }

    // 移除所有科目按钮的选中状态
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 添加当前按钮的选中状态
    event.target.classList.add('active');

    // 更新选中的科目
    selectedSubject = event.target.dataset.subject;

    console.log('选中科目：', selectedSubject);

    // 更新周次按钮状态
    updateWeekdayButtonsForSubject(selectedSubject);

    // 更新作业展示
    updateHomeworkDisplay();
}

// 更新作业展示区
function updateHomeworkDisplay() {
    const homeworkContent = document.getElementById('homework-content');

    // 如果没有选择班级、周次或科目，则显示提示信息
    if (!selectedClass || !selectedDay || !selectedSubject) {
        homeworkContent.innerHTML = '<div class="placeholder-message">请选择班级、周次和科目查看作业</div>';
        return;
    }

    // 获取当前班级当前周次的课表
    const classInfo = classData.find(c => c.class === selectedClass);
    if (!classInfo || !classInfo.schedule[selectedDay]) {
        homeworkContent.innerHTML = '<div class="placeholder-message">未找到课表数据</div>';
        return;
    }

    const daySchedule = classInfo.schedule[selectedDay];

    // 查找当前科目在当天的课程信息
    const subjectLessons = daySchedule.filter(item => item.subject === selectedSubject);

    if (subjectLessons.length === 0) {
        homeworkContent.innerHTML = '<div class="placeholder-message">当天没有该科目的课程</div>';
        return;
    }

    // 获取教师姓名
    const teacher = subjectLessons[0].teacher;

    // 计算该科目一周有几节课
    let totalLessonsPerWeek = 0;
    let lessonNumberInWeek = 0;

    // 遍历一周的每一天
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // 调试信息
    console.log('当前选择的班级:', selectedClass);
    console.log('当前选择的周次:', selectedDay);
    console.log('当前选择的科目:', selectedSubject);
    console.log('教师:', teacher);

    // 先计算总课程数和之前日期的课程数
    weekdays.forEach(day => {
        if (classInfo.schedule[day]) {
            const lessons = classInfo.schedule[day].filter(item => item.subject === selectedSubject);
            console.log(`${day} 有 ${lessons.length} 节 ${selectedSubject} 课`);
            totalLessonsPerWeek += lessons.length;

            // 如果是当前选中的日期之前的日期，累加课程数量
            if (weekdays.indexOf(day) < weekdays.indexOf(selectedDay)) {
                lessonNumberInWeek += lessons.length;
                console.log(`累计之前日期的课程数: ${lessonNumberInWeek}`);
            }
        }
    });

    // 找出当天的课程是第几节
    // 获取当天该科目的所有课程
    const todayLessons = daySchedule.filter(item => item.subject === selectedSubject);
    console.log('当天该科目的课程：', todayLessons.length, '节');

    // 如果当天有多节该科目的课，找出当前课程是第几节
    // 这里我们假设用户想看的是当天该科目的第一节课的作业
    // 如果需要区分当天的不同课程，需要额外的UI让用户选择
    const lessonIndexToday = 1; // 默认使用当天该科目的第一节课

    // 最终的课程序号是之前日期的课程数加上当天的课程序号
    lessonNumberInWeek += lessonIndexToday;

    console.log('该科目一周总课程数:', totalLessonsPerWeek);
    console.log('最终计算的课程序号:', lessonNumberInWeek);

    // 构建图片名称
    const imageName = `${teacher}-${selectedSubject}${lessonNumberInWeek}.png`;
    const imagePath = `homework/${imageName}`;

    console.log('尝试加载图片:', imagePath);

    // 尝试加载图片
    const img = new Image();
    img.onload = function() {
        console.log('图片加载成功!');
        homeworkContent.innerHTML = '';

        // 创建容器
        const container = document.createElement('div');
        container.className = 'image-container';

        // 添加图片
        img.classList.add('homework-image');
        container.appendChild(img);

        // 添加全屏按钮
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = '全屏查看';
        fullscreenBtn.onclick = function(e) {
            e.preventDefault(); // 防止事件冒泡
            e.stopPropagation(); // 防止事件冒泡

            console.log('点击全屏按钮', img);

            // 创建一个全屏容器
            const fullscreenContainer = document.createElement('div');
            fullscreenContainer.style.position = 'fixed';
            fullscreenContainer.style.top = '0';
            fullscreenContainer.style.left = '0';
            fullscreenContainer.style.width = '100vw';
            fullscreenContainer.style.height = '100vh';
            fullscreenContainer.style.backgroundColor = '#FFFFFF'; // 纯白色
            fullscreenContainer.style.zIndex = '9999';
            fullscreenContainer.style.overflow = 'auto'; // 添加滚动条

            // 创建一个内容容器，用于居中显示图片
            const contentContainer = document.createElement('div');
            contentContainer.style.display = 'flex';
            contentContainer.style.justifyContent = 'center';
            contentContainer.style.alignItems = 'center';
            contentContainer.style.minWidth = '100%';
            contentContainer.style.minHeight = '100%';
            contentContainer.style.position = 'relative'; // 使其成为定位参考
            contentContainer.style.paddingBottom = '50px'; // 添加底部填充，为控制栏留出空间

            // 克隆图片
            const imgClone = img.cloneNode(true);
            imgClone.style.maxWidth = 'none'; // 允许图片超出屏幕
            imgClone.style.maxHeight = 'none';
            imgClone.style.transformOrigin = 'top left'; // 设置变换原点为左上角

            // 创建图片容器，用于定位图片和画布
            const imageContainer = document.createElement('div');
            imageContainer.style.position = 'relative';
            imageContainer.style.margin = '20px'; // 添加边距，确保图片不会紧贴容器边缘

            // 添加退出按钮
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = 'X';
            closeBtn.style.position = 'fixed';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '10px';
            closeBtn.style.zIndex = '10000';
            closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '50%';
            closeBtn.style.width = '30px';
            closeBtn.style.height = '30px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = function() {
                document.body.removeChild(fullscreenContainer);
            };



            // 创建绘画画布
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.transformOrigin = 'top left'; // 设置变换原点为左上角

            // 创建控制面板
            const controlPanel = document.createElement('div');
            controlPanel.style.position = 'fixed';
            controlPanel.style.bottom = '0'; // 紧贴底部
            controlPanel.style.left = '0';
            controlPanel.style.right = '0';
            controlPanel.style.display = 'flex';
            controlPanel.style.justifyContent = 'center';
            controlPanel.style.alignItems = 'center';
            controlPanel.style.padding = '5px'; // 减少内边距
            controlPanel.style.backgroundColor = 'rgba(51, 51, 51, 0.95)'; // 更深的背景色
            controlPanel.style.zIndex = '10000';
            controlPanel.style.height = '36px'; // 固定高度
            controlPanel.style.boxSizing = 'border-box'; // 确保内边距不会增加高度

            // 创建缩放控制面板
            const zoomControls = document.createElement('div');
            zoomControls.style.display = 'flex';
            zoomControls.style.alignItems = 'center';
            zoomControls.style.margin = '0 5px'; // 减少外边距

            // 创建画笔大小选择器
            const brushSizeSelect = document.createElement('select');
            brushSizeSelect.style.margin = '0 3px';
            brushSizeSelect.style.padding = '1px 2px';
            brushSizeSelect.style.backgroundColor = 'transparent';
            brushSizeSelect.style.color = 'white';
            brushSizeSelect.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            brushSizeSelect.style.borderRadius = '3px';
            brushSizeSelect.style.fontSize = '12px';
            brushSizeSelect.style.height = '24px';
            brushSizeSelect.style.width = '80px'; // 设置固定宽度

            // 添加画笔大小选项
            const brushSizes = [2, 5, 10, 15, 20, 30];
            brushSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.text = `画笔: ${size}px`;
                brushSizeSelect.appendChild(option);
            });
            brushSizeSelect.value = 5; // 默认大小

            // 创建橡皮擦大小选择器
            const eraserSizeSelect = document.createElement('select');
            eraserSizeSelect.style.margin = '0 3px';
            eraserSizeSelect.style.padding = '1px 2px';
            eraserSizeSelect.style.backgroundColor = 'transparent';
            eraserSizeSelect.style.color = 'white';
            eraserSizeSelect.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            eraserSizeSelect.style.borderRadius = '3px';
            eraserSizeSelect.style.fontSize = '12px';
            eraserSizeSelect.style.height = '24px';
            eraserSizeSelect.style.width = '80px'; // 设置固定宽度

            // 添加橡皮擦大小选项
            const eraserSizes = [10, 20, 30, 50, 80, 100];
            eraserSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.text = `橡皮: ${size}px`;
                eraserSizeSelect.appendChild(option);
            });
            eraserSizeSelect.value = 30; // 默认大小

            // 创建颜色选择器
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = '#FF0000'; // 默认红色
            colorPicker.style.margin = '0 3px';
            colorPicker.style.width = '24px';
            colorPicker.style.height = '24px';
            colorPicker.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            colorPicker.style.padding = '0';
            colorPicker.style.backgroundColor = 'transparent';
            colorPicker.style.borderRadius = '3px';
            colorPicker.style.cursor = 'pointer';

            // 缩小按钮
            const zoomOutBtn = document.createElement('button');
            zoomOutBtn.innerHTML = '-';
            zoomOutBtn.style.width = '24px';
            zoomOutBtn.style.height = '24px';
            zoomOutBtn.style.backgroundColor = 'transparent';
            zoomOutBtn.style.color = 'white';
            zoomOutBtn.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            zoomOutBtn.style.borderRadius = '3px';
            zoomOutBtn.style.cursor = 'pointer';
            zoomOutBtn.style.fontSize = '14px';
            zoomOutBtn.style.lineHeight = '1';
            zoomOutBtn.style.padding = '0';
            zoomOutBtn.style.margin = '0 2px';
            zoomOutBtn.title = '缩小';

            // 缩放百分比显示
            const zoomLevel = document.createElement('span');
            zoomLevel.textContent = '100%';
            zoomLevel.style.margin = '0 4px';
            zoomLevel.style.color = 'white';
            zoomLevel.style.fontSize = '12px';
            zoomLevel.style.minWidth = '40px';
            zoomLevel.style.textAlign = 'center';

            // 放大按钮
            const zoomInBtn = document.createElement('button');
            zoomInBtn.innerHTML = '+';
            zoomInBtn.style.width = '24px';
            zoomInBtn.style.height = '24px';
            zoomInBtn.style.backgroundColor = 'transparent';
            zoomInBtn.style.color = 'white';
            zoomInBtn.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            zoomInBtn.style.borderRadius = '3px';
            zoomInBtn.style.cursor = 'pointer';
            zoomInBtn.style.fontSize = '14px';
            zoomInBtn.style.lineHeight = '1';
            zoomInBtn.style.padding = '0';
            zoomInBtn.style.margin = '0 2px';
            zoomInBtn.title = '放大';

            // 最佳显示按钮
            const fitBestBtn = document.createElement('button');
            fitBestBtn.innerHTML = '最佳显示';
            fitBestBtn.style.margin = '0 3px';
            fitBestBtn.style.padding = '0 8px';
            fitBestBtn.style.backgroundColor = 'transparent';
            fitBestBtn.style.color = 'white';
            fitBestBtn.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            fitBestBtn.style.borderRadius = '3px';
            fitBestBtn.style.cursor = 'pointer';
            fitBestBtn.style.fontSize = '12px';
            fitBestBtn.style.height = '24px';
            fitBestBtn.style.lineHeight = '22px';
            fitBestBtn.title = '最佳显示（显示全图）';

            // 宽度适应按钮
            const fitWidthBtn = document.createElement('button');
            fitWidthBtn.innerHTML = '宽度适应';
            fitWidthBtn.style.margin = '0 3px';
            fitWidthBtn.style.padding = '0 8px';
            fitWidthBtn.style.backgroundColor = 'transparent';
            fitWidthBtn.style.color = 'white';
            fitWidthBtn.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            fitWidthBtn.style.borderRadius = '3px';
            fitWidthBtn.style.cursor = 'pointer';
            fitWidthBtn.style.fontSize = '12px';
            fitWidthBtn.style.height = '24px';
            fitWidthBtn.style.lineHeight = '22px';
            fitWidthBtn.title = '宽度适应屏幕';

            // 添加缩放控制元素
            zoomControls.appendChild(zoomOutBtn);
            zoomControls.appendChild(zoomLevel);
            zoomControls.appendChild(zoomInBtn);

            // 创建绘画控制面板
            const drawingControls = document.createElement('div');
            drawingControls.style.display = 'flex';
            drawingControls.style.alignItems = 'center';
            drawingControls.style.marginLeft = '8px';
            drawingControls.style.paddingLeft = '8px';
            drawingControls.style.borderLeft = '1px solid rgba(255, 255, 255, 0.3)';

            // 绘画按钮
            const drawBtn = document.createElement('button');
            drawBtn.innerHTML = '绘画';
            drawBtn.style.margin = '0 3px';
            drawBtn.style.padding = '0 8px';
            drawBtn.style.backgroundColor = 'transparent';
            drawBtn.style.color = 'white';
            drawBtn.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            drawBtn.style.borderRadius = '3px';
            drawBtn.style.cursor = 'pointer';
            drawBtn.style.fontSize = '12px';
            drawBtn.style.height = '24px';
            drawBtn.style.lineHeight = '22px';

            // 橡皮擦按钮
            const eraserBtn = document.createElement('button');
            eraserBtn.innerHTML = '橡皮擦';
            eraserBtn.style.margin = '0 3px';
            eraserBtn.style.padding = '0 8px';
            eraserBtn.style.backgroundColor = 'transparent';
            eraserBtn.style.color = 'white';
            eraserBtn.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            eraserBtn.style.borderRadius = '3px';
            eraserBtn.style.cursor = 'pointer';
            eraserBtn.style.fontSize = '12px';
            eraserBtn.style.height = '24px';
            eraserBtn.style.lineHeight = '22px';

            // 清空按钮
            const clearBtn = document.createElement('button');
            clearBtn.innerHTML = '清空';
            clearBtn.style.margin = '0 3px';
            clearBtn.style.padding = '0 8px';
            clearBtn.style.backgroundColor = 'transparent';
            clearBtn.style.color = 'white';
            clearBtn.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            clearBtn.style.borderRadius = '3px';
            clearBtn.style.cursor = 'pointer';
            clearBtn.style.fontSize = '12px';
            clearBtn.style.height = '24px';
            clearBtn.style.lineHeight = '22px';

            // 添加绘画控制元素，按照新的顺序排列
            drawingControls.appendChild(drawBtn);
            drawingControls.appendChild(colorPicker);
            drawingControls.appendChild(brushSizeSelect); // 画笔大小选框移动到颜色和橡皮擦之间
            drawingControls.appendChild(eraserBtn);
            drawingControls.appendChild(eraserSizeSelect); // 橡皮擦大小选框移动到橡皮擦和清空之间
            drawingControls.appendChild(clearBtn);

            // 添加所有控制元素到控制面板
            controlPanel.appendChild(zoomControls);
            controlPanel.appendChild(fitBestBtn);
            controlPanel.appendChild(fitWidthBtn);
            controlPanel.appendChild(drawingControls);

            // 添加图片和画布到图片容器
            imageContainer.appendChild(imgClone);
            imageContainer.appendChild(canvas);

            // 添加图片容器到内容容器
            contentContainer.appendChild(imageContainer);

            // 添加内容容器到全屏容器
            fullscreenContainer.appendChild(contentContainer);

            // 添加控制元素到全屏容器
            fullscreenContainer.appendChild(closeBtn);
            fullscreenContainer.appendChild(controlPanel);

            // 添加容器到文档
            document.body.appendChild(fullscreenContainer);

            // 初始化绘画功能
            const ctx = canvas.getContext('2d');
            let isDrawing = false;
            let isDrawingMode = false;
            let isErasing = false;
            let lastX, lastY;
            let brushSize = parseInt(brushSizeSelect.value);
            let eraserSize = parseInt(eraserSizeSelect.value);
            let brushColor = colorPicker.value;
            let currentScale = 1;

            // 监听画笔大小变化
            brushSizeSelect.addEventListener('change', function() {
                brushSize = parseInt(this.value);
            });

            // 监听橡皮擦大小变化
            eraserSizeSelect.addEventListener('change', function() {
                eraserSize = parseInt(this.value);
            });

            // 监听颜色变化
            colorPicker.addEventListener('change', function() {
                brushColor = this.value;
            });

            // 缩小按钮点击事件
            zoomOutBtn.onclick = function() {
                currentScale = Math.max(0.1, currentScale - 0.1);
                imgClone.style.transform = `scale(${currentScale})`;
                zoomLevel.textContent = `${Math.round(currentScale * 100)}%`;
                updateCanvasSize();
            };

            // 放大按钮点击事件
            zoomInBtn.onclick = function() {
                currentScale = Math.min(5, currentScale + 0.1);
                imgClone.style.transform = `scale(${currentScale})`;
                zoomLevel.textContent = `${Math.round(currentScale * 100)}%`;
                updateCanvasSize();
            };

            // 最佳显示按钮点击事件
            fitBestBtn.onclick = function() {
                // 获取容器和图片的尺寸
                const containerWidth = fullscreenContainer.clientWidth - 40; // 减去边距
                const containerHeight = fullscreenContainer.clientHeight - 40; // 减去边距
                const imgWidth = imgClone.naturalWidth;
                const imgHeight = imgClone.naturalHeight;

                // 计算缩放比例，选择较小的缩放比例以确保图片完全适应屏幕
                const widthRatio = containerWidth / imgWidth;
                const heightRatio = containerHeight / imgHeight;
                currentScale = Math.min(widthRatio, heightRatio) * 0.9;

                imgClone.style.transform = `scale(${currentScale})`;
                zoomLevel.textContent = `${Math.round(currentScale * 100)}%`;
                updateCanvasSize();

                // 将图片容器居中
                imageContainer.style.width = imgWidth * currentScale + 'px';
                imageContainer.style.height = imgHeight * currentScale + 'px';
                contentContainer.scrollTop = 0;
                contentContainer.scrollLeft = 0;
            };

            // 宽度适应按钮点击事件
            fitWidthBtn.onclick = function() {
                // 获取容器和图片的尺寸
                const containerWidth = fullscreenContainer.clientWidth - 40; // 减去边距
                const imgWidth = imgClone.naturalWidth;
                const imgHeight = imgClone.naturalHeight;

                // 计算缩放比例，使图片宽度适应屏幕
                currentScale = containerWidth / imgWidth * 0.95;

                imgClone.style.transform = `scale(${currentScale})`;
                zoomLevel.textContent = `${Math.round(currentScale * 100)}%`;
                updateCanvasSize();

                // 设置图片容器尺寸
                imageContainer.style.width = imgWidth * currentScale + 'px';
                imageContainer.style.height = imgHeight * currentScale + 'px';
                contentContainer.scrollTop = 0;
                contentContainer.scrollLeft = 0;
            };

            // 更新画布尺寸
            function updateCanvasSize() {
                const imgWidth = imgClone.naturalWidth;
                const imgHeight = imgClone.naturalHeight;

                // 保存当前绘图数据
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(canvas, 0, 0);

                // 设置画布尺寸为图片原始尺寸
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                canvas.style.width = imgWidth + 'px';
                canvas.style.height = imgHeight + 'px';
                canvas.style.transform = `scale(${currentScale})`;

                // 恢复绘图数据
                const ctx = canvas.getContext('2d');
                if (tempCanvas.width > 0 && tempCanvas.height > 0) {
                    ctx.drawImage(tempCanvas, 0, 0);
                }

                // 设置图片容器尺寸
                imageContainer.style.width = imgWidth * currentScale + 'px';
                imageContainer.style.height = imgHeight * currentScale + 'px';
            }

            // 默认使用最佳显示
            setTimeout(function() {
                fitBestBtn.click();
            }, 100);

            // 确保控制面板和退出按钮始终可见
            fullscreenContainer.addEventListener('scroll', function() {
                // 控制面板始终固定在底部
                controlPanel.style.position = 'fixed';
                controlPanel.style.bottom = '0'; // 改为0，紧贴底部

                // 退出按钮始终固定在右上角
                closeBtn.style.position = 'fixed';
                closeBtn.style.top = '10px';
                closeBtn.style.right = '10px';
            });

            // 创建显示/隐藏控制面板的功能
            let isControlsVisible = true; // 初始状态为显示

            function showControls() {
                controlPanel.style.opacity = '1';
                closeBtn.style.opacity = '1';
                isControlsVisible = true;
                if (toggleControlsBtn) {
                    toggleControlsBtn.innerHTML = '隐藏控制栏';
                }
            }

            function hideControls() {
                if (!isDrawingMode) { // 只有在非绘画模式下才隐藏控制面板
                    controlPanel.style.opacity = '0';
                    closeBtn.style.opacity = '0';
                    isControlsVisible = false;
                    if (toggleControlsBtn) {
                        toggleControlsBtn.innerHTML = '显示控制栏';
                    }
                }
            }

            function toggleControls() {
                if (isControlsVisible) {
                    hideControls();
                } else {
                    showControls();
                }
            }

            // 创建切换控制栏显示/隐藏的按钮
            const toggleControlsBtn = document.createElement('button');
            toggleControlsBtn.innerHTML = '隐藏控制栏';
            toggleControlsBtn.style.position = 'fixed';
            toggleControlsBtn.style.top = '10px';
            toggleControlsBtn.style.left = '10px';
            toggleControlsBtn.style.zIndex = '10000';
            toggleControlsBtn.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
            toggleControlsBtn.style.color = 'white';
            toggleControlsBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            toggleControlsBtn.style.borderRadius = '3px';
            toggleControlsBtn.style.padding = '2px 8px';
            toggleControlsBtn.style.cursor = 'pointer';
            toggleControlsBtn.style.fontSize = '12px';
            toggleControlsBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            toggleControlsBtn.onclick = toggleControls;

            // 初始显示控制面板
            showControls();

            // 添加切换按钮到全屏容器
            fullscreenContainer.appendChild(toggleControlsBtn);

            // 绘画按钮点击事件
            drawBtn.onclick = function() {
                isDrawingMode = !isDrawingMode;
                isErasing = false;

                if (isDrawingMode) {
                    canvas.style.pointerEvents = 'auto';
                    canvas.style.cursor = 'crosshair'; // 十字光标指针
                    drawBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    eraserBtn.style.backgroundColor = 'transparent';

                    // 在绘画模式下始终显示控制面板
                    showControls();
                } else {
                    canvas.style.pointerEvents = 'none';
                    canvas.style.cursor = 'default'; // 默认指针
                    drawBtn.style.backgroundColor = 'transparent';
                }
            };

            // 创建自定义橡皮擦光标
            function createEraserCursor(size) {
                // 创建一个画布元素
                const cursorCanvas = document.createElement('canvas');
                const cursorSize = size * 1.5; // 增大光标尺寸以便于观察
                cursorCanvas.width = cursorSize;
                cursorCanvas.height = cursorSize;

                // 获取绘图上下文
                const cursorCtx = cursorCanvas.getContext('2d');

                // 计算矩形尺寸
                const rectWidth = size * 0.8;
                const rectHeight = size * 1.2;
                const radius = size * 0.3;

                // 绘制圆角矩形，以左上角为起点
                const margin = 5; // 留出一些边距，使光标更易看清
                cursorCtx.beginPath();
                cursorCtx.moveTo(margin + radius, margin);
                cursorCtx.lineTo(margin + rectWidth - radius, margin);
                cursorCtx.arcTo(margin + rectWidth, margin, margin + rectWidth, margin + radius, radius);
                cursorCtx.lineTo(margin + rectWidth, margin + rectHeight - radius);
                cursorCtx.arcTo(margin + rectWidth, margin + rectHeight, margin + rectWidth - radius, margin + rectHeight, radius);
                cursorCtx.lineTo(margin + radius, margin + rectHeight);
                cursorCtx.arcTo(margin, margin + rectHeight, margin, margin + rectHeight - radius, radius);
                cursorCtx.lineTo(margin, margin + radius);
                cursorCtx.arcTo(margin, margin, margin + radius, margin, radius);
                cursorCtx.closePath();

                // 填充半透明的白色
                cursorCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                cursorCtx.fill();

                // 绘制边框
                cursorCtx.strokeStyle = 'black';
                cursorCtx.lineWidth = 1;
                cursorCtx.stroke();

                // 转换为数据 URL
                return cursorCanvas.toDataURL();
            }

            // 橡皮擦按钮点击事件
            eraserBtn.onclick = function() {
                isErasing = !isErasing;

                if (isErasing) {
                    isDrawingMode = true;
                    canvas.style.pointerEvents = 'auto';

                    // 创建自定义橡皮擦光标
                    const eraserCursorUrl = createEraserCursor(eraserSize);
                    // 将热点设置在圆角矩形的左上角，而不是中心
                    canvas.style.cursor = `url('${eraserCursorUrl}') 0 0, auto`;

                    eraserBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    drawBtn.style.backgroundColor = 'transparent';

                    // 在橡皮擦模式下始终显示控制面板
                    showControls();

                    // 监听橡皮擦大小变化，更新光标
                    eraserSizeSelect.onchange = function() {
                        eraserSize = parseInt(this.value);
                        const newEraserCursorUrl = createEraserCursor(eraserSize);
                        // 将热点设置在圆角矩形的左上角，而不是中心
                        canvas.style.cursor = `url('${newEraserCursorUrl}') 0 0, auto`;
                    };
                } else {
                    eraserBtn.style.backgroundColor = 'transparent';
                    if (isDrawingMode) {
                        canvas.style.cursor = 'crosshair'; // 十字光标指针
                        drawBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

                        // 仍然在绘画模式，始终显示控制面板
                        showControls();

                        // 移除橡皮擦大小变化监听器
                        eraserSizeSelect.onchange = function() {
                            eraserSize = parseInt(this.value);
                        };
                    }
                }
            };

            // 清空按钮点击事件
            clearBtn.onclick = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            };

            // 绘画事件
            canvas.addEventListener('mousedown', function(e) {
                if (!isDrawingMode) return;

                isDrawing = true;

                // 获取鼠标相对于文档的坐标
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                // 获取图片容器相对于文档的位置
                const containerRect = imageContainer.getBoundingClientRect();

                // 计算鼠标相对于图片容器的位置，考虑滚动
                lastX = (mouseX - containerRect.left) / currentScale;
                lastY = (mouseY - containerRect.top) / currentScale;

                console.log('Mouse down at:', lastX, lastY);
            });

            canvas.addEventListener('mousemove', function(e) {
                if (!isDrawingMode || !isDrawing) return;

                // 获取鼠标相对于文档的坐标
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                // 获取图片容器相对于文档的位置
                const containerRect = imageContainer.getBoundingClientRect();

                // 计算鼠标相对于图片容器的位置，考虑滚动
                const x = (mouseX - containerRect.left) / currentScale;
                const y = (mouseY - containerRect.top) / currentScale;

                if (isErasing) {
                    // 橡皮擦模式 - 使用矩形
                    const currentEraserSize = eraserSize / currentScale; // 调整大小以适应缩放
                    ctx.globalCompositeOperation = 'destination-out';

                    // 绘制圆角矩形
                    const rectWidth = currentEraserSize * 0.8;
                    const rectHeight = currentEraserSize * 1.2;
                    const radius = currentEraserSize * 0.3;

                    // 保存当前状态
                    ctx.save();

                    // 创建圆角矩形路径，以鼠标位置为左上角
                    ctx.beginPath();
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + rectWidth - radius, y);
                    ctx.arcTo(x + rectWidth, y, x + rectWidth, y + radius, radius);
                    ctx.lineTo(x + rectWidth, y + rectHeight - radius);
                    ctx.arcTo(x + rectWidth, y + rectHeight, x + rectWidth - radius, y + rectHeight, radius);
                    ctx.lineTo(x + radius, y + rectHeight);
                    ctx.arcTo(x, y + rectHeight, x, y + rectHeight - radius, radius);
                    ctx.lineTo(x, y + radius);
                    ctx.arcTo(x, y, x + radius, y, radius);
                    ctx.closePath();

                    // 填充矩形
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fill();

                    // 恢复状态
                    ctx.restore();
                } else {
                    // 绘画模式 - 使用线条
                    const currentBrushSize = brushSize / currentScale; // 调整线宽以适应缩放

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = brushColor;
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.lineWidth = currentBrushSize;

                    ctx.beginPath();
                    ctx.moveTo(lastX, lastY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }

                lastX = x;
                lastY = y;
            });

            canvas.addEventListener('mouseup', function() {
                isDrawing = false;
            });

            canvas.addEventListener('mouseout', function() {
                isDrawing = false;
            });
        };
        container.appendChild(fullscreenBtn);

        homeworkContent.appendChild(container);
    };

    img.onerror = function() {
        console.error('图片加载失败:', imagePath);
        homeworkContent.innerHTML = `
            <div class="no-homework-message">
                <p>作业还未上传，请课代表及时提醒老师！</p>
                <div class="debug-info">
                    <p><strong>调试信息:</strong></p>
                    <p>尝试加载的图片: ${imageName}</p>
                    <p>教师: ${teacher}</p>
                    <p>科目: ${selectedSubject}</p>
                    <p>一周内第几次课: ${lessonNumberInWeek}</p>
                </div>
            </div>`;
    };

    img.src = imagePath;
}

// 创建自定义全屏视图
function createFullScreenView(element) {
    console.log('创建全屏视图', element);
    // 检查是否已经存在全屏容器，如果存在则先移除
    const existingContainer = document.getElementById('fullscreen-container');
    if (existingContainer) {
        document.body.removeChild(existingContainer);
    }

    // 创建全屏容器
    const fullscreenContainer = document.createElement('div');
    fullscreenContainer.className = 'fullscreen-container';
    fullscreenContainer.id = 'fullscreen-container';
    fullscreenContainer.style.position = 'fixed';
    fullscreenContainer.style.top = '0';
    fullscreenContainer.style.left = '0';
    fullscreenContainer.style.width = '100vw';
    fullscreenContainer.style.height = '100vh';
    fullscreenContainer.style.backgroundColor = 'white';
    fullscreenContainer.style.zIndex = '9999';
    fullscreenContainer.style.overflow = 'auto';

    // 创建图片容器
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    imageWrapper.style.padding = '0';
    imageWrapper.style.boxSizing = 'border-box';
    imageWrapper.style.overflow = 'auto';
    imageWrapper.style.width = '100%';
    imageWrapper.style.height = '100%';
    imageWrapper.style.display = 'flex';
    imageWrapper.style.justifyContent = 'center';
    imageWrapper.style.alignItems = 'flex-start';

    // 克隆图片元素
    const imgClone = element.cloneNode(true);
    imgClone.id = 'fullscreen-image';
    imgClone.style.transformOrigin = 'top left';
    imgClone.style.margin = '0';
    imgClone.style.maxWidth = '100%';
    imgClone.style.maxHeight = '100vh';

    // 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.className = 'fullscreen-controls';
    controlPanel.style.position = 'fixed';
    controlPanel.style.bottom = '0';
    controlPanel.style.left = '0';
    controlPanel.style.right = '0';
    controlPanel.style.display = 'flex';
    controlPanel.style.justifyContent = 'center';
    controlPanel.style.alignItems = 'center';
    controlPanel.style.padding = '10px';
    controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    controlPanel.style.zIndex = '10000';

    // 退出全屏按钮
    const exitBtn = document.createElement('button');
    exitBtn.className = 'exit-fullscreen-btn';
    exitBtn.innerHTML = 'X';
    exitBtn.title = '退出全屏';
    exitBtn.style.position = 'fixed';
    exitBtn.style.top = '10px';
    exitBtn.style.right = '10px';
    exitBtn.style.zIndex = '10001';
    exitBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    exitBtn.style.color = 'white';
    exitBtn.style.border = 'none';
    exitBtn.style.borderRadius = '50%';
    exitBtn.style.width = '30px';
    exitBtn.style.height = '30px';
    exitBtn.style.cursor = 'pointer';
    exitBtn.onclick = function() {
        closeFullScreenView();
    };

    // 最佳显示按钮
    const fitWidthBtn = document.createElement('button');
    fitWidthBtn.className = 'fit-width-btn';
    fitWidthBtn.innerHTML = '最佳显示';
    fitWidthBtn.title = '最佳显示（显示全图）';
    fitWidthBtn.style.margin = '0 5px';
    fitWidthBtn.style.padding = '5px 10px';
    fitWidthBtn.style.backgroundColor = 'transparent';
    fitWidthBtn.style.color = 'white';
    fitWidthBtn.style.border = '1px solid white';
    fitWidthBtn.style.borderRadius = '4px';
    fitWidthBtn.style.cursor = 'pointer';
    fitWidthBtn.onclick = function() {
        fitImageBest(imgClone, fullscreenContainer);
    };

    // 宽度适应按钮
    const fitScreenWidthBtn = document.createElement('button');
    fitScreenWidthBtn.className = 'fit-screen-width-btn';
    fitScreenWidthBtn.innerHTML = '宽度适应';
    fitScreenWidthBtn.title = '宽度适应屏幕';
    fitScreenWidthBtn.style.margin = '0 5px';
    fitScreenWidthBtn.style.padding = '5px 10px';
    fitScreenWidthBtn.style.backgroundColor = 'transparent';
    fitScreenWidthBtn.style.color = 'white';
    fitScreenWidthBtn.style.border = '1px solid white';
    fitScreenWidthBtn.style.borderRadius = '4px';
    fitScreenWidthBtn.style.cursor = 'pointer';
    fitScreenWidthBtn.onclick = function() {
        fitImageWidth(imgClone, fullscreenContainer);
    };

    // 缩放控制按钮
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.style.display = 'flex';
    zoomControls.style.alignItems = 'center';
    zoomControls.style.margin = '0 10px';

    // 缩小按钮
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'zoom-btn';
    zoomOutBtn.innerHTML = '-';
    zoomOutBtn.title = '缩小';
    zoomOutBtn.style.width = '30px';
    zoomOutBtn.style.height = '30px';
    zoomOutBtn.style.backgroundColor = 'transparent';
    zoomOutBtn.style.color = 'white';
    zoomOutBtn.style.border = '1px solid white';
    zoomOutBtn.style.borderRadius = '4px';
    zoomOutBtn.style.cursor = 'pointer';
    zoomOutBtn.onclick = function() {
        zoomImage(imgClone, -0.1);
    };

    // 缩放百分比显示
    const zoomLevel = document.createElement('span');
    zoomLevel.className = 'zoom-level';
    zoomLevel.id = 'zoom-level';
    zoomLevel.textContent = '100%';
    zoomLevel.style.margin = '0 10px';
    zoomLevel.style.color = 'white';

    // 放大按钮
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'zoom-btn';
    zoomInBtn.innerHTML = '+';
    zoomInBtn.title = '放大';
    zoomInBtn.style.width = '30px';
    zoomInBtn.style.height = '30px';
    zoomInBtn.style.backgroundColor = 'transparent';
    zoomInBtn.style.color = 'white';
    zoomInBtn.style.border = '1px solid white';
    zoomInBtn.style.borderRadius = '4px';
    zoomInBtn.style.cursor = 'pointer';
    zoomInBtn.onclick = function() {
        zoomImage(imgClone, 0.1);
    };

    // 添加缩放控制元素
    zoomControls.appendChild(zoomOutBtn);
    zoomControls.appendChild(zoomLevel);
    zoomControls.appendChild(zoomInBtn);

    // 创建绘画控制面板
    const drawingControls = document.createElement('div');
    drawingControls.className = 'drawing-controls';
    drawingControls.style.display = 'flex';
    drawingControls.style.alignItems = 'center';
    drawingControls.style.marginLeft = '15px';
    drawingControls.style.paddingLeft = '15px';
    drawingControls.style.borderLeft = '1px solid rgba(255, 255, 255, 0.3)';

    // 绘画按钮
    const drawBtn = document.createElement('button');
    drawBtn.innerHTML = '绘画';
    drawBtn.title = '绘画模式';
    drawBtn.style.margin = '0 5px';
    drawBtn.style.padding = '5px 10px';
    drawBtn.style.backgroundColor = 'transparent';
    drawBtn.style.color = 'white';
    drawBtn.style.border = '1px solid white';
    drawBtn.style.borderRadius = '4px';
    drawBtn.style.cursor = 'pointer';
    drawBtn.onclick = function() {
        toggleDrawingMode(drawingCanvas, drawBtn, eraserBtn);
    };

    // 橡皮擦按钮
    const eraserBtn = document.createElement('button');
    eraserBtn.innerHTML = '橡皮擦';
    eraserBtn.title = '橡皮擦模式';
    eraserBtn.style.margin = '0 5px';
    eraserBtn.style.padding = '5px 10px';
    eraserBtn.style.backgroundColor = 'transparent';
    eraserBtn.style.color = 'white';
    eraserBtn.style.border = '1px solid white';
    eraserBtn.style.borderRadius = '4px';
    eraserBtn.style.cursor = 'pointer';
    eraserBtn.onclick = function() {
        toggleEraserMode(drawingCanvas, drawBtn, eraserBtn);
    };

    // 清空按钮
    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '清空';
    clearBtn.title = '清空所有绘画';
    clearBtn.style.margin = '0 5px';
    clearBtn.style.padding = '5px 10px';
    clearBtn.style.backgroundColor = 'transparent';
    clearBtn.style.color = 'white';
    clearBtn.style.border = '1px solid white';
    clearBtn.style.borderRadius = '4px';
    clearBtn.style.cursor = 'pointer';
    clearBtn.onclick = function() {
        clearDrawing(drawingCanvas);
    };

    // 画笔粗细选择
    const brushSizeSelect = document.createElement('select');
    brushSizeSelect.title = '画笔粗细';
    brushSizeSelect.style.margin = '0 5px';
    brushSizeSelect.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    brushSizeSelect.style.border = '1px solid rgba(255, 255, 255, 0.5)';
    brushSizeSelect.style.borderRadius = '4px';
    brushSizeSelect.style.color = 'white';
    brushSizeSelect.style.padding = '3px';
    const brushSizes = [1, 3, 5, 8, 12, 20];
    brushSizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.text = `${size}px`;
        if (size === 5) { // 默认选中5px
            option.selected = true;
        }
        brushSizeSelect.appendChild(option);
    });

    // 画笔颜色选择
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = '#FF0000'; // 默认红色
    colorPicker.title = '画笔颜色';
    colorPicker.style.margin = '0 5px';
    colorPicker.style.width = '30px';
    colorPicker.style.height = '25px';
    colorPicker.style.padding = '0 2px';
    colorPicker.style.cursor = 'pointer';

    // 添加绘画控制元素
    drawingControls.appendChild(drawBtn);
    drawingControls.appendChild(eraserBtn);
    drawingControls.appendChild(clearBtn);
    drawingControls.appendChild(document.createTextNode('粗细:'));
    drawingControls.appendChild(brushSizeSelect);
    drawingControls.appendChild(document.createTextNode('颜色:'));
    drawingControls.appendChild(colorPicker);

    // 添加所有控制元素到控制面板
    controlPanel.appendChild(zoomControls);
    controlPanel.appendChild(fitWidthBtn);
    controlPanel.appendChild(fitScreenWidthBtn);
    controlPanel.appendChild(drawingControls);

    // 创建绘画画布
    drawingCanvas = document.createElement('canvas');
    drawingCanvas.className = 'drawing-canvas';
    drawingCanvas.style.position = 'absolute';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    drawingCanvas.style.pointerEvents = 'none'; // 默认不响应鼠标事件
    drawingCanvas.width = imgClone.width;
    drawingCanvas.height = imgClone.height;

    // 添加元素到全屏容器
    imageWrapper.appendChild(imgClone);
    imageWrapper.appendChild(drawingCanvas);
    fullscreenContainer.appendChild(imageWrapper);
    fullscreenContainer.appendChild(exitBtn);
    fullscreenContainer.appendChild(controlPanel);

    // 初始化绘画画布
    initDrawingCanvas(drawingCanvas, imgClone, brushSizeSelect, colorPicker);

    // 添加到文档中
    document.body.appendChild(fullscreenContainer);

    // 显示控制面板
    controlPanel.style.opacity = '1';

    // 默认使用最佳显示
    setTimeout(() => {
        fitImageBest(imgClone, fullscreenContainer);
    }, 100);

    // 添加鼠标移动事件，显示/隐藏控制面板
    const controlTimeout = setTimeout(function() {
        controlPanel.style.opacity = '0';
        exitBtn.style.opacity = '0';
    }, 3000);

    fullscreenContainer.addEventListener('mousemove', function() {
        controlPanel.style.opacity = '1';
        exitBtn.style.opacity = '1';

        clearTimeout(controlTimeout);

        setTimeout(function() {
            controlPanel.style.opacity = '0';
            exitBtn.style.opacity = '0';
        }, 3000);
    });

    return fullscreenContainer;
}

// 关闭全屏视图
function closeFullScreenView() {
    const container = document.getElementById('fullscreen-container');
    if (container) {
        document.body.removeChild(container);
    }
}

// 最佳显示图片
function fitImageBest(img, container) {
    if (!img || !container) return;

    // 获取容器和图片的尺寸
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imgNaturalWidth = img.naturalWidth || img.width;
    const imgNaturalHeight = img.naturalHeight || img.height;

    // 计算缩放比例，选择较小的缩放比例以确保图片完全适应屏幕
    const widthRatio = (containerWidth - 40) / imgNaturalWidth; // 保留左右边距
    const heightRatio = (containerHeight - 40) / imgNaturalHeight; // 保留上下边距
    const scale = Math.min(widthRatio, heightRatio) * 0.9; // 乘以0.9留出适当空间

    // 设置图片缩放
    img.style.transform = `scale(${scale})`;
    img.dataset.scale = scale;

    // 更新缩放百分比显示
    const zoomLevel = document.getElementById('zoom-level');
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(scale * 100)}%`;
    }
}

// 宽度适应屏幕
function fitImageWidth(img, container) {
    if (!img || !container) return;

    // 获取容器和图片的尺寸
    const containerWidth = container.clientWidth;
    const imgNaturalWidth = img.naturalWidth || img.width;

    // 计算缩放比例，使图片宽度适应屏幕
    const scale = (containerWidth - 40) / imgNaturalWidth * 0.95; // 保留左右边距

    // 设置图片缩放
    img.style.transform = `scale(${scale})`;
    img.dataset.scale = scale;

    // 更新缩放百分比显示
    const zoomLevel = document.getElementById('zoom-level');
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(scale * 100)}%`;
    }
}

// 缩放图片
function zoomImage(img, delta) {
    if (!img) return;

    // 获取当前缩放比例
    let currentScale = parseFloat(img.dataset.scale || 1);

    // 计算新的缩放比例
    const newScale = Math.max(0.1, Math.min(5, currentScale + delta));

    // 设置图片缩放
    img.style.transform = `scale(${newScale})`;
    img.dataset.scale = newScale;

    // 更新缩放百分比显示
    const zoomLevel = document.getElementById('zoom-level');
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(newScale * 100)}%`;
    }
}

// 初始化绘画画布
function initDrawingCanvas(canvas, img, brushSizeSelect, colorPicker) {
    if (!canvas || !img) return;

    // 设置画布尺寸
    canvas.width = img.width;
    canvas.height = img.height;

    // 获取绘图上下文
    drawingContext = canvas.getContext('2d');

    // 绘画相关变量
    let isDrawing = false;
    let isDrawingMode = false;
    let isErasing = false;
    let lastX, lastY;
    let brushSize = parseInt(brushSizeSelect ? brushSizeSelect.value : 5);
    let brushColor = colorPicker ? colorPicker.value : '#FF0000';

    // 添加绘画事件监听器
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // 监听画笔粗细和颜色变化
    if (brushSizeSelect) {
        brushSizeSelect.addEventListener('change', function() {
            brushSize = parseInt(this.value);
        });
    }

    if (colorPicker) {
        colorPicker.addEventListener('change', function() {
            brushColor = this.value;
        });
    }

    // 开始绘画
    function startDrawing(e) {
        if (!isDrawingMode) return;

        isDrawing = true;

        // 获取鼠标相对于画布的位置
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    }

    // 绘画
    function draw(e) {
        if (!isDrawingMode || !isDrawing) return;

        // 获取鼠标相对于画布的位置
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 设置绘图属性
        drawingContext.lineJoin = 'round';
        drawingContext.lineCap = 'round';
        drawingContext.lineWidth = brushSize;

        if (isErasing) {
            // 橡皮擦模式
            drawingContext.globalCompositeOperation = 'destination-out';
            drawingContext.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            // 绘画模式
            drawingContext.globalCompositeOperation = 'source-over';
            drawingContext.strokeStyle = brushColor;
        }

        // 绘制线条
        drawingContext.beginPath();
        drawingContext.moveTo(lastX, lastY);
        drawingContext.lineTo(x, y);
        drawingContext.stroke();

        // 更新位置
        lastX = x;
        lastY = y;
    }

    // 停止绘画
    function stopDrawing() {
        isDrawing = false;
    }

    // 切换绘画模式
    window.toggleDrawingMode = function(canvas, drawBtn, eraserBtn) {
        isDrawingMode = !isDrawingMode;
        isErasing = false;

        if (isDrawingMode) {
            canvas.style.pointerEvents = 'auto';
            drawBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            eraserBtn.style.backgroundColor = 'transparent';
        } else {
            canvas.style.pointerEvents = 'none';
            drawBtn.style.backgroundColor = 'transparent';
        }
    };

    // 切换橡皮擦模式
    window.toggleEraserMode = function(canvas, drawBtn, eraserBtn) {
        isErasing = !isErasing;

        if (isErasing) {
            isDrawingMode = true;
            canvas.style.pointerEvents = 'auto';
            eraserBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            drawBtn.style.backgroundColor = 'transparent';
        } else {
            eraserBtn.style.backgroundColor = 'transparent';
            if (isDrawingMode) {
                drawBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }
        }
    };

    // 清空绘图
    window.clearDrawing = function(canvas) {
        if (!drawingContext) return;
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);
    };

    return {
        toggleDrawingMode: function() {
            toggleDrawingMode(canvas, drawBtn, eraserBtn);
        },
        toggleEraserMode: function() {
            toggleEraserMode(canvas, drawBtn, eraserBtn);
        },
        clearDrawing: function() {
            clearDrawing(canvas);
        }
    };
}

// 处理全屏状态变化
function handleFullscreenChange() {
    console.log('全屏状态变化');
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {

        console.log('检测到退出全屏状态');
        // 移除全屏容器
        const container = document.getElementById('fullscreen-container');
        if (container) {
            console.log('移除全屏容器');
            document.body.removeChild(container);
        }

        // 移除事件监听器
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);

        // 重置绘画相关变量
        isDrawingMode = false;
        isErasing = false;
        isDrawing = false;
        drawingCanvas = null;
        drawingContext = null;
    }
}

// 缩放图片
function zoomImage(delta) {
    const newZoom = Math.max(0.5, Math.min(3, window.currentZoom + delta));
    setZoomLevel(newZoom);
}

// 设置缩放级别
function setZoomLevel(zoom) {
    window.currentZoom = zoom;

    const img = document.getElementById('fullscreen-image');
    const zoomLevel = document.getElementById('zoom-level');
    const zoomSlider = document.querySelector('.zoom-slider');
    const imageWrapper = document.querySelector('.image-wrapper');

    if (img && zoomLevel) {
        zoomLevel.textContent = `${Math.round(zoom * 100)}%`;

        if (zoomSlider) {
            zoomSlider.value = zoom;
        }

        // 记录当前滚动位置的百分比
        let scrollPercentX = 0;
        let scrollPercentY = 0;

        if (imageWrapper) {
            // 如果已经有滚动，记录当前滚动位置的百分比
            if (imageWrapper.scrollWidth > imageWrapper.clientWidth) {
                scrollPercentX = imageWrapper.scrollLeft / (imageWrapper.scrollWidth - imageWrapper.clientWidth);
            }
            if (imageWrapper.scrollHeight > imageWrapper.clientHeight) {
                scrollPercentY = imageWrapper.scrollTop / (imageWrapper.scrollHeight - imageWrapper.clientHeight);
            }
        }

        // 确保图片居中并设置缩放
        img.style.position = 'relative';
        img.style.transform = `scale(${zoom})`;
        img.style.transformOrigin = 'top left'; // 改为以左上角为原点进行缩放

        // 调整图片容器的滚动位置
        if (imageWrapper) {
            // 等待图片缩放完成后再调整滚动位置
            setTimeout(() => {
                if (zoom > 1) {
                    // 在放大时，确保可以滚动到图片的所有边界
                    // 如果用户已经滚动过，保持相对滚动位置
                    if (scrollPercentX > 0 || scrollPercentY > 0) {
                        if (imageWrapper.scrollWidth > imageWrapper.clientWidth) {
                            imageWrapper.scrollLeft = scrollPercentX * (imageWrapper.scrollWidth - imageWrapper.clientWidth);
                        }
                        if (imageWrapper.scrollHeight > imageWrapper.clientHeight) {
                            imageWrapper.scrollTop = scrollPercentY * (imageWrapper.scrollHeight - imageWrapper.clientHeight);
                        }
                    } else {
                        // 如果用户还没有滚动，默认滚动到左上角
                        imageWrapper.scrollLeft = 0;
                        imageWrapper.scrollTop = 0;
                    }
                } else {
                    // 当缩小到最小时，确保图片完全可见
                    imageWrapper.scrollLeft = 0;
                    imageWrapper.scrollTop = 0;
                }
            }, 10);
        }
    }
}

// 图片宽度适应屏幕 - 最佳显示（同时考虑宽度和高度）
function fitImageToWidth() {
    const img = document.getElementById('fullscreen-image');
    const container = document.getElementById('fullscreen-container');
    const imageWrapper = document.querySelector('.image-wrapper');

    if (img && container) {
        // 获取容器和图片的尺寸
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const imgNaturalWidth = img.naturalWidth;
        const imgNaturalHeight = img.naturalHeight;

        // 计算缩放比例，选择较小的缩放比例以确保图片完全适应屏幕
        // 减去边距以确保图片在放大时可以看到所有边界
        const widthRatio = (containerWidth - 120) / imgNaturalWidth; // 保留左右边距
        const heightRatio = (containerHeight - 20) / imgNaturalHeight; // 减少上下边距
        const zoom = Math.min(widthRatio, heightRatio) * 0.9; // 乘以0.9留出适当空间

        // 设置缩放级别
        setZoomLevel(zoom);

        // 重置滚动位置并确保图片居中
        if (imageWrapper) {
            // 等待图片缩放完成后再调整滚动位置
            setTimeout(() => {
                // 默认滚动到左上角，确保可以看到图片的左上角
                imageWrapper.scrollLeft = 0;
                imageWrapper.scrollTop = 0;
            }, 10);
        }
    }
}

// 图片宽度适应屏幕宽度（只考虑宽度）
function fitImageToScreenWidth() {
    const img = document.getElementById('fullscreen-image');
    const container = document.getElementById('fullscreen-container');
    const imageWrapper = document.querySelector('.image-wrapper');

    if (img && container) {
        // 获取容器和图片的尺寸
        const containerWidth = container.clientWidth;
        const imgNaturalWidth = img.naturalWidth;

        // 计算缩放比例，只考虑宽度
        const marginSize = 60; // 图片与屏幕左右边缘的最小距离
        const availableWidth = containerWidth - marginSize * 2;

        // 计算缩放比例，使图片宽度恰好适应屏幕宽度
        const zoom = (availableWidth / imgNaturalWidth) * 0.98; // 留出很少空间，使图片更大

        // 设置缩放级别
        setZoomLevel(zoom);

        // 重置滚动位置并确保图片居中
        if (imageWrapper) {
            // 等待图片缩放完成后再调整滚动位置
            setTimeout(() => {
                // 水平居中，垂直滚动到顶部
                imageWrapper.scrollLeft = (imageWrapper.scrollWidth - imageWrapper.clientWidth) / 2;
                imageWrapper.scrollTop = 0;
            }, 50);
        }
    }
}

// 初始化绘画画布
function initDrawingCanvas() {
    // 获取图片尺寸
    const img = document.getElementById('fullscreen-image');
    const imgRect = img.getBoundingClientRect();

    // 设置画布尺寸
    drawingCanvas.width = imgRect.width;
    drawingCanvas.height = imgRect.height;

    // 获取绘图上下文
    drawingContext = drawingCanvas.getContext('2d');

    // 添加绘画事件监听器
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);

    // 监听图片尺寸变化
    window.addEventListener('resize', updateCanvasSize);
    img.addEventListener('load', updateCanvasSize);
}

// 更新画布尺寸
function updateCanvasSize() {
    if (!drawingCanvas) return;

    const img = document.getElementById('fullscreen-image');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();

    // 保存当前绘图数据
    const imageData = drawingContext.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

    // 调整画布尺寸
    drawingCanvas.width = imgRect.width;
    drawingCanvas.height = imgRect.height;

    // 恢复绘图数据
    drawingContext.putImageData(imageData, 0, 0);
}

// 切换绘画模式
function toggleDrawingMode() {
    isDrawingMode = !isDrawingMode;
    isErasing = false;

    // 更新按钮状态
    const drawBtn = document.querySelector('.drawing-controls button:nth-child(1)');
    const eraserBtn = document.querySelector('.drawing-controls button:nth-child(2)');

    if (isDrawingMode) {
        drawBtn.classList.add('active');
        eraserBtn.classList.remove('active');
        drawingCanvas.style.pointerEvents = 'auto'; // 允许鼠标交互
    } else {
        drawBtn.classList.remove('active');
        drawingCanvas.style.pointerEvents = 'none'; // 禁止鼠标交互
    }
}

// 切换橡皮擦模式
function toggleEraserMode() {
    isErasing = !isErasing;

    if (isErasing) {
        isDrawingMode = true;
        drawingCanvas.style.pointerEvents = 'auto';
    }

    // 更新按钮状态
    const drawBtn = document.querySelector('.drawing-controls button:nth-child(1)');
    const eraserBtn = document.querySelector('.drawing-controls button:nth-child(2)');

    if (isErasing) {
        eraserBtn.classList.add('active');
        drawBtn.classList.remove('active');
    } else {
        eraserBtn.classList.remove('active');
        if (isDrawingMode) {
            drawBtn.classList.add('active');
        }
    }
}

// 清空绘图
function clearDrawing() {
    if (!drawingContext) return;
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// 开始绘画
function startDrawing(e) {
    if (!isDrawingMode) return;

    isDrawing = true;

    // 获取鼠标相对于画布的位置
    const rect = drawingCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

// 绘画
function draw(e) {
    if (!isDrawingMode || !isDrawing) return;

    // 获取鼠标相对于画布的位置
    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 设置绘图属性
    drawingContext.lineJoin = 'round';
    drawingContext.lineCap = 'round';
    drawingContext.lineWidth = brushSize;

    if (isErasing) {
        // 橡皮擦模式
        drawingContext.globalCompositeOperation = 'destination-out';
        drawingContext.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        // 绘画模式
        drawingContext.globalCompositeOperation = 'source-over';
        drawingContext.strokeStyle = brushColor;
    }

    // 绘制线条
    drawingContext.beginPath();
    drawingContext.moveTo(lastX, lastY);
    drawingContext.lineTo(x, y);
    drawingContext.stroke();

    // 更新位置
    lastX = x;
    lastY = y;
}

// 停止绘画
function stopDrawing() {
    isDrawing = false;
}