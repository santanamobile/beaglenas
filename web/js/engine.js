function getData()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ups = JSON.parse(this.responseText);
// Dashboard
            document.getElementById("inputVoltage").innerHTML = ups.statusInquiry[0] + "<small>v</small>";
            document.getElementById("outputVoltage").innerHTML = ups.statusInquiry[2] + "<small>v</small>";
            document.getElementById("upsLoad").innerHTML = ups.statusInquiry[3] + "<small>% (load)</small>";
            document.getElementById("upsFrequency").innerHTML = ups.statusInquiry[4] + "<small>Hz</small>";
            document.getElementById("batteryVoltage").innerHTML = ups.statusInquiry[5] + "<small>v</small>";
            document.getElementById("upsTemperature").innerHTML = ups.statusInquiry[6] + "<small>&#8451;</small>";
            document.getElementById("upsOutputIcon").className = "fa fa-plug";
            statusUtility = ups.statusByte[7];
            statusBattery = ups.statusByte[6];
            statusBypass = ups.statusByte[5]; 
            statusFailed = ups.statusByte[4];
            statusStandby = ups.statusByte[3];
            statusTest = ups.statusByte[2];
            statusShutdown = ups.statusByte[1];
            statusBeeper = ups.statusByte[0];
            fwMax = ups.firmwareVersion[0];
            fwMin = ups.firmwareVersion[1];
            fwRel = ups.firmwareVersion[2];
            fwVer = fwMax + "." + fwMin + "." + fwRel;
// Modal support
            document.getElementById("upsCompany").innerHTML = ups.upsInfo[0];
            document.getElementById("upsModel").innerHTML = ups.upsInfo[1];
            document.getElementById("upsVersion").innerHTML = ups.upsInfo[2];
// Display Firmware Version
            document.getElementById("firmwareVersionModal").innerHTML = fwVer;
            document.getElementById("firmwareVersionSupport").innerHTML = fwVer;
            document.getElementById("firmwareVersionFooter").innerHTML = fwVer;

            if(Number(statusShutdown) == 1) { // b1
                document.getElementById("upsStatus").innerHTML = "Shutdown";
                document.getElementById("upsStatusIcon").className = "fa fa-power-off";
            } else if(Number(statusTest) == 1) { // b2
                document.getElementById("upsStatus").innerHTML = "Testing";
                document.getElementById("upsStatusIcon").className = "fa fa-stethoscope";
            } else if(Number(statusUtility) == 1) { // b7
                document.getElementById("upsStatus").innerHTML = "Input Failed";
                document.getElementById("upsStatusIcon").className = "fa fa-meh-o";
                document.getElementById("upsInputIcon").className = "fa fa-battery-full";
                document.getElementById("acdcInputText").innerHTML = "UPS Input: DC";
                document.getElementById("upsFrequency").innerHTML = "";
            } else if(Number(statusFailed) == 1) { // b4
                document.getElementById("upsStatus").innerHTML = "UPS Failed";
                document.getElementById("upsStatusIcon").className = "fa fa-meh-o";
            } else if(Number(statusBypass) == 1) { // b5
                document.getElementById("upsStatus").innerHTML = "Boost Active";
                document.getElementById("upsStatusIcon").className = "fa fa-line-chart";
            } else if(Number(statusStandby) == 1) { // b3
                document.getElementById("upsStatus").innerHTML = "Standby";
                document.getElementById("upsStatusIcon").className = "fa fa-check-square-o";
                document.getElementById("upsInputIcon").className = "fa fa-plug";
            } else {
                document.getElementById("upsStatus").innerHTML = "Online";
                document.getElementById("upsStatusIcon").className = "fa fa-check";
                document.getElementById("upsInputIcon").className = "fa fa-plug";
                document.getElementById("acdcInputText").innerHTML = "UPS Input: AC";
            }

            if(Number(statusBattery) == 1) { // b6
                document.getElementById("batteryText").innerHTML = "Battery Low";
                document.getElementById("upsBatteryIcon").className = "fa fa-battery-quarter";
            } else {
                document.getElementById("batteryText").innerHTML = "Battery";
                document.getElementById("upsBatteryIcon").className = "fa fa-battery-full";
            }

            if(Number(statusBeeper) == 0) { // b0
                document.getElementById("beepIndicator").className = "fa fa-bell-slash";
                document.getElementById("beepButton").checked = false;
            } else {
                document.getElementById("beepIndicator").className = "fa fa-bell";
                document.getElementById("beepButton").checked = true;
            };
        };
    };

    var tbEvents = $('#eventsTable').DataTable();
    tbEvents.ajax.reload(null, false);

    xmlhttp.open("GET", "status.json", true);
    xmlhttp.send();
}

