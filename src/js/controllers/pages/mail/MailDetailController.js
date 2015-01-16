app.controller('MailDetailController', [	'$scope',
											'Auth',
											'Conversations',
											'Messages',
											'StoreMessage',
											'$stateParams', function(	$scope,
																		Auth,
																		Conversations,
																		Messages,
																		StoreMessage,
																		$stateParams	) {
	var current_user		= Auth.getCredential('user_data');
	$scope.current_user		= current_user;

	$scope.init 	= function() {
		initWebSockets();
	}

	initWebSockets = function() {
		var channel = pusher.subscribe('Conversation_'+$stateParams.conversation_id);
		console.log(channel);
		channel.bind('message-stored', function(data) {
			console.log(data);
			$scope.conversation.messages.push(data.message);
			$scope.conversation.updater 	= data.updated_data.updater;
			$scope.conversation.updated_at 	= data.updated_data.updated_at;
			console.log($scope.conversation.updated_at);
			$scope.$apply();
		});
	};

	Conversations.get({id:$stateParams.conversation_id})
		.$promise.then(function(response) {
			$scope.conversation = response.data;
		});

	$scope.sendMessage = function() {
		StoreMessage.save({id:$stateParams.conversation_id}, {message: $scope.new_message})
			.$promise.then(function(response) {
				console.log(response.data);
				$scope.conversation.messages.push(response.data);
			});
	};

	$scope.deleteMessage = function(message_index) {
		var message = $scope.conversation.messages[message_index];

		$('.btn-delete.message-'+message.id).html('<i class="fa fa-spin fa-refresh"></i>');

		if (message.creator.id != current_user.id) {
			return false;
		}

		Messages.delete({id:message.id})
			.$promise.then(function() {
				$scope.conversation.messages.splice(message_index, 1);
			});

	}

}]);