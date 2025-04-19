#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import http.server
import socketserver
import os
import sys
import logging

class NoCacheRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加禁用缓存的头部
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # 添加允许跨域访问的头部
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def do_GET(self):
        # 强制重新加载目录列表
        self.directory = os.getcwd()
        return super().do_GET()

    def list_directory(self, path):
        try:
            list_response = super().list_directory(path)
            if list_response:
                self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            return list_response
        except Exception as e:
            print(f"Error listing directory: {e}")
            return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 custom_server.py PORT")
        sys.exit(1)
    
    try:
        port = int(sys.argv[1])
        # 允许地址重用
        socketserver.TCPServer.allow_reuse_address = True
        # 绑定所有网络接口
        server_address = ('', port)
        httpd = socketserver.TCPServer(server_address, NoCacheRequestHandler)
        print(f"Server started at port {port}")
        httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)