function getDateTime()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ups = JSON.parse(this.responseText);
            document.getElementById("deviceDate").innerHTML = ups.timestamp[0];
            document.getElementById("deviceTime").innerHTML = ups.timestamp[1];
        };
    };

    xmlhttp.open("GET", "settings.json", true);
    xmlhttp.send();
}


function showPSK()
{
  var x = document.getElementById("inputPSK");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function showPSKSoftAP()
{
  var x = document.getElementById("inputPSKSoftAP");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function showUserPass()
{
  var x = document.getElementById("inputPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function showLoginPass()
{
  var x = document.getElementById("loginPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function cmdDefaults()
{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 1) {
            $('#modal-defaults').modal('hide');
            $('#modal-waiting').modal({backdrop: 'static', keyboard: false});
            location.reload(true);
        } else if(this.readyState == 4 && this.status == 200) {
            setTimeout(function() {
                $('#modal-waiting').modal('hide');
            }, 3000);
            location.reload(true);
        } else if (this.readyState == 4 && this.status == 0) {
            $('#modal-waiting').modal('hide');

            document.getElementById('modalErrorText').innerHTML = "Erro ao enviar comando.";

            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
        }
    };

    xhttp.open("GET", "/defaults", true);
    xhttp.send();

}

function cmdReboot()
{

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 1) {
            $('#modal-reboot').modal('hide');
            $('#modal-waiting').modal({backdrop: 'static', keyboard: false});
            setTimeout(function() {
                $('#modal-waiting').modal('hide');
            }, 2000);

            location.reload(true); 

        } else if (this.readyState == 4 && this.status == 0) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Erro ao enviar comando.";
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
        }
    };

    xhttp.open("GET", "/reboot", true);
    xhttp.send();
}

function sendCommand(webCMD)
{
    var xhttp = new XMLHttpRequest();
    var testPeriod = document.getElementById('timedTestList').value;

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 0) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Erro ao enviar comando";
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
        }
    };

    if(webCMD == 5) {
        xhttp.open("POST", "/testsCMD?command=5" + "&m=" + testPeriod, true);
    } else {
        xhttp.open("POST", "/testsCMD?command=" + webCMD , true);
    }
    xhttp.send();
}

