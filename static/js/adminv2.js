// Socket.IO Connection
var conn_options = {'sync disconnect on unload':true};
var socket = io();

// Admin Page Viewer Chart
var ctx = document.getElementById('viewershipChart').getContext('2d');
//ctx.canvas.width = viewerChartWidth;
//ctx.canvas.height = viewerChartHeight;
var chart = new Chart(ctx, {
    responsive:false,
    maintainAspectRatio: false,
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        datasets: [
            {
            label: "Live Viewers",
            fill: true,
            borderColor: 'rgb(40, 90, 150)',
            backgroundColor: 'rgb(40, 90, 150)',
            spanGaps: true,
            lineTension: 0,
            data: viewerChartDataLive
            },
            {
            label: "Video Viewers",
            fill: true,
            borderColor: 'rgb(90, 150, 40)',
            backgroundColor: 'rgb(90, 150, 40)',
            spanGaps: true,
            lineTension: 0,
            data:viewerChartDataVideo
        }]
    },

    // Configuration options go here
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    parser: 'YYYY-MM-DD',
                    unit: 'day'
                }
            }],
        }
    }
});

$('#maxClipLength').on('input', function() {
  var sliderValue = $(this).val();
  if (sliderValue != "") {
    var maxValue = $(this).attr("max");
    if (sliderValue != maxValue) {
      var date = new Date(0);
      date.setSeconds(sliderValue);
      var timeString = date.toISOString().substr(11, 8);
    } else {
      timeString = "Infinite";
    }
    $(this).siblings("h3").find('.rangeSliderValue')[0].innerHTML = timeString;
  }
});

// oAuth Related JS
$(document).on("click", ".edit-oAuth-Button", function () {
     var oAuthID = $(this).data('id');
     var oAuthName = $(this).data('name');
     var oAuthType = $(this).data('authtype');
     var oAuthFriendlyName = $(this).data('friendlyname');
     var oAuthDisplayColor = $(this).data('displaycolor');
     var oAuthClientID = $(this).data('clientid');
     var oAuthClientSecret = $(this).data('clientsecret');
     var oAuthAccessTokenURL = $(this).data('accesstokenurl');
     var oAuthAccessTokenParams = $(this).data('accesstokenparams');
     var oAuthAuthorizeURL = $(this).data('authorizeurl');
     var oAuthAuthorizeParams = $(this).data('authorizeparams');
     var oAuthAPIBaseURL = $(this).data('apibaseurl');
     var oAuthClientKwargs = $(this).data('clientkwargs');
     var oAuthProfileEndpoint = $(this).data('profileendpoint');
     var oAuthIDValue= $(this).data('idvalue');
     var oAuthUsername = $(this).data('usernamevalue');
     var oAuthEmail = $(this).data('emailvalue');
     $("#oAuthID").val( oAuthID );
     $("#oAuthPreset").val( oAuthType )
     $("#oAuthName").val( oAuthName );
     $("#oAuthFriendlyName").val( oAuthFriendlyName );
     $("#oAuthColor").val( oAuthDisplayColor );
     $("#oAuthClient_id").val( oAuthClientID );
     $("#oAuthClient_secret").val( oAuthClientSecret );
     $("#oAuthAccess_token_url").val( oAuthAccessTokenURL );
     if (oAuthAccessTokenParams != 'None') {
         $("#oAuthAccess_token_params").val(JSON.parse(oAuthAccessTokenParams));
     }
     $("#oAuthAuthorize_url").val( oAuthAuthorizeURL );
     if (oAuthAuthorizeParams != 'None') {
         $("#oAuthAuthorize_params").val(JSON.parse(oAuthAuthorizeParams));
     }
     $("#oAuthApi_base_url").val( oAuthAPIBaseURL );
     if (oAuthClientKwargs != 'None') {
         $("#oAuthClient_kwargs").val(JSON.parse(oAuthClientKwargs));
     }
     $("#oAuthProfile_endpoint").val( oAuthProfileEndpoint );
     $("#oAuthIDValue").val( oAuthIDValue );
     $("#oAuthUsername").val( oAuthUsername );
     $("#oAuthEmail").val( oAuthEmail );
     updateOAuthModalWindowLayout();
     $("#newOauthModal").modal('show');
});

// Set Presets for oAuth
$(document).on("change", "#oAuthPreset", function () {
    updateOAuthModalWindowLayout();
});

// SocketIO Handlers
socket.on('connect', function() {
    console.log('Connected to SocketIO');
    get_all_osp_component_status();
});

