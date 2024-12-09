function showUserPass()
{
  let x = document.getElementById("inputPassword");

  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }

}

function showLoginPass()
{
  let x = document.getElementById("loginPassword");

  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }

}

function cmdDefaults()
{
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');
    console.debug("cmdDefaults");
}

async function cmdReboot()
{
    console.debug("cmdReboot");
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

function saveNetworkIP()
{
    $('#modal-networkSettings').modal('hide');
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');
    console.debug("saveNetworkIP");
}

function saveUserPass()
{
    $('#modal-users').modal('hide');
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');
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
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');
    debug.console("saveDateTime")
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