function firmware(option)
{
    var xhttp = new XMLHttpRequest();
    var opt = Number(option);

    xhttp.onreadystatechange = function() {
        if(this.readyState == 1) {
            if(opt == 0) {
                $('#modal-waiting').modal({backdrop: 'static', keyboard: false});
            } else if(opt == 1) {
              $('#modal-firmware').modal('hide');
              $('#modal-firmware-upgrade').modal({backdrop: 'static', keyboard: false});
            };
        } else if(this.readyState == 4 && this.status == 200) {
            if(opt == 0) {
                setTimeout(function() {
                    $('#modal-waiting').modal('hide');
                }, 1000);

                var serverFirmware = this.responseText;
                var fw = serverFirmware.split(".");
                var srvFwMax = Number(fw[0]);
                var srvFwMin = Number(fw[1]);
                var srvFwRel = Number(fw[2]);
                document.getElementById("firmwareNewVersion").innerHTML = serverFirmware;
                if(srvFwMax > fwMax) { mustUpgrade = true;
                } else if((srvFwMax >= fwMax) && (srvFwMin > fwMin)) { mustUpgrade = true;
                } else if((srvFwMax >= fwMax) && (srvFwMin >= fwMin) && (srvFwRel > fwRel)) { mustUpgrade = true;
                } else if((srvFwMax == fwMax) && (srvFwMin == fwMin) && (srvFwRel == fwRel)) { mustUpgrade = false; };

                if(mustUpgrade == true) {
                    document.getElementById("buttonUpgradeFirmware").disabled = false;
                    document.getElementById('modalSuccessText').innerHTML = "Atualização disponível: " + serverFirmware;
                    $('#modal-success').modal('show');
                } else {
                    document.getElementById("buttonUpgradeFirmware").disabled = true;
                    document.getElementById('modalInfoText').innerHTML = "Atualização não disponível";
                    $('#modal-info').modal('show');
                }

            } else if(opt == 1) {
                setTimeout(function() {
                    $('#modal-firmware-upgrade').modal('hide');
                }, 5000);
                document.getElementById("firmwareNewVersion").innerHTML = "Upgrading...";
                document.getElementById('modalSuccessText').innerHTML = "Firmware atualizado com sucesso.";

                $('#modal-firmware-upgrade').on('hidden.bs.modal', function (e) {
                    $('#modal-success').modal('show');
                });
            };
        } else if (this.readyState == 4 && this.status == 0) {
            if(opt == 0) {
                $('#modal-waiting').modal('hide');
                document.getElementById("firmwareNewVersion").innerHTML = "Não disponível";
                document.getElementById('modalErrorText').innerHTML = "Erro ao verificar atualizações";
                $('#modal-waiting').on('hidden.bs.modal', function (e) {
                    $('#modal-error').modal('show');
                });
                mustUpgrade == false;
            } else if(opt == 1) {
                $('#modal-waiting').modal('hide');
                document.getElementById("firmwareNewVersion").innerHTML = "Não disponível";
                document.getElementById('modalErrorText').innerHTML = "Erro ao baixar firmware!";
                $('#modal-waiting').on('hidden.bs.modal', function (e) {
                    $('#modal-error').modal('show');
                });
                mustUpgrade == false;
            };
        }
    };

    xhttp.open("POST", "/firmware?option=" + option, true);
    xhttp.send();
}

function checkFirmware()
{
    var xhttp = new XMLHttpRequest();
    var opt = 0;

    xhttp.onreadystatechange = function() {
        if(this.readyState == 1) {
        } else if(this.readyState == 4 && this.status == 200) {
            var serverFirmware = this.responseText;
            var fw = serverFirmware.split(".");
            var srvFwMax = Number(fw[0]);
            var srvFwMin = Number(fw[1]);
            var srvFwRel = Number(fw[2]);
            if(srvFwMax > fwMax) { mustUpgrade = true;
            } else if((srvFwMax >= fwMax) && (srvFwMin > fwMin)) { mustUpgrade = true;
            } else if((srvFwMax >= fwMax) && (srvFwMin >= fwMin) && (srvFwRel > fwRel)) { mustUpgrade = true;
            } else if((srvFwMax == fwMax) && (srvFwMin == fwMin) && (srvFwRel == fwRel)) { mustUpgrade = false; };

            if(mustUpgrade == true) {
                document.getElementById('modalInfoText').innerHTML = "Atualização disponível: " + serverFirmware;
                $('#modal-info').modal('show');
            };

        } else if (this.readyState == 4 && this.status == 0) {
            $('#modal-waiting').modal('hide');
            document.getElementById("firmwareNewVersion").innerHTML = "Não disponível";
            document.getElementById('modalErrorText').innerHTML = "Erro ao verificar atualizações";
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
            mustUpgrade == false;
        }
    };

    xhttp.open("POST", "/firmware?option=" + opt, true);
    xhttp.send();

}

