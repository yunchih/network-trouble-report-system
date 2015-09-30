angular
.module( "networkTroubleshooter")
.controller( "contactController", 
    [ "$scope", "$location", "Request", "TimePicker" , 
    function( $scope, $location, Request, TimePicker ){

    $scope.contact.time = TimePicker;

    var exportContactInfo = function () {
        var schedules = $scope.contact.time.availableSchedules;
        var contact = {
            user_available_time: TimePicker.export( schedules ),
            description: $scope.contact.words,
            issue: $scope.enquiry.export,
            _id: $scope.currentUser.fb_id
        };

        if( contact.user_available_time ){
            return { success: false, mesg: '請選擇您有空的時間' };
        }
        else if( contact._id ){
            return { success: false, mesg: '請先登入' }
        }

        console.log("Exported contact info: ", angular.toJson( contact, false /* Disable JSON prettify option */));

        return { success: true, mesg: angular.toJson( contact, false /* Disable JSON prettify option */)};
    } ;

    var first = { 
        title: '重新進行疑難排解',
        action: function () {
            
            $scope.resetTroubleshooter();

            $location.path('troubleshooter');
        }
    };

    var last = {
        title: '完成',
        action: function () {

            console.log("Contact Form Completed");

            var exportedForm = exportedFormContactInfo();

            if( exportedForm.success ){
                alert(exportedForm.mesg);
            }
            else{
                Request.contact(  exportedForm.mesg ).then(

                    function () {
                        alert('感謝您的回應，我們會盡快處理！');
                        $location.path('/');
                    },

                    function () {
                        alert('您的表單無法發送。請確認自己是否有登入。');
                    }
                );
            }
                
        }
    };


    /* A list of necessary result entry used in contact page */
    /* The name of entry must correspond to id of its ng-template */

    $scope.resultEntries = [
        {
            id: 'report',
            title: '疑難排解報告'
        },
        {
            id: 'confirmProfile',
            title: '聯絡方式'
        },
        {
            id: 'pickTime',
            title: '有空時間'
        },
        {
            id: 'moreWords',
            title: '想跟我們說的話'
        }
    ];

    $scope.resultIndex = 0;

    var resultNumber = $scope.resultEntries.length;
    
    $scope.gotoNextResult = function () {
        if( $scope.resultIndex != resultNumber - 1 )
            $scope.resultIndex = $scope.resultIndex + 1;
        else
            last.action();

        setTimeout( function () {
               window.componentHandler.upgradeDom();
            } , 100 );

    };
    $scope.gotoPreviousResult = function () {
        if( $scope.resultIndex != 0 )
            $scope.resultIndex = $scope.resultIndex - 1;
        else
            first.action();

        setTimeout( function () {
               window.componentHandler.upgradeDom();
            } , 100 );
        
    };
    $scope.getPrevious = function () {
        if( $scope.resultIndex != 0 )
            return $scope.resultEntries[$scope.resultIndex - 1].title;
        else
            return first.title;
    };
    $scope.getNext = function () {
        if( $scope.resultIndex != resultNumber - 1 )
            return $scope.resultEntries[$scope.resultIndex + 1].title;
        else
            return last.title;
    };

}]);