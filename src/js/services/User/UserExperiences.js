angular.module('app.services')
	.factory('UserExperiences', ['$resource', '$rootScope', function($resource, $rootScope) {
			return $resource($rootScope.api_url_version+'/profiles/:user_id/experiences/:exp_id',{
			user_id:'@user_id',
			exp_id:'@exp_id'
		},{
			store: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			}
		});
	}]);