function saveNetworkIP()
{
    var useDHCP = document.getElementById('addressTypeDynamic').checked;
    var staticIP = document.getElementById('staticIP').value;
    var staticSN = document.getElementById('staticSN').value;
    var staticGW = document.getElementById('staticGW').value;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 1) {
          $('#modal-networkIP').modal('hide');
          $('#modal-waiting').modal({backdrop: 'static', keyboard: false});
        } else if(this.readyState == 4 && this.status == 200) {
            setTimeout(function() {
                $('#modal-waiting').modal('hide');
            }, 1000);

            document.getElementById('modalSuccessText').innerHTML = "Configuracoes de IP salvas.";

            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-success').modal('show');
            });
        } else if (this.readyState == 4 && this.status == 0) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Erro ao salvar configurações de IP.";
            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
        }
    };

    if(useDHCP == true) {
        xhttp.open("POST", "cgi-bin?opt=4&dhcp=" + 1, true);
    } else {
        xhttp.open("POST", "cgi-bin?opt=4&dhcp=" + 0 + "&ip=" + staticIP + "&sn=" + staticSN + "&gw=" + staticGW, true);
    }

    xhttp.send();
}

function saveUserPass()
{
    var user = document.getElementById('inputUsername').value;
    var pass = document.getElementById('inputPassword').value;

    var xhttp = new XMLHttpRequest();

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
    var tzOffset = new Date().getTimezoneOffset();
    var select = document.getElementById("timeZoneList");
    var idx = 0;
    var itemToSelect = 0;
    select.options.length = 0;

    for(index = 720; index > -840; index -= 60) {
        var gmt = ((index * -1) / 60);
        if(gmt < 0)
            var txt = "(GMT " + gmt + ":00)";
        else
            var txt = "(GMT+" + gmt + ":00)";

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
    var useNTP = document.getElementById('timestampDynamic').checked;
    var frmDate = document.getElementById('datePicker').value;
    var frmTime = document.getElementById('timePicker').value;
    var frmTZ = document.getElementById('timeZoneList').value;
    var frmSrv = document.getElementById('ntpServer').value;
    var unixtime = new Date(frmDate + " " + frmTime) / 1000;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 1) {
          $('#modal-datetime').modal('hide');
          $('#modal-waiting').modal({backdrop: 'static', keyboard: false});
        } else if(this.readyState == 4 && this.status == 200) {
            setTimeout(function() {
                $('#modal-waiting').modal('hide');
            }, 1000);

            document.getElementById('modalSuccessText').innerHTML = "Configuracoes de data/hora salvas.";

            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-success').modal('show');
            });

            getDateTime();

        } else if (this.readyState == 4 && this.status == 0) {
            $('#modal-waiting').modal('hide');
            document.getElementById('modalErrorText').innerHTML = "Erro ao ajustar data/hora";

            $('#modal-waiting').on('hidden.bs.modal', function (e) {
                $('#modal-error').modal('show');
            });
        }
    };

    if(useNTP == true) {
        xhttp.open("POST", "cgi-bin?opt=3&tz=" + frmTZ + "&ntp=" + 1 + "&ntpServer=" + frmSrv, true);
    } else {
        xhttp.open("POST", "cgi-bin?opt=3&tz=" + frmTZ + "&ntp=" + 0 + "&unixtime=" + unixtime, true);
    };

    xhttp.send();

}

function changeNTP()
{
    var useNTP = document.getElementById("timestampDynamic").checked;
    if(useNTP == true) {
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
    var useDHCP = document.getElementById('addressTypeDynamic').checked;
    if(useDHCP == true) {
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
    var select = document.getElementById("timedTestList");
    select.options.length = 0;

    for(index = 1; index < 100; index += 1) {
        if(index < 10)
            var txt = "0" + index;
        else
            var txt = index;
        select.options[select.options.length] = new Option(txt, index);
    }
    document.getElementById("timedTestList").selectedIndex = 0;
}


