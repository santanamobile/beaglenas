#!/bin/env python3
# Flask Web Server
#
from flask import Flask, render_template, redirect, request, url_for, session, jsonify, send_from_directory
from datetime import datetime
from config import USERNAME, PASSWORD, MOUNT_POINT, NETWORK_INTERFACE, STATIC_FOLDER, TEMPLATE_FOLDER
import subprocess
import netifaces
import psutil
import time
import os

app = Flask(__name__, static_folder=STATIC_FOLDER, template_folder=TEMPLATE_FOLDER)
app.secret_key = '$y$j9T$4bYEs2dUccGD2zGZFCkMO/$VNdPFDyJalw5Rn6t.BhLFULCl//BH0vD1WZ1dmOFQhB'
app.debug = False

previous_net = psutil.net_io_counters()
previous_time = time.time()

@app.route('/unmount_usb0', methods=['POST'])
def unmount_usb():

    if not session.get('logged_in'):
        return redirect(url_for('login'))

    usb_mount_point = MOUNT_POINT

    if not os.path.ismount(usb_mount_point):
        return jsonify({"status": "error", "message": "Device not present"}), 400

    try:
        subprocess.check_call(['umount', usb_mount_point])
        return jsonify({"status": "success", "message": "Device removed with success!"})
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": f"Eject error: {e}"}), 500

def get_network_info():

    if not session.get('logged_in'):
        return redirect(url_for('login'))

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

    if not session.get('logged_in'):
        return redirect(url_for('login'))

    global previous_net, previous_time

    cpu_usage = psutil.cpu_percent(interval=1)

    memory = psutil.virtual_memory()
    memory_usage = memory.percent

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

    if not ((upload_rate > 0) or (download_rate > 0)):
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

def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
