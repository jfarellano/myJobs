app.controller('aplicacionesCtrl', function($scope, $state, $window, $firebaseArray, $firebaseObject, applications, userData) {
    $scope.applications = applications
    console.log(applications)

    $scope.accept = function (application, index) {
         console.log("eche")
        let jobHires = {}
        var userJob = {}
        console.log(application)
        console.log(application.application.job_id)
        let jobHiresRef = firebase.database().ref("job_hires/").orderByKey().equalTo(application.application.job_id)
        let jobHiresElements = $firebaseArray(jobHiresRef) 
        jobHiresElements.$loaded().then(function (firebaseArray) {
            let jobId = application.job.$id
            let userId = application.application.$id
            // jobHires[userData.user_id] = 
            userJob = application.job 
            // delete userJob.$$hashKey;
            delete userJob.$id;
            delete userJob.$priority;
            firebase.database().ref("job_hires/"+jobId+'/'+userId).set({username: userData.username, vacant_number: firebaseArray.length+1})
            firebase.database().ref("user_jobs/"+userId+'/'+jobId).set(userJob)
            applications.splice(index, 1)
            let jobsRef = firebase.database().ref("jobs/"+jobId)
            let ofertDatabase = $firebaseObject(jobsRef);
            var ref = firebase.database().ref("job_applications/"+jobId+'/'+userId)
            let syncObjectApplication = $firebaseObject(ref);
            ofertDatabase.$loaded().then(function (jobDatabase) {
                jobDatabase.hired_users = jobDatabase.hired_users + 1
                jobDatabase.$save()
                syncObjectApplication.$loaded().then(function (data) {
                    // console.log(data)
                  syncObjectApplication.$remove()  
                  $window.location.reload();
                })                         
            })
        })

    }
    // applications.$loaded().then(function (data) {
    //     console.log(data)    
    //     $scope.applications = data    
    // })

    // companyJobs.$loaded().then(function (data) {
    //     console.log(data)    
    //     $scope.companyJobs = data   

    // })
});