socket.on('admin_osp_component_status_update', function (msg) {
    var componentStatusName = msg['component'];
    var status = msg['status'];

    console.log('Received Component Update - ' + componentStatusName);
    componentIDDiv = document.getElementById('component-status_' + componentStatusName);

    var html = ''
    if (status === 'OK') {
        html = '<i class="text-success fas fa-check" title="' + msg['message'] + '"></i>'
    } else if (status === 'Problem') {
        html = '<i class="text-warning fas fa-exclamation-triangle" title="' + msg['message'] + '"></i>'
    } else {
        html = '<i class="text-danger fas fa-times" title="' + msg['message'] + '"></i>'
    }
    componentIDDiv.innerHTML = html;
    console.log(msg['message']);
});


function updateSlider(inputID) {
    var sliderValue = $(inputID).val();
      if (sliderValue != "") {
        var maxValue = $(inputID).attr("max");
        if (sliderValue != maxValue) {
          var date = new Date(0);
          date.setSeconds(sliderValue);
          var timeString = date.toISOString().substr(11, 8);
        } else {
          timeString = "Infinite";
        }
        $(inputID).siblings("h3").find('.rangeSliderValue')[0].innerHTML = timeString;
      }
}

function get_osp_component_status(component) {
    socket.emit('admin_get_component_status', {component: component});
}

function get_all_osp_component_status() {
    get_osp_component_status('osp_core');
    get_osp_component_status('osp_rtmp');
    get_osp_component_status('osp_celery');
    get_osp_component_status('osp_ejabberd_chat');
    get_osp_component_status('osp_ejabberd_xmlrpc');
    get_osp_component_status('osp_database');
    get_osp_component_status('osp_redis');
}

function updateOAuthModalWindowLayout() {
    var authType = document.getElementById("oAuthPreset").value;
    switch(authType) {
        case "Custom":
            $("#oAuthAccess_token_url").attr("disabled", false);
            $("#oAuthAccess_token_urlDiv").show();
            $("#oAuthAccess_token_params").attr("disabled", false);
            $("#oAuthAccess_token_paramsDiv").show();
            $("#oAuthAuthorize_url").attr("disabled", false);
            $("#oAuthAuthorize_urlDiv").show();
            $("#oAuthAuthorize_params").attr("disabled", false);
            $("#oAuthAuthorize_paramsDiv").show();
            $("#oAuthApi_base_url").attr("disabled", false);
            $("#oAuthApi_base_urlDiv").show();
            $("#oAuthClient_kwargs").attr("disabled", false);
            $("#oAuthClient_kwargsDiv").show();
            $("#oAuthProfile_endpoint").attr("disabled", false);
            $("#oAuthProfile_endpointDiv").show();
            $("#oAuthIDValue").attr("disabled", false);
            $("#oAuthIDValueDiv").show();
            $("#oAuthUsername").attr("disabled", false);
            $("#oAuthUsernameDiv").show();
            $("#oAuthEmail").attr("disabled", false);
            $("#oAuthEmailDiv").show();
            break;
        default:
            $("#oAuthAccess_token_url").attr("disabled", true);
            $("#oAuthAccess_token_urlDiv").hide();
            $("#oAuthAccess_token_params").attr("disabled", true);
            $("#oAuthAccess_token_paramsDiv").hide();
            $("#oAuthAuthorize_url").attr("disabled", true);
            $("#oAuthAuthorize_urlDiv").hide();
            $("#oAuthAuthorize_params").attr("disabled", true);
            $("#oAuthAuthorize_paramsDiv").hide();
            $("#oAuthApi_base_url").attr("disabled", true);
            $("#oAuthApi_base_urlDiv").hide();
            $("#oAuthClient_kwargs").attr("disabled", true);
            $("#oAuthClient_kwargsDiv").hide();
            $("#oAuthProfile_endpoint").attr("disabled", true);
            $("#oAuthProfile_endpointDiv").hide();
            $("#oAuthIDValue").attr("disabled", true);
            $("#oAuthIDValueDiv").hide();
            $("#oAuthUsername").attr("disabled", true);
            $("#oAuthUsernameDiv").hide();
            $("#oAuthEmail").attr("disabled", true);
            $("#oAuthEmailDiv").hide();
            break;
    }
}

function resetOAuthForm() {
    document.getElementById("OAuthForm").reset();
    $("#oAuthID").val('');
    updateOAuthModalWindowLayout();
}

function toggleHiddenRTMP(rtmpID) {
    socket.emit('toggleHideOSPRTMP', {rtmpID: rtmpID});
}

function deleteRTMP(rtmpID) {
    socket.emit('deleteOSPRTMP', {rtmpID: rtmpID});
    var rtmpTableRow = document.getElementById('rtmpTableRow-' + rtmpID);
    rtmpTableRow.parentNode.removeChild(rtmpTableRow);
}

function toggleActiveRTMP(rtmpID) {
    socket.emit('toggleOSPRTMP', {rtmpID: rtmpID});
}

