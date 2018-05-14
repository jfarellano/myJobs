app.controller('empresasCtrl', function ($scope, $state, $window, users, Auth) {
    $scope.users = users
    // $scope.fab = function(){
    // $window.open('https://twitter.com/satish_vr2011', '_blank');
    //     console.log(Auth.$getAuth())
    // }

    // $scope.empresasData = empresasData
    // console.log(empresasData)
    
    $scope.showCompany = function (company_id) {
        // console.log(empresasData)
        $state.go('app.empresasShow', {id: company_id})
    }
});