angular
.module( "networkTroubleshooter")
.factory('Request',['$http', 'API', 'Session', function($http, API, Session){

	var apiBase = [ API.base , API.version ].join('/');
	var api = API.api;
	
	var appendAccessToken = function (data) {
		data.access_token = Session.token;
        return data;
	};

	var GET_request = function (url_body) {
		return $http({
			method: 'GET',
			url: apiBase + '/' + url_body,
			params: appendAccessToken({})
		});
	};

	var POST_request = function (url_body, data, token_not_required) {
		return $http({
			method: 'POST',
			url: apiBase + '/' + url_body,
			params: token_not_required ? data : appendAccessToken(data)
		});
	};

	return {
		login: function (userCredential) {
			return POST_request( api.Login, userCredential, true /* login does not require token */);
		},
		updateUserProfile: function (profile) {
			return POST_request( api.UpdateUserProfile, profile );
		},
		updateSingleUserProfile: function (query, prop, value) {
			var url = [ api.UpdateSingleUserProfile , prop , value ].join('/');
			return POST_request( url , query );
		},
		initializeUserProfile: function () {
			return GET_request( api.GetUserProfile ); 
		},
		getUserProfile: function () {	
			return GET_request( api.GetUserProfile );
		},
		getSingleUserProfile: function (prop, value) {
			var url = [ api.GetSingleUserProfile , prop , value ].join('/');
			return GET_request( url );
		},
		register: function () {
			return POST_request( api.Register, query );
		},
		triggerEmailConfirmation: function (query) {
			return POST_request( api.EmailConfirmation, query );
		},
		contact: function (query) {
			return POST_request( api.SendReport, query );
		}
	};
}]);