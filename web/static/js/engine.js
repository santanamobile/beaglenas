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
    document.getElementById('modalInfoText').innerHTML = "Not implemented";
    $('#modal-info').modal('show');
    console.debug("cmdReboot");
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

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 1) {
          $('#modal-user').modal('hide');
          $('#modal-waiting').modal({backdrop: 'static', keyboard: false});
        } else if(this.readyState == 4 && this.status == 200) {
            setTimeout(function() {
                $('#modal-waiting').modal('hide');
            }, 1000);

            document.getElementById('modalSuccessText').innerHTML = "Configuracoes de usuário/senha salvas.";

            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-success').modal('show');
            });
        } else if (this.readyState == 4 && this.status == 0) {
            $('#modal-waiting').modal('hide');

            document.getElementById('modalErrorText').innerHTML = "Erro ao salvar usuário/senha";

            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
        }
    };

    if(user != "" && pass != "") {
        xhttp.open("POST", "cgi-bin?opt=2&username=" + user + "&password=" + pass, true);
        xhttp.send();
    }
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
    $('#modal-eject').modal('hide');
    $('#modal-waiting').modal({backdrop: 'static', keyboard: false});

    setTimeout(function() {
        $('#modal-waiting').modal('hide');
    }, 1000);

    try {
        const response = await fetch('/unmount_usb0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                document.getElementById('modalSuccessText').innerHTML = "Device removed with success!";
                $('#modal-success').modal('show');
            });
        } else {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Error ejecting device.";
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
        }
    } catch (error) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Communication error.";
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });        console.error("Error:", error);
    }
}

