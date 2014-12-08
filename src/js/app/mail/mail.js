app.controller('MailCtrl', ['$scope','$http','Conversations', function($scope, $http, Conversations) {
  $scope.folds = [
    {name: 'Inbox', filter:''},
    {name: 'Starred', filter:'starred'},
    {name: 'Sent', filter:'sent'},
    {name: 'Important', filter:'important'},
    {name: 'Draft', filter:'draft'},
    {name: 'Trash', filter:'trash'}
  ];

  $scope.labels = [
    {name: 'Angular', filter:'angular', color:'#23b7e5'},
    {name: 'Bootstrap', filter:'bootstrap', color:'#7266ba'},
    {name: 'Client', filter:'client', color:'#fad733'},
    {name: 'Work', filter:'work', color:'#27c24c'}
  ];

  $scope.conversations = {};

  $scope.init = function(){
    $scope.getConversations();

    $http.get('http://178.62.117.241/conversations/latest').then(function (resp) {
      console.log('resp ')
      console.log(resp )
    });

    $http.get('http://178.62.117.241/conversations/recipients').then(function (resp) {
      console.log('resp ')
      console.log(resp )
    });
  }

  $scope.getConversations = function(){
    $scope.conversations = Conversations.query();
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
  mails.all().then(function(mails){
    $scope.mails = mails;
  });
}]);

app.controller('MailDetailCtrl', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  mails.get($stateParams.mailId).then(function(mail){
    $scope.mail = mail;
  })
}]);

app.controller('MailNewCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.mail = {
    to: '',
    subject: '',
    content: ''
  }

  $scope.tolist = [];

  $http.get('http://178.62.117.241/conversations/recipients').then(function (resp) {
    $scope.tolist = resp.data.data;
    console.log('$scope.tolist');
    console.log($scope.tolist);
    // this is a bad hack... needs resolved correctly with angular / ui-jq and chosen dependencies but prob take a good 5 - 6 hours to figure out
    setTimeout(function(){
      $("#new-msg-to").chosen();
    },500)
  });
}]);

angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});