#!/bin/bash

PORT=8000
PID_FILE=".server.pid"
SHOW_DIRECTORY=true
MODE_FILE=".server_mode"
LOG_FILE=".server.log"

# 获取脚本所在目录的绝对路径（处理中文路径）
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
PARENT_DIR=$(dirname "$SCRIPT_DIR")
LOG_FILE="$SCRIPT_DIR/$LOG_FILE"

# 检查端口是否被占用
check_port() {
    if lsof -i :$PORT > /dev/null 2>&1; then
        return 0  # 端口被占用
    fi
    return 1  # 端口未被占用
}

# 获取服务器状态
get_server_status() {
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        if ps -p $pid > /dev/null; then
            return 0  # 服务器正在运行
        fi
    fi
    return 1  # 服务器未运行
}


# 清理端口
cleanup_port() {
    # 查找并终止占用端口的进程
    pid=$(lsof -ti :$PORT)
    if [ ! -z "$pid" ]; then
        echo "发现端口 $PORT 被进程 $pid 占用，正在清理..." | tee -a "$LOG_FILE"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
    
    # 如果 PID 文件存在但进程不存在，删除 PID 文件
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        if ! ps -p $pid > /dev/null; then
            rm "$PID_FILE"
        fi
    fi
}


# 获取当前活跃的IP地址
get_active_ip() {
    # 尝试获取WiFi接口IP
    local wifi_ip=$(ipconfig getifaddr en0)
    if [ ! -z "$wifi_ip" ]; then
        echo $wifi_ip
        return
    fi
    
    # 尝试获取有线网络接口IP
    local ethernet_ip=$(ipconfig getifaddr en1)
    if [ ! -z "$ethernet_ip" ]; then
        echo $ethernet_ip
        return
    fi
    
    # 尝试获取���他可能的网络接口
    local other_ip=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
    if [ ! -z "$other_ip" ]; then
        echo $other_ip
        return
    fi
    
    # 如果都没有找到，返回localhost
    echo "127.0.0.1"
}

# 显示所有可用的访问地址
show_access_urls() {
    local ip=$(get_active_ip)
    echo "可以通过以下地址访问服务器："
    echo "1. 本机访问: http://localhost:$PORT"
    echo "2. 局域网访问: http://$ip:$PORT"
    
    # 如果有多个网络接口，显示所有可用地址
    local all_ips=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{{print $2}}')
    if [ $(echo "$all_ips" | wc -l) -gt 1 ]; then
        echo "其他可用地址："
        echo "$all_ips" | while read -r ip; do
            echo "  http://$ip:$PORT"
        done
    fi
}

# 清理端口和进程
cleanup() {
    # 如果存在PID文件，尝试终止对应进程
    if [ -f "$PID_FILE" ]; then
        old_pid=$(cat "$PID_FILE")
        if ps -p $old_pid > /dev/null 2>&1; then
            echo "终止旧进程 (PID: $old_pid)..." | tee -a "$LOG_FILE"
            kill -9 $old_pid 2>/dev/null
        fi
        rm -f "$PID_FILE"
    fi
    
    # 检查并清理被占用的端口
    if check_port; then
        echo "端口 $PORT 被占用，正在清理..." | tee -a "$LOG_FILE"
        pid=$(lsof -t -i :$PORT)
        if [ ! -z "$pid" ]; then
            echo "终止占用端口的进程 (PID: $pid)..." | tee -a "$LOG_FILE"
            kill -9 $pid 2>/dev/null
        fi
    fi
    
    # 等待端口释放
    for i in $(seq 1 5); do
        if ! check_port; then
            return 0
        fi
        sleep 1
    done
    
    return 1
}

# 停止服务器
stop_server() {
    if ! get_server_status; then
        echo "服务器未在运行" | tee -a "$LOG_FILE"
        # 清理可能存在的端口占用
        cleanup_port
        return
    fi
    
    pid=$(cat "$PID_FILE")
    echo "正在停止服务器 (PID: $pid)..." | tee -a "$LOG_FILE"
    kill $pid 2>/dev/null || kill -9 $pid 2>/dev/null
    rm -f "$PID_FILE"
    
    # 确保端口被释放
    cleanup_port
    echo "服务器已停止" | tee -a "$LOG_FILE"
}

