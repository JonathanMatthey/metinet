app.controller('UserCtrl', ['$scope', '$http', '$filter', 'Auth', function($scope, $http, $filter, Auth) {
  // Auth.setCredentials('jemima.scott@fakeremail.com','test1234');

  $http.get('js/app/users/users.json').then(function (resp) {
    $scope.items = resp.data.items;
    $scope.item = $filter('orderBy')($scope.items, 'first')[0];
    $scope.item.selected = true;
  });

  $http.get('http://178.62.102.108/users',{ headers: {'Authorization': 'Basic amVtaW1hLnNjb3R0QGZha2VyZW1haWwuY29tOnRlc3QxMjM0'}}    ).then(function (res) {
    console.log('-- users');
    console.log(res)
  });

  $scope.filter = '';
  $scope.networks = [
    {name: 'ARUP'},
    {name: 'Network 1'}
  ];

  $scope.createNetwork = function(){
    var network = {name: 'New Network'};
    network.name = $scope.checkItem(network, $scope.networks, 'name');
    $scope.networks.push(network);
  };

  $scope.checkItem = function(obj, arr, key){
    var i=0;
    angular.forEach(arr, function(item) {
      if(item[key].indexOf( obj[key] ) == 0){
        var j = item[key].replace(obj[key], '').trim();
        if(j){
          i = Math.max(i, parseInt(j)+1);
        }else{
          i = 1;
        }
      }
    });
    return obj[key] + (i ? ' '+i : '');
  };

  $scope.deleteNetwork = function(item){
    $scope.networks.splice($scope.networks.indexOf(item), 1);
  };

  $scope.selectNetwork = function(item){
    angular.forEach($scope.networks, function(item) {
      item.selected = false;
    });
    $scope.network = item;
    $scope.network.selected = true;
    $scope.filter = item.name;
  };

  $scope.selectItem = function(item){
    angular.forEach($scope.items, function(item) {
      item.selected = false;
      item.editing = false;
    });
    $scope.item = item;
    $scope.item.selected = true;
  };

  $scope.deleteItem = function(item){
    $scope.items.splice($scope.items.indexOf(item), 1);
    $scope.item = $filter('orderBy')($scope.items, 'first')[0];
    if($scope.item) $scope.item.selected = true;
  };

  $scope.createItem = function(){
    var item = {
      network: 'Friends',
      avatar:'img/a0.jpg'
    };
    $scope.items.push(item);
    $scope.selectItem(item);
    $scope.item.editing = true;
  };

  $scope.editItem = function(item){
    if(item && item.selected){
      item.editing = true;
    }
  };

  $scope.doneEditing = function(item){
    item.editing = false;
  };

}]);