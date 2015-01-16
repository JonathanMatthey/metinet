angular.module('app.services')
	.factory('Notifications', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/notifications/:notification_id', {
			notification_id:'@notification_id'
		}, {
			markAsRead: {
				method: 'PUT'
			}
		});
	}]);