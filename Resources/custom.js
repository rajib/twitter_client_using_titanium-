Twitter = function () {
	// user credentials
	var username, password, screen_name;
	function make_basic_auth(user, password) {
		var tok = user + ':' + password;
		var hash = Base64.encode(tok);
		return "Basic " + hash;
	}

	function switch_to_main() {
		$('#loginForm').hide(); //disappear login form
		$('#loggedInBlock').show(); //show main content after login success
		alert("Login Success");
	}

	return {
		login: function () {
			username = $('#username').val();
			password = $('#password').val();
			var auth = make_basic_auth(username, password);
			var url = "http://twitter.com/account/verify_credentials.json";

			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'json',
				beforeSend: function (req) {
					req.setRequestHeader('Authorization', auth);
				},
				success: function (json, textStatus) {
					switch_to_main();
					screen_name = json.screen_name;
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("Login Failed");
				}
			});
		},
		update_status: function (status_msg) {
			var auth = make_basic_auth(username, password);
			var url = "http://twitter.com/statuses/update.json";
			$.ajax({
				type: "POST",
				url: url,
				data: {status: status_msg},
				dataType: 'json',
				beforeSend: function (req) {
					req.setRequestHeader('Authorization', auth);
				},
				success: function (json) {
					alert("Your updated successfully posted to Twitter")
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert(XMLHttpRequest.responseText);
				}
			});
    }
	}
}();

$(function(){
	// Enable disable update button
	$('#statusUpdateForm #statusUpdateInput').keyup(function () {
		if ($.trim($('#statusUpdateForm #statusUpdateInput').val()).length > 0) {
			$('#updateSubmit').attr('disabled', false);
		} else if (($('#statusUpdateForm #statusUpdateInput').val().length < 1)) {
			$('#updateSubmit').attr('disabled', true);
		}
	});
	// Turns the form to AjaxForm
  $('#statusUpdateForm').ajaxForm(function () {
  	Twitter.update_status($('#statusUpdateForm #statusUpdateInput').val());
  });
});
