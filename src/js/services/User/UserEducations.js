angular.module('app.services')
	.factory('UserEducations', ['$resource', '$rootScope', function($resource, $rootScope) {
			return $resource($rootScope.api_url+'/profiles/:user_id/educations/:exp_id',{
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