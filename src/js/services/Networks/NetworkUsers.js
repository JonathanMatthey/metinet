angular.module('app.services')
	.factory('NetworkUsers', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/networks/:network_id/users/:user_id',{
			network_id:'@network_id',
			user_id:'@user_id'
		}, {
			confirm: {
				method: 'POST',
				params: {
					action: 'confirm'
				}
			},
			update: {
				method: 'PUT'
			},
			delete: {
				method: 'DELETE'
			}			
		});
	}]);