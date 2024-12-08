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

function cmdReboot()
{
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $('#modal-reboot').modal('hide');
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');

    fetch('/reboot', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
    })
    .catch(error => console.error('Reboot error:', error));

}

function cmdShutdown()
{
    console.debug("cmdShutdown");
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $('#modal-shutdown').modal('hide');
    document.getElementById('modalInfoText').innerHTML = "Shutdown complete";
    $('#modal-info').modal('show');

    fetch('/shutdown', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
    })
    .catch(error => console.error('Shutdown error:', error));
}

function saveNetworkIP()
{
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');
    console.debug("saveNetworkIP");
}

function saveUserPass()
{
    let user = document.getElementById('inputUsername').value;
    let pass = document.getElementById('inputPassword').value;

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

function fillTimedTest()
{
    let select = document.getElementById("timedTestList");
    let txt = ''
    select.options.length = 0;

    for(let index = 1; index < 100; index += 1) {
        if(index < 10)
            txt = "0" + index;
        else
            txt = index;
        select.options[select.options.length] = new Option(txt, index);
    }

    document.getElementById("timedTestList").selectedIndex = 0;

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
