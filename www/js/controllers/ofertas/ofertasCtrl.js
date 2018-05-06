app.controller('ofertasCtrl', function ($scope, $stateParams, ionicMaterialInk, $window) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();
    $scope.fab = function(){
        $window.open('https://twitter.com/satish_vr2011', '_blank');
    }
});