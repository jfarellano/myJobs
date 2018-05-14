app.controller('amigosCtrl', function ($scope, $state, $window, userFriends) {
    console.log(userFriends)
    $scope.userFriends = userFriends

    $scope.showProfile = function (user_id) {
        console.log(user_id)
        $state.go('app.userShow', {id: user_id}, { reload: true })
    }
});