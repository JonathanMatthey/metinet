angular.module('app.services')
	.factory('ChangeLongLeadStatus', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/long-leads/:id/change-status/:action',{
			id:'@id',
			action:'@action'
		},{
			update: {
				method: 'PUT'
			}
		});
	}]);