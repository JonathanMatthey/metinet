app.controller('MailCtrl', ['$scope','$http','Conversations','Auth','$location', function($scope, $http, Conversations,Auth,$location) {
  $scope.userid = Auth.getCredential("userid");
  $scope.conversations = {};
  $scope.ready = false;

  var inbox_channel = pusher.subscribe('Inbox_'+$scope.userid);
  inbox_channel.bind('conversation-stored', function(data) {
    $scope.getConversations();
  });

  $scope.init = function(){
    $scope.getConversations();
    // $http.get('http://178.62.102.108/conversations/latest').then(function (resp) {
    //   console.log('resp ')
    //   console.log(resp )
    // });

    // $http.get('http://178.62.102.108/conversations/recipients').then(function (resp) {
    //   console.log('resp ')
    //   console.log(resp )
    // });
  }

  $scope.getConversations = function(){
    $scope.conversations = Conversations.query();
    $scope.conversations.$promise.then(function () {
      $location.path('app/mail/'+$scope.conversations[0].id);
      $scope.ready = true;
    });
  }

  $scope.addLabel = function(){
    $scope.labels.push(
      {
        name: $scope.newLabel.name,
        filter: angular.lowercase($scope.newLabel.name),
        color: '#ccc'
      }
    );
    $scope.newLabel.name = '';
  }

  $scope.labelClass = function(label) {
    return {
      'b-l-info': angular.lowercase(label) === 'angular',
      'b-l-primary': angular.lowercase(label) === 'bootstrap',
      'b-l-warning': angular.lowercase(label) === 'client',
      'b-l-success': angular.lowercase(label) === 'work'
    };
  };

}]);

app.controller('MailListCtrl', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  $scope.fold = $stateParams.fold;
  // mails.all().then(function(mails){
  //   $scope.mails = mails;
  // });
}]);

app.controller('MailDetailCtrl', ['$scope', 'mails', '$stateParams', 'Conversations', '$http', 'Auth',  function($scope, mails, $stateParams, Conversations,$http, Auth) {
  $scope.conversation = {};
  $scope.messageBody = "";
  $scope.userid = Auth.getCredential("userid");
  $scope.ready=false;

  var conv_channel = pusher.subscribe('Conversation_'+$stateParams.mailId);
  conv_channel.bind('message-stored', function(data) {
    $scope.getConversation();
  });


  $scope.init = function(){
    $scope.getConversation();
  }

  $scope.getConversations = function(){
    $scope.conversations = Conversations.query();
  }

  $scope.getConversation = function(){
    Conversations.get({
      id:$stateParams.mailId
    })
    .$promise.then(function(res) {
      // success handler
      $scope.conversation = res.data;
      $scope.ready=true;
    });
  }

  $scope.sendMessage = function(){
    $http.post('http://178.62.102.108/conversations/' + $stateParams.mailId + '/message', {
      message: $scope.messageBody
    })
    .then(function(response) {
      $scope.messageBody = "";
      $scope.getConversation();
    });
  }

}]);

app.controller('MailNewCtrl', ['$scope', '$http','Conversations', '$location', 'Auth', function($scope, $http,Conversations, $location, Auth) {
  $scope.mail = {
    recipients: '',
    subject: '',
    message: ''
  }

  $scope.tolist = [];

  $http.get('http://178.62.102.108/conversations/recipients').then(function (resp) {
    $scope.tolist = resp.data.data;
    console.log('$scope.tolist');
    console.log($scope.tolist);
    // this is a bad hack... needs resolved correctly with angular / ui-jq and chosen dependencies but prob take a good 5 - 6 hours to figure out
    setTimeout(function(){
      $("#new-msg-to").chosen();
    },500)
  });

  $scope.userid = Auth.getCredential("userid");

  $scope.startConversation = function(){
    Conversations.save($scope.mail,function(u, putResponseHeaders) {
      $scope.mail = {
        recipients: '',
        subject: '',
        message: ''
      };

      var newConvoId = u.data[0].id;
      $location.path('app/mail/inbox/');
    });
  }
}]);

angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});