function deleteEdge(edgeID) {
    socket.emit('deleteOSPEdge', {edgeID: edgeID});
    var edgeTableRow = document.getElementById('edgeTableRow-' + edgeID);
    edgeTableRow.parentNode.removeChild(edgeTableRow);
}

function toggleActiveEdge(edgeID) {
    socket.emit('toggleOSPEdge', {edgeID: edgeID});
}

function checkEdge(edgeID) {
    var oldStatusDiv = document.getElementById('nodeStatus-' + edgeID);
    oldStatusDiv.innerHTML = '<span id="nodeStatus-' + edgeID + '"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></span>';
    socket.emit('checkEdge', {edgeID: edgeID});
}

function rebuildEdgeConf(){
    socket.emit('rebuildEdgeConf', {message: 'true'});
    createNewBSAlert("Config File Rebuilt.  Please restart the nginx-osp service on each OSP-Core server to take effect", "Success");
}

function openNewWebhookModal() {
    $('#newWebhookModal').modal('show');
    var webhookName = document.getElementById('webhookName');
    var webhookEndpoint = document.getElementById('webhookEndpoint');
    var webhookHeader = document.getElementById('webhookHeader');
    var webhookPayload = document.getElementById('webhookPayload');
    var webhookReqTypeElement = (document.getElementById('webhookReqType'));
    var webhookTriggerElement = document.getElementById('webhookTrigger');
    var webhookInputAction = document.getElementById('webhookInputAction');
    var webhookInputID = document.getElementById('webhookID');

    webhookInputID.value = 'New';
    webhookName.value = "";
    webhookEndpoint.value = "";
    webhookHeader.value = "";
    webhookPayload.value = "";
    webhookReqTypeElement.value = 0;
    webhookTriggerElement.value = 0;
    webhookInputAction.value = 'new';
}

function deleteWebhookModal(webhookID) {
    document.getElementById('deleteWebhookID').value = webhookID;
    $('#confirmDeleteWebhookModal').modal('show');
}

function deleteWebhook() {
    var webhookID = document.getElementById('deleteWebhookID').value;
    socket.emit('deleteGlobalWebhook', {webhookID: webhookID});
    var webhookTableRow = document.getElementById('webhookTableRow-' + webhookID);
    webhookTableRow.parentNode.removeChild(webhookTableRow);
}

function submitWebhook() {
    var webhookName = document.getElementById('webhookName').value;
    var webhookEndpoint = document.getElementById('webhookEndpoint').value;
    var webhookHeader = document.getElementById('webhookHeader').value;
    var webhookPayload = document.getElementById('webhookPayload').value;
    var webhookReqTypeElement = (document.getElementById('webhookReqType'));
    var webhookTriggerElement = document.getElementById('webhookTrigger');
    var webhookReqType = webhookReqTypeElement.options[webhookReqTypeElement.selectedIndex].value;
    var webhookTrigger = webhookTriggerElement.options[webhookTriggerElement.selectedIndex].value;
    var webhookInputAction = document.getElementById('webhookInputAction').value;
    var webhookInputID = document.getElementById('webhookID').value;

    if (webhookName == '') {
        (document.getElementById('webhookName')).setCustomValidity('Name is Required');
    }
    if (webhookEndpoint == '') {
        (document.getElementById('webhookEndpoint')).setCustomValidity('Endpoint URL is Required');
    }
    socket.emit('submitGlobalWebhook', {webhookName: webhookName, webhookEndpoint: webhookEndpoint, webhookHeader:webhookHeader, webhookPayload:webhookPayload, webhookReqType: webhookReqType, webhookTrigger: webhookTrigger, inputAction:webhookInputAction, webhookInputID:webhookInputID});
}

function editWebhook(webhookID) {
    var webhookTrigger = document.getElementById('webhookTrigger');
    var webhookName = document.getElementById('webhookName');
    var webhookEndpoint = document.getElementById('webhookEndpoint');
    var webhookHeader = document.getElementById('webhookHeader');
    var webhookPayload = document.getElementById('webhookPayload');
    var webhookReqTypeElement = document.getElementById('webhookReqType');
    var webhookInputAction = document.getElementById('webhookInputAction');
    var webhookInputID = document.getElementById('webhookID');

    var triggerVal = document.getElementById('webhookRowTrigger-' + webhookID).innerText;

    switch(triggerVal) {
      case 'Stream Start':
        triggerVal = 0;
        break;
      case 'Stream End':
        triggerVal = 1;
        break;
      case 'Stream Viewer Join':
        triggerVal = 2;
        break;
      case 'Stream Viewer Upvote':
        triggerVal = 3;
        break;
      case 'Stream Name Change':
        triggerVal = 4;
        break;
      case 'Chat Message':
        triggerVal = 5;
        break;
      case 'New Video':
        triggerVal = 6;
        break;
      case 'Video Comment':
        triggerVal = 7;
        break;
      case 'Video Upvote':
        triggerVal = 8;
        break;
      case 'Video Name Change':
        triggerVal = 9;
        break;
      case 'Channel Subscription':
        triggerVal = 10;
        break;
      case 'New User':
        triggerVal = 20;
        break;
      default:
        triggerVal = 0;
    }

    webhookName.value = document.getElementById('webhookRowName-' + webhookID).innerText;
    webhookEndpoint.value = document.getElementById('webhookRowEndpoint-' + webhookID).innerText;
    webhookHeader.value = document.getElementById('webhookRowHeader-' + webhookID).innerText;
    webhookPayload.value = document.getElementById('webhookRowPayload-' + webhookID).innerText;
    webhookReqTypeElement.value = document.getElementById('webhookRowType-' + webhookID).innerText;
    webhookTrigger.value = triggerVal;
    webhookInputAction.value = 'edit';
    webhookInputID.value = webhookID;

    $('#newWebhookModal').modal('show');
    webhookHeader.value = JSON.stringify(JSON.parse(webhookHeader.value), undefined, 2);
    webhookPayload.value = JSON.stringify(JSON.parse(webhookPayload.value), undefined, 2);
}

function testWebhook(webhookID) {
    socket.emit('testWebhook', {webhookID: webhookID, webhookType: 'global'});
    createNewBSAlert("Webhook Test Sent","success")
}

function deleteStickerModal(stickerID) {
    document.getElementById('deleteStickerID').value = stickerID;
    $('#deleteStickerModal').modal('show');
}

function deleteSticker() {
    stickerID = document.getElementById('deleteStickerID').value;
    socket.emit('deleteSticker', {stickerID: stickerID});
    stickerDiv = document.getElementById('sticker-' + stickerID);
    stickerDiv.parentNode.removeChild(stickerDiv);
    document.getElementById('deleteStickerID').value = "";
    createNewBSAlert("Sticker Deleted","success")
}

function editStickerModal(stickerID) {
    stickerName = document.getElementById('sticker-name-' + stickerID).value;
    socket.emit('editSticker', {stickerID: stickerID, stickerName: stickerName});
    createNewBSAlert("Sticker Edited","success")
}

function disable2FAModal(userID) {
    var userIDInputDiv = document.getElementById('disable2FAUser');
    userIDInputDiv.value = userID;
    $('#disable2faModal').modal('show');
}

function disable2FA() {
    var userIDInputDiv = document.getElementById('disable2FAUser');
    var userID = userIDInputDiv.value;
    socket.emit('disable2FA', {userID: userID});
    var buttonSelector = document.getElementById('2fa-active-button-' + userID);
    buttonSelector.disabled = true;
}

function updateDefaultRoles() {
    var streamerChecked = document.getElementById("drole-streamer").checked;
    var recorderChecked = document.getElementById("drole-recorder").checked;
    var uploaderChecked = document.getElementById("drole-uploader").checked;
    socket.emit('updateDefaultRoles',{streamer: streamerChecked, recorder: recorderChecked, uploader: uploaderChecked});
}

function bulkAddRole(rolename) {
    var userIDArray = [];
    $("input:checkbox[name=selector-user]:checked").each(function(){
        userIDArray.push($(this).val());
    });

    socket.emit('bulkAddRoles',{users: userIDArray, role: rolename});
    window.location.replace("/settings/admin?page=users");
}

function deleteTopicModal(topicID) {
    document.getElementById('deleteTopicID').value = topicID;
    $('#deleteTopicModal').modal('show');
}

function deleteTopic() {
    topicID = document.getElementById('deleteTopicID').value;
    newTopic = document.getElementById('deleteNewTopicId').value;
    socket.emit('deleteTopic', {topicID: topicID, toTopicID: newTopic});
    topicDiv = document.getElementById('topic-' + topicID);
    topicDiv.parentNode.removeChild(topicDiv);
    document.getElementById('deleteTopicID').value = "";
    document.getElementById('deleteNewTopicId').value = "";
    createNewBSAlert("Topic Deleted","success")
}

function editTopicModal(topicID) {
    topicName = document.getElementById('topic-name-' + topicID).value;
    socket.emit('editTopic', {topicID: topicID, topicName: topicName});
    createNewBSAlert("Topic Edited","success")
}

function deleteChannelModal(channelID) {
    document.getElementById('deleteChannelID').value = channelID;
    $('#confirmDeleteChannelModal').modal('show');
}

function deleteChannel() {
    var channelID = document.getElementById('deleteChannelID').value;
    socket.emit('deleteChannel', {channelID: channelID});
    var channelTableRow = document.getElementById('channelCardRow-' + channelID);
    channelTableRow.parentNode.removeChild(channelTableRow);
}