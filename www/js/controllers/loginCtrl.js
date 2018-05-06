app.controller('loginCtrl', function($scope, $state) {
    console.log('hola, careverga');

    $scope.login = function(){
        $state.go('app.ofertas')
    }

    $scope.create = function(){
        $state.go('init.signin')
    }
});