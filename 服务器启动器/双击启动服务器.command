#!/bin/bash

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$( dirname "$SCRIPT_DIR" )"
cd "$SCRIPT_DIR"

# 设置终端标题
echo -n -e "\033]0;自由组合实验\007"

# 清屏
clear

# 显示彩色标题
echo -e "\033[1;36m================================\033[0m"
echo -e "\033[1;33m    自由组合实验服务器管理器    \033[0m"
echo -e "\033[1;36m================================\033[0m"
echo

# 显示当前目录
echo -e "\033[1;32m服务器目录:\033[0m $PARENT_DIR"
echo

while true; do
    # 显示当前模式
    if [ -f ".server_mode" ]; then
        current_mode=$(cat .server_mode)
        echo -e "\033[1;34m当前模式:\033[0m $current_mode"
        echo
    fi

    echo -e "\033[1;35m请选择操作:\033[0m"
    echo "1) 启动服务器"
    echo "2) 停止服务器"
    echo "3) 重启服务器"
    echo "4) 查看服务器状态"
    echo "5) 切换显示模式（HTML模式/目录列表模式）"
    echo "6) 退出"
    echo
    read -p "请输入选项 (1-6): " choice
    echo

    case $choice in
        1)
            ./服务器.sh start
            ;;
        2)
            ./服务器.sh stop
            ;;
        3)
            ./服务器.sh restart
            ;;
        4)
            ./服务器.sh status
            ;;
        5)
            ./服务器.sh toggle
            ;;
        6)
            echo -e "\033[1;33m感谢使用！再见！\033[0m"
            exit 0
            ;;
        *)
            echo -e "\033[1;31m无效的选项，请重试\033[0m"
            ;;
    esac
    echo
    echo -e "\033[1;36m按回车键继续...\033[0m"
    read
    clear
    echo -e "\033[1;36m================================\033[0m"
    echo -e "\033[1;33m    自由组合实验服务器管理器    \033[0m"
    echo -e "\033[1;36m================================\033[0m"
    echo
    echo -e "\033[1;32m服务器目录:\033[0m $PARENT_DIR"
    echo
done