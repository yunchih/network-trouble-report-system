angular
.module( "networkTroubleshooter")
.controller( "confirmController", [ "$scope",  "User", function( $scope, User ){

	var recaptcha = "";

	$scope.confirmationString = "";

	$scope.wrongString = false;

	$scope.resend = {
		showPrompt: false,
		status: '',
		message: ''
	};

	var resendSuccess = {
		showPrompt: false,
		status: 'resendComplete',
		message: '驗證碼已經寄送'
	};
	var resendFail = {
		showPrompt: false,
		status: 'resendError'
	};

	$scope.verifyConfirmationString = function () {
		$scope.resendComplete = false;
		if( $scope.confirmationString ){
			User.registerBackend( $scope.confirmationString ).then(
				function (res) {
					// has been redirected
				},
				function (error_msg) {
					$scope.wrongString = true;
				}
			);
		}
		else{
			$scope.wrongString = true;
		}

	};

	$scope.resendConfirmationString = function () {
		if( recaptcha ){
			User.sendConfirmationMail(recaptcha).then(
				function (res) {
					$scope.resend = resendSuccess;
				},
				function (error_msg) {
					$scope.resend = resendFail;
					$scope.resend.message = error_msg;
				}
			);
		}
	};

	$scope.setCAPTCHA = function (res) {
		recaptcha = res;
	};

	$scope.CAPTCHAexpired = function() {
		recaptcha = "";
    };
}]);