# 重启服务器
restart_server() {
    if get_server_status; then
        stop_server
    fi
    sleep 1
    start_server
}

# 切换显示模式
toggle_mode() {
    if [ -f "$MODE_FILE" ]; then
        current_mode=$(cat "$MODE_FILE")
        if [ "$current_mode" = "directory" ]; then
            echo "html" > "$MODE_FILE"
            echo "已切换到HTML模式" | tee -a "$LOG_FILE"
        else
            echo "directory" > "$MODE_FILE"
            echo "已切换到目录列表模式" | tee -a "$LOG_FILE"
        fi
    else
        echo "directory" > "$MODE_FILE"
        echo "已切换到目录列表模式" | tee -a "$LOG_FILE"
    fi
    
    # 如果服务器正在运行，则重启它
    if check_port; then
        echo "重启服务器以应用新模式..." | tee -a "$LOG_FILE"
        restart_server
    fi
}

# 启动服务器
start_server() {
    cd "$SCRIPT_DIR"
    
    # 清理旧的日志文件
    rm -f "$LOG_FILE"
    touch "$LOG_FILE"
    
    # 首先进行清理
    if ! cleanup; then
        echo "无法清理端口 $PORT，请手动检查并关闭占用该端口的程序" | tee -a "$LOG_FILE"
        return 1
    fi
    
    echo "正在启动服务器..." | tee -a "$LOG_FILE"
    
    # 检查当前模式
    if [ -f "$MODE_FILE" ]; then
        current_mode=$(cat "$MODE_FILE")
    else
        current_mode="html"
        echo "$current_mode" > "$MODE_FILE"
    fi
    
    echo "当前模式: $current_mode" | tee -a "$LOG_FILE"
    
    if [ "$current_mode" = "directory" ]; then
        # 目录列表模式
        mkdir -p .server_root
        rm -rf .server_root/*
        
        echo "创建软链接..." | tee -a "$LOG_FILE"
        cd "$PARENT_DIR"
        for file in *; do
            if [ "$file" != "服务器启动器" ]; then
                ln -sf "$PARENT_DIR/$file" "$SCRIPT_DIR/.server_root/"
                echo "链接文件: $file" >> "$LOG_FILE"
            fi
        done
        
        cd "$SCRIPT_DIR/.server_root"
        echo "启动目录模式服务器..." | tee -a "$LOG_FILE"
        python3 "$SCRIPT_DIR/.custom_server.py" $PORT 2>&1 | tee -a "$LOG_FILE" &
    else
        # HTML模式
        cd "$PARENT_DIR"
        echo "启动HTML模式服务器..." | tee -a "$LOG_FILE"
        python3 "$SCRIPT_DIR/.custom_server.py" $PORT 2>&1 | tee -a "$LOG_FILE" &
    fi
    
    SERVER_PID=$!
    echo $SERVER_PID > "$SCRIPT_DIR/$PID_FILE"
    
    # 等待服务器启动
    for i in $(seq 1 5); do
        if check_port; then
            echo "服务器已启动 (PID: $SERVER_PID)" | tee -a "$LOG_FILE"
            show_access_urls | tee -a "$LOG_FILE"
            return 0
        fi
        sleep 1
    done
    
    echo "服务器启动失败，请检查日志文件 $LOG_FILE 获取详细信息" | tee -a "$LOG_FILE"
    if [ -f "$LOG_FILE" ]; then
        echo "错误日志内容:"
        cat "$LOG_FILE"
    fi
    rm -f "$PID_FILE"
    return 1
}

# 根据命令行参数执行相应操作
case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        if get_server_status; then
            echo "服务器正在运行 (PID: $(cat $PID_FILE))"
            show_access_urls
        else
            echo "服务器未在运行"
        fi
        ;;
    toggle)
        toggle_mode
        ;;
    *)
        echo "使用方法: $0 {start|stop|restart|status|toggle}"
        echo "  start   - ���动服务器"
        echo "  stop    - 停止服务器"
        echo "  restart - 重启服务器"
        echo "  status  - 查看服务器状态"
        echo "  toggle  - 切换显示模式（目录列表/HTML）"
        exit 1
        ;;
esac

exit 0
