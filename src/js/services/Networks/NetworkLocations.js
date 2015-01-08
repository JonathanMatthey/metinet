angular.module('app.services')
	.factory('NetworkLocations', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/networks/:network_id/locations/:loc_id',{
			network_id:'@network_id',
			loc_id:'@loc_id'
		}, {
			update: {
				method: 'PUT'
			},
			delete: {
				method: 'DELETE'
			}			
		});
	}]);