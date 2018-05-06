app.controller('signinCtrl', function($scope, $state) {
    console.log('hola, caremonda');
    $scope.user = {}
    $scope.create = function(){
        console.log($scope.user);
        $state.go('init.login');
    }
});