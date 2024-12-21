function manageService(service, action)
{
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch('/manage_service', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ service: service, action: action }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                document.getElementById('modalInfoText').innerHTML = `${service} ${action}ed successfully!`;
                $('#modal-info').modal('show');
            } else {
                document.getElementById('modalInfoText').innerHTML = data.message;
                $('#modal-info').modal('show');

            }
        })
        .catch((error) => {
            document.getElementById('modalInfoText').innerHTML = "Error" + error.message;
            $('#modal-info').modal('show');
    });
}

function updateServiceStatus()
{
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const services = ["dlna", "smb", "nfs"];

    services.forEach(serviceName => {
        fetch('/service_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ service: serviceName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const statusLabel = document.getElementById(`${serviceName}-status`);
                statusLabel.textContent = data.status === "running" ? "Running" : "Stopped";
                statusLabel.className = data.status === "running" ? "label label-success" : "label label-danger";
            } else {
                document.getElementById('modalInfoText').innerHTML = `Error checking status for ${serviceName}: ${data.error}`;
                $('#modal-info').modal('show');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function showUserPassword()
{
    let element = document.getElementById("loginPassword");

    if (element.type === "password") {
        element.type = "text";
    } else {
        element.type = "password";
    }
}

async function cmdReboot()
{
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $('#modal-reboot').modal('hide');

    try {
        const response = await fetch('/reboot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('modalSuccessText').innerHTML = data.message;
            $('#modal-success').modal('show');
        } else {
            document.getElementById('modalErrorText').innerHTML = "Error: " + data.message;
        }
    } catch (error) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Backend error.";
            $('#modal-error').modal('show');
    }
}

async function cmdShutdown()
{
    console.debug("cmdShutdown");
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $('#modal-shutdown').modal('hide');

    try {
        const response = await fetch('/shutdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('modalSuccessText').innerHTML = data.message;
            $('#modal-success').modal('show');
        } else {
            document.getElementById('modalErrorText').innerHTML = "Error: " + data.message;
        }
    } catch (error) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Backend error.";
            $('#modal-error').modal('show');
    }
}

function notImplemented()
{
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');
}

function saveNetworkIP()
{
    $('#modal-networkSettings').modal('hide');
    notImplemented();
}

function saveUserPass()
{
    $('#modal-users').modal('hide');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const currentPassword = document.getElementById('loginPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('message-box').innerText = "Passwords do not match.";
        return;
    }

    fetch('/change_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            $('#modal-password').modal('hide');
            document.getElementById('modalInfoText').innerHTML = "Password changed successfully.";
            $('#modal-info').modal('show');
        } else {
            document.getElementById('message-box').innerText = data.error || "An error occurred.";
        }
    })
    .catch(error => {
        document.getElementById('message-box').innerText = "Failed to process the request.";
    });
}

function timeZoneDetect()
{
    let tzOffset = new Date().getTimezoneOffset();
    let select = document.getElementById("timeZoneList");
    let idx = 0;
    let itemToSelect = 0;
    let txt = 0;
    select.options.length = 0;

    for(let index = 720; index > -840; index -= 60) {
        let gmt = ((index * -1) / 60);
        if(gmt < 0)
            txt = "(GMT " + gmt + ":00)";
        else
            txt = "(GMT+" + gmt + ":00)";

        if(tzOffset == index) {
            itemToSelect = idx;
            txt += " - Autodetected";
        }

        select.options[select.options.length] = new Option(txt, index);
        idx++
    }
    document.getElementById("timeZoneList").selectedIndex = itemToSelect;

}

function saveDateTime()
{
    $('#modal-datetime').modal('hide');
    notImplemented();
}

function changeNTP()
{
    let useNTP = document.getElementById("timestampDynamic").checked;

    if(useNTP) {
        document.getElementById('ntpServer').disabled = false;
        document.getElementById('datePicker').disabled = true;
        document.getElementById('timePicker').disabled = true;
    } else {
        document.getElementById('ntpServer').disabled = true;
        document.getElementById('datePicker').disabled = false;
        document.getElementById('timePicker').disabled = false;
    };
}

function changeNetworkHostInput()
{
    let useDHCP = document.getElementById('addressTypeDynamic').checked;

    if(useDHCP) {
        document.getElementById('staticIP').disabled = true;
        document.getElementById('staticSN').disabled = true;
        document.getElementById('staticGW').disabled = true;
    } else {
        document.getElementById('staticIP').disabled = false;
        document.getElementById('staticSN').disabled = false;
        document.getElementById('staticGW').disabled = false;
    }
}

async function unmountUSB()
{

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $('#modal-eject').modal('hide');
    $('#modal-waiting').modal({backdrop: 'static', keyboard: false});

    setTimeout(function() {
        $('#modal-waiting').modal('hide');
    }, 5000);

    try {
        const response = await fetch('/unmount_usb0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
        });

        const data = await response.json();
        if (response.ok) {
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                document.getElementById('modalSuccessText').innerHTML = data.message;
                $('#modal-success').modal('show');
            });
        } else {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Error: " + data.message;
        }
    } catch (error) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Communication error.";
            $('#modal-error').modal('show');
    }
}

async function getNetinfo()
{
    try {
        const response = await fetch('/netinfo');
        const data = await response.json();
        const eth0 = data.network_info.find(iface => iface.interface === 'eth0');
        let iptype = "dhcp";

        if (eth0) {
            document.getElementById("staticIP").value = eth0.ip_address || '';
            document.getElementById("staticSN").value = eth0.netmask || '';
            document.getElementById("staticGW").value = eth0.gateway || '';

            document.getElementById("smb-share-name").innerHTML = '\\\\' + eth0.ip_address + '\\storage';
            document.getElementById("nfs-share-name").innerHTML = eth0.ip_address + ':/media/usb0';
            document.getElementById("dlna-share-name").innerHTML = 'BeagleNAS';
        }

        if (iptype == 'dhcp') {
            $('#addressTypeDynamic').prop('checked', true);
            document.getElementById("dynamicIP").innerHTML = eth0.ip_address || '';
        } else {
            $('#addressTypeStatic').prop('checked', true);
        }

        changeNetworkHostInput();

    } catch (error) {
        console.error("Endpoint error:", error);
    }
}
