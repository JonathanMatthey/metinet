app.controller('MailListController', [	'$scope',
										'Auth',
										'Conversations',
										'$stateParams', function(	$scope,
																	Auth,
																	Conversations,
																	$stateParams	) {

	var current_user 	= Auth.getCredential('user_data');

	$scope.init 		= function() {
		$scope.getInbox();
		initWebSockets();
	}

	initWebSockets 		= function() {
		var channel 	= pusher.subscribe('Inbox_'+current_user.id);
		channel.bind('conversation-updated', function(data) {
			$scope.getInbox();
		});
	};

	$scope.getInbox 	= function() {
		$('.btn-refresh').html('<i class="fa fa-spin fa-refresh"></i>');
		Conversations.get()
			.$promise.then(function(response) {
				$scope.conversations = response.data;
				$('.btn-refresh').html('<i class="fa fa-refresh"></i>');
			});
	}

}]);