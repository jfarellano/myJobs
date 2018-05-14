app.controller('explorarCtrl', function ($scope, $state, $mdDialog, users, userFriends, Auth, userData, suggestedFriends, careers) {
    $scope.users = users
    $scope.careers = careers
    $scope.userFriends = userFriends
    $scope.suggestedFriends = suggestedFriends
    console.log(suggestedFriends)
    console.log(Object.keys(suggestedFriends).length === 0)
    $scope.showProfile = function (user_id) {
        console.log(user_id)
        $state.go('app.userShow', {id: user_id}, { reload: true })
    }
    // $scope.empresasData = empresasData
    // console.log(empresasData)
    $scope.showConfirm = function(ev, user) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Do you want to add '+user.name+' to your friends?')
            //   .textContent('All your data will be deleted.')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok("Add")
              .cancel("Don't add");
    
        $mdDialog.show(confirm).then(function() {
        //   $scope.status = 'You decided to get rid of your debt.';
            // console.log(perfilData)
            let friend = {}
            friend[user.user_id] = user.username 
            let ref = firebase.database().ref('friendship/'+userData.user_id).set(friend)
        }, function() {
          $scope.status = 'You decided to keep your debt.';
        });
    };
    
    $scope.semester = function () {
        if (search.semester == "Todos") {
            search.semester = ""
        }
    }

});