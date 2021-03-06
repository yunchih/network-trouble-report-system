angular
.module( "networkTroubleshooter")
.controller('profileController', 
	['$scope', 'Profile','User', 'vcRecaptchaService',
	function( $scope, Profile, User, vcRecaptchaService ){

	$scope.profile = {};
	$scope.fieldMappings = Profile.mappings;
	$scope.profilePatterns = Profile.patterns;
	$scope.submitted = false;
	$scope.submissionStatus = '';

	User.getProfile().then(function (profile) {
		$scope.profile = profile;
	});

	$scope.setCAPTCHA = function (res) {
		$scope.profile.recaptcha = res;
		$scope.warnCAPTCHA = false;
	};
	$scope.CAPTCHAexpired = function() {
		$scope.profile.recaptcha = '';
		$scope.warnCAPTCHA = true;
    };

	$scope.updateProfile = function (form) {

		if( !$scope.profile.recaptcha ){
			$scope.warnCAPTCHA = true;
		}

		if( form.$valid && User.checkProfileUpdated($scope.profile) ){
			$scope.submissionStatus = 'pending';
			componentHandler.upgradeDom(); // Reset material Progress Spinner	
			User.setProfile($scope.profile).then(function () {
				$scope.submissionStatus = 'done';
			});	
		}
		else{
			$scope.submitted = true;
		}	

	};
}]);