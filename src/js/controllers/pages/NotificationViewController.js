angular.module('app.controllers').controller('NotificationViewController', [	'$scope',
																				'$state',
																				'Notifications',
																				'UserNotifications', 	function(	$scope,
																													$state,
																													Notifications,
																													UserNotifications	) {
	$scope.notifications 			= [];
	$scope.notifications_requested	= false

	$scope.init = function() {
		$scope.getNotifications();
	}

	$scope.getNotifications 	= function() {
		$scope.notifications_requested	= true;
		var _skip 						= $scope.notifications.length;
		console.log(_skip);
		UserNotifications.get({option:'all', skip:_skip})
			.$promise.then(function(response) {
				if (_skip == 0) {
					$scope.notifications 		= response.data;
				} else {
					$scope.notifications 		= $scope.notifications.concat(response.data);
				}
				$scope.notifications_requested	= false;
			});
	}

	$scope.markAsRead = function(notification_index) {
		var _notification = $scope.notifications[notification_index];
		console.log(_notification);
		Notifications.markAsRead({notification_id:_notification.id})
			.$promise.then(function(response) {
				$scope.notifications[notification_index] = response.data;
			});
	}

}]);