angular.module('app.services')
	.factory('ChangePermitStatus', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/permits/:id/change-status/:action',{
			id:'@id',
			action:'@action'
		},{
			update: {
				method: 'PUT'
			}
		});
	}]);