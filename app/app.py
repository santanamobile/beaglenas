#!/bin/env python3
# Flask Web Server
#
from flask import Flask, render_template, redirect, request, url_for, session, jsonify, send_from_directory
from datetime import datetime
from config import USERNAME, PASSWORD, MOUNT_POINT, NETWORK_INTERFACE
import netifaces
import psutil
import time
import os

app = Flask(__name__, static_folder='/var/www/static', template_folder='/var/www/templates')
app.secret_key = '$y$j9T$4bYEs2dUccGD2zGZFCkMO/$VNdPFDyJalw5Rn6t.BhLFULCl//BH0vD1WZ1dmOFQhB'
app.debug = False

previous_net = psutil.net_io_counters()
previous_time = time.time()

def get_network_info():
    network_info = []
    interfaces = netifaces.interfaces()
    
    if NETWORK_INTERFACE in interfaces:
        ifaddrs = netifaces.ifaddresses(NETWORK_INTERFACE)
        if netifaces.AF_INET in ifaddrs:
            ipv4_info = ifaddrs[netifaces.AF_INET][0]
            network_info.append({
                'interface': 'eth0',
                'ip_address': ipv4_info.get('addr', 'N/A'),
                'netmask': ipv4_info.get('netmask', 'N/A'),
                'broadcast': ipv4_info.get('broadcast', 'N/A')
            })

    return network_info

@app.route('/status', methods=['GET'])
def get_info():

    global previous_net, previous_time

    # CPU Usage
    cpu_usage = psutil.cpu_percent(interval=1)

    # Memory Usage
    memory = psutil.virtual_memory()
    memory_usage = memory.percent

    # Network Usage
    current_time = time.time()
    current_net = psutil.net_io_counters(pernic=True)

    if NETWORK_INTERFACE in current_net:
        iface_net = current_net[NETWORK_INTERFACE]
        sent_diff = iface_net.bytes_sent - previous_net.bytes_sent
        recv_diff = iface_net.bytes_recv - previous_net.bytes_recv
    else:
        sent_diff = recv_diff = 0

    time_diff = current_time - previous_time

    if time_diff > 0:
        upload_rate = round(sent_diff / time_diff / 1024, 2)
        download_rate = round(recv_diff / time_diff / 1024, 2)
    else:
        upload_rate = 0
        download_rate = 0

    previous_net = iface_net if NETWORK_INTERFACE in current_net else previous_net
    previous_time = current_time

    storage_available = "Unavailable"
    storage_total = 0
    storage_used = 0
    storage_percent = 0
    if os.path.ismount(MOUNT_POINT):
        storage = psutil.disk_usage(MOUNT_POINT)
        storage_percent = psutil.disk_usage(MOUNT_POINT).percent
        storage_available = storage.free // (2**30)
        storage_total = storage.total // (2**30)
        storage_used = storage.used // (2**30)

    network_info = get_network_info()

    now = datetime.now()
    system_date = now.strftime("%Y-%m-%d")
    system_time = now.strftime("%H:%M:%S")

    return jsonify({
        'system_date': system_date,
        'system_time': system_time,
        'cpu_usage': cpu_usage,
        'memory_usage': memory_usage,
        'upload_rate': upload_rate,
        'download_rate': download_rate,
        'storage_available': storage_available,
        'storage_total': storage_total,
        'storage_used': storage_used,
        'storage_percent': storage_percent,
        'network_info': network_info
    })

@app.route('/settings', methods=['GET'])
def get_settings():

    return jsonify({
        'www_username': 'admin',
        'dhcp': True,
        'static_ip': '192.168.0.10',
        'static_sn': '255.255.255.0',
        'static_gw': '192.168.0.1',
        'TZ': -3,
        'hostname': 'hostname'
    })

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('loginUsername')
        password = request.form.get('loginPassword')
        if username == USERNAME and password == PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error="Invalid Credentials")
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

# https://flask.palletsprojects.com/en/stable/patterns/favicon/
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
