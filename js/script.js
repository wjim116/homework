// 全局变量
let classData = [];
let selectedClass = null;
let selectedDay = null;
let selectedSubject = null;
let currentWeekDay = null;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前日期和周次
    updateDateAndWeek();

    // 加载班级数据
    loadClassData();

    // 初始化事件监听
    initEventListeners();
});

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
                    //loadHardcodedData(); // 加载硬编码数据作为备份
                }
            } else {
                console.error('获取班级数据失败，状态码:', xhr.status);
                //loadHardcodedData(); // 加载硬编码数据作为备份
            }
        }
    };

    xhr.onerror = function() {
        console.error('加载班级数据出错');
        //loadHardcodedData(); // 加载硬编码数据作为备份
    };

    try {
        xhr.send();
    } catch (e) {
        console.error('发送请求失败:', e);
        //loadHardcodedData(); // 加载硬编码数据作为备份
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
                    {"subject": "数学", "teacher": "林中奥", "period": 1},
                    {"subject": "英语", "teacher": "一A英走", "period": 2},
                    {"subject": "语文", "teacher": "黄则昌", "period": 3},
                    {"subject": "历史", "teacher": "李英睿", "period": 4},
                    {"subject": "化学", "teacher": "高有亮", "period": 5},
                    {"subject": "体育", "teacher": "陈兴可", "period": 6},
                    {"subject": "政治", "teacher": "陈金海", "period": 7},
                    {"subject": "综合实践课", "teacher": "", "period": 8}
                ],
                "tuesday": [
                    {"subject": "历史", "teacher": "李英睿", "period": 1},
                    {"subject": "语文", "teacher": "黄则昌", "period": 2},
                    {"subject": "化学", "teacher": "高有亮", "period": 3},
                    {"subject": "物理", "teacher": "赵新洋", "period": 4},
                    {"subject": "数学", "teacher": "林中奥", "period": 5},
                    {"subject": "英语", "teacher": "一A英人", "period": 6},
                    {"subject": "地理", "teacher": "周绍驼", "period": 7},
                    {"subject": "周前会", "teacher": "周绍驼", "period": 8}
                ],
                "wednesday": [
                    {"subject": "英语", "teacher": "一A英人", "period": 1},
                    {"subject": "化学", "teacher": "高有亮", "period": 2},
                    {"subject": "政治", "teacher": "陈金海", "period": 3},
                    {"subject": "地理", "teacher": "周绍驼", "period": 4},
                    {"subject": "语文", "teacher": "黄则昌", "period": 5},
                    {"subject": "生物", "teacher": "吴正淮", "period": 6},
                    {"subject": "音乐", "teacher": "黄振付", "period": 7},
                    {"subject": "数学", "teacher": "林中奥", "period": 8}
                ],
                "thursday": [
                    {"subject": "语文", "teacher": "黄则昌", "period": 1},
                    {"subject": "政治", "teacher": "陈金海", "period": 2},
                    {"subject": "英语", "teacher": "一A英人", "period": 3},
                    {"subject": "物理", "teacher": "赵新洋", "period": 4},
                    {"subject": "数学", "teacher": "林中奥", "period": 5},
                    {"subject": "生物", "teacher": "吴正淮", "period": 6},
                    {"subject": "心理", "teacher": "卓旭东", "period": 7},
                    {"subject": "地理", "teacher": "周绍驼", "period": 8}
                ],
                "friday": [
                    {"subject": "数学", "teacher": "林中奥", "period": 1},
                    {"subject": "地理", "teacher": "周绍驼", "period": 2},
                    {"subject": "历史", "teacher": "李英睿", "period": 3},
                    {"subject": "英语", "teacher": "一A英人", "period": 4},
                    {"subject": "生物", "teacher": "吴正淮", "period": 5},
                    {"subject": "政治", "teacher": "陈金海", "period": 6},
                    {"subject": "语文", "teacher": "黄则昌", "period": 7},
                    {"subject": "物理", "teacher": "赵新洋", "period": 8}
                ],
                "saturday": [
                    {"subject": "英语", "teacher": "一A英人", "period": 1},
                    {"subject": "历史", "teacher": "李英睿", "period": 2},
                    {"subject": "数学", "teacher": "林中奥", "period": 3},
                    {"subject": "语文", "teacher": "黄则昌", "period": 4}
                ],
                "sunday": []
            }
        },
        {
            "class": "2",
            "schedule": {
                "monday": [
                    {"subject": "语文", "teacher": "吴贤雯", "period": 1},
                    {"subject": "英语", "teacher": "一A英人", "period": 2},
                    {"subject": "政治", "teacher": "陈金海", "period": 3},
                    {"subject": "化学", "teacher": "黄晓节", "period": 4},
                    {"subject": "数学", "teacher": "王丽", "period": 5},
                    {"subject": "生物", "teacher": "胡俊柏", "period": 6},
                    {"subject": "体育", "teacher": "陈琦实", "period": 7},
                    {"subject": "综合实践课", "teacher": "", "period": 8}
                ],
                "tuesday": [
                    {"subject": "语文", "teacher": "吴贤雯", "period": 1},
                    {"subject": "物理", "teacher": "陈靖", "period": 2},
                    {"subject": "历史", "teacher": "常晓丽", "period": 3},
                    {"subject": "数学", "teacher": "王丽", "period": 4},
                    {"subject": "地理", "teacher": "赫明礼", "period": 5},
                    {"subject": "英语", "teacher": "一A英人", "period": 6},
                    {"subject": "政治", "teacher": "陈金海", "period": 7},
                    {"subject": "周前会", "teacher": "", "period": 8}
                ],
                "wednesday": [
                    {"subject": "英语", "teacher": "一A英人", "period": 1},
                    {"subject": "数学", "teacher": "王丽", "period": 2},
                    {"subject": "生物", "teacher": "胡俊柏", "period": 3},
                    {"subject": "政治", "teacher": "陈金海", "period": 4},
                    {"subject": "地理", "teacher": "赫明礼", "period": 5},
                    {"subject": "历史", "teacher": "常晓丽", "period": 6},
                    {"subject": "心理", "teacher": "卓旭东", "period": 7},
                    {"subject": "语文", "teacher": "吴贤雯", "period": 8}
                ],
                "thursday": [
                    {"subject": "语文", "teacher": "吴贤雯", "period": 1},
                    {"subject": "地理", "teacher": "赫明礼", "period": 2},
                    {"subject": "英语", "teacher": "一A英人", "period": 3},
                    {"subject": "历史", "teacher": "常晓丽", "period": 4},
                    {"subject": "政治", "teacher": "陈金海", "period": 5},
                    {"subject": "数学", "teacher": "王丽", "period": 6},
                    {"subject": "音乐", "teacher": "黄振付", "period": 7},
                    {"subject": "物理", "teacher": "陈靖", "period": 8}
                ],
                "friday": [
                    {"subject": "语文", "teacher": "吴贤雯", "period": 1},
                    {"subject": "数学", "teacher": "王丽", "period": 2},
                    {"subject": "化学", "teacher": "黄晓节", "period": 3},
                    {"subject": "英语", "teacher": "一A英人", "period": 4},
                    {"subject": "物理", "teacher": "陈靖", "period": 5},
                    {"subject": "地理", "teacher": "赫明礼", "period": 6},
                    {"subject": "化学", "teacher": "黄晓节", "period": 7},
                    {"subject": "体育", "teacher": "陈琦实", "period": 8}
                ],
                "saturday": [
                    {"subject": "英语", "teacher": "一A英人", "period": 1},
                    {"subject": "数学", "teacher": "王丽", "period": 2},
                    {"subject": "历史", "teacher": "常晓丽", "period": 3},
                    {"subject": "语文", "teacher": "吴贤雯", "period": 4},
                    {"subject": "地理", "teacher": "赫明礼", "period": 5},
                    {"subject": "生物", "teacher": "胡俊柏", "period": 6}
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
    while (classSelect.options.length > 1) {
        classSelect.remove(1);
    }

    // 添加班级选项
    classData.forEach(classInfo => {
        const option = document.createElement('option');
        option.value = classInfo.class;
        option.textContent = `${classInfo.class}班`;
        classSelect.appendChild(option);
    });
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

    // 如果自动周次被选中，则自动选择当前周次
    if (document.getElementById('auto-week-checkbox').checked) {
        selectCurrentDay();
    } else {
        // 否则清除所有周次按钮的选中状态
        document.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        selectedDay = null;
    }

    // 更新科目按钮状态
    updateSubjectButtons();

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

    // 更新科目按钮状态
    updateSubjectButtons();

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
    }
}

// 更新科目按钮状态
function updateSubjectButtons() {
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
        return;
    }

    const daySchedule = classInfo.schedule[selectedDay];

    // 获取当天有课的科目列表
    const subjectsWithClass = daySchedule.map(item => item.subject);

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
    weekdays.forEach(day => {
        if (classInfo.schedule[day]) {
            const lessons = classInfo.schedule[day].filter(item => item.subject === selectedSubject);
            totalLessonsPerWeek += lessons.length;

            // 如果是当前选中的日期之前的日期，累加课程数量
            if (weekdays.indexOf(day) < weekdays.indexOf(selectedDay)) {
                lessonNumberInWeek += lessons.length;
            }
        }
    });

    // 加上当天的课程序号
    lessonNumberInWeek += 1;

    // 构建图片名称
    const imageName = `${teacher}-${selectedSubject}${lessonNumberInWeek}.png`;
    const imagePath = `homework/${imageName}`;

    // 尝试加载图片
    const img = new Image();
    img.onload = function() {
        homeworkContent.innerHTML = '';
        img.classList.add('homework-image');
        homeworkContent.appendChild(img);
    };

    img.onerror = function() {
        homeworkContent.innerHTML = '<div class="no-homework-message">作业还未上传，请课代表及时提醒老师！</div>';
    };

    img.src = imagePath;
}
