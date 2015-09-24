angular
.module( "networkTroubleshooter")
.service('User', 
    [ '$rootScope', '$facebook','$q','$location', 'Identity', 'Request', 'Session', 
    function( $rootScope, $facebook, $q, $location, Identity, Request, Session ){
    
    var authorizedBy,
        termOfService = false,
        registered = false,
        profile = {};

/*
 *
 *  Configuring Navigation bar layout
 *
 */

    var navbarLayout = {};

    navbarLayout[Identity.authorizedBy.None] = [
        { 
            title: '登入',
            url: '/#/user/login'
        }
    ];
    navbarLayout[Identity.authorizedBy.FB] = [
        { 
            title: '登出',
            url: '/#/',
        }
    ];

    navbarLayout[Identity.authorizedBy.Backend] = navbarLayout[Identity.authorizedBy.FB];

    var getFacebookProfile = function () {
        return $facebook.api("/me").then(
            function (res) {
                authorizedBy = Identity.authorizedBy.FB;
                return { 
                    name: res.name,
                    fb_id: res.id
                };
            },
            function (res) {
                authorizedBy = Identity.authorizedBy.None;
                return {};
            }
        );
    };
    var setCurrentUser = function ($scope, user) {
        $scope.currentUser = user;
        $scope.navBar = navbarLayout[ authorizedBy ];
    };

    var loginBackend = function (userFacebookCredential) {
        return Request.login(userFacebookCredential).then(
            function (response) {

                Session.store( response.data.access_token, userFacebookCredential.access_token );

                if( !response.registered ){
                    registered = false;
                    $location.path('termOfService');
                }
                else {
                    registered = true;
                    // Take the user back to where he used to be.
                    $location.path( $rootScope.savedLocation );
                }
            },
            function (rejection) {
                console.log("Login Backend Failed! ",rejection);
            }
        );
    };

    this.sendConfirmationMail = function (_recaptcha) {
        return Request.triggerEmailConfirmation({
                student_id: profile.student_id,
                recaptcha: _recaptcha || profile.recaptcha
            }).then(

                function () {
                    $location.path('mailConfirm');
                },

                function (error) {
                    return $q.reject( ErrorMessage(error.error_code) );
                }
            );
    };

    this.registerBackend = function (confirmationString) {
        if( termOfService ){
            
            profile.agree = true;
            profile.validate_code = confirmationString;

            return Request.register(profile).then(
                function (res) {
                    console.log("Register Successfully!");
                    registered = true;
                    $location.path('/');
                },
                function (error) {
                    return $q.reject( ErrorMessage(error.error_code) );
                }
            );
        }
        else{
            $location.path('termOfService');
        }
    };

    this.agreeTermOfService = function () {
        termOfService = true;
    };

    this.login = function ($scope) {
        var loginPromise = getFacebookProfile().then(
            function (FBidentity) {
                setCurrentUser($scope, FBidentity);

                var FacebookAuthResponse = $facebook.getAuthResponse() || {};
                var userFacebookCredential = {
                    access_token: FacebookAuthResponse.accessToken,
                    fb_id: FacebookAuthResponse.userID 
                };

                if( !userFacebookCredential.access_token || !userFacebookCredential.fb_id )
                    return $q.reject();

                console.log("User credential", userFacebookCredential);
                return loginBackend(userFacebookCredential);
            },
            function () {
                setCurrentUser($scope, {});
                return $q.reject();
            }
        );
        
        return loginPromise;
    };

    this.logout = function ($scope) {
        console.log("User logs out");
        authorizedBy = Identity.authorizedBy.None;
        registered = false;
        profile = {};
        setCurrentUser($scope, {});
    };

    this.getProfile = function () {
        if( !registered )
            return $q.when({}); 

        if( !this.profile ){
            return Request.getUserProfile().then(function (res) {
                profile = res.data;
                return profile;
            });
        }
        else {
            return $q.when(this.profile); 
        }
    };
    this.checkProfileUpdated = function(_profile) {

        var newProfileFields = Object.getOwnPropertyNames(profile);
        var oldProfileFields = Object.getOwnPropertyNames(_profile);

        if (newProfileFields.length != oldProfileFields.length) {
            return true;
        }

        for (var i = 0; i < newProfileFields.length; i++) {
            var field = newProfileFields[i];

            if (this.profile[field] !== _profile[field]) {
                return true;
            }
        }

        return false;
    };
    this.setProfile = function (_profile) {
        profile = _profile;
        if( registered ){
            return Request.updateUserProfile(_profile).then(function () {
               console.log("Successfully update user profile"); 
            });
        }
        else{
            return $location.path('confirm'); 
        }
            
    };

    this.getIdentity = function () {
        return authorizedBy;
    };

    this.canAccessRestrictedRoute = function () {
        return authorizedBy != Identity.authorizedBy.None;
    };

}]);
