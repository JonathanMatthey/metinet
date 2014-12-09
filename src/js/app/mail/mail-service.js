// A RESTful factory for retreiving mails from 'mails.json'
app.factory('mails', ['$http', 'Conversations', function ($http, Conversations) {
  var path = 'js/app/mail/mails.json';

  var mails = Conversations.query();
  // $http.get(path).then(function (resp) {
  //   return resp.data.mails;
  // });

  var factory = {};
  factory.all = function () {
    return mails;
  };
  factory.get = function (id) {
    console.log('getmail: '+id);
    var convo = _.find(mails, { 'id': id });
    return convo;
  };
  return factory;
}]);