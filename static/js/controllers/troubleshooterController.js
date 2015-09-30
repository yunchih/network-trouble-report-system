angular
.module( "networkTroubleshooter")
.controller( "troubleshooterController", function( $scope, $location ){

    $scope.current_guide = {
        show: false,
        url: "",
        name: ""
    };

    $scope.gotoNextPage = function (url) {
        $location.path(url);
    };

    $scope.gotoNextEnquiry = function ( next ){
        if( next ){
            $scope.enquiry.historyList.push( $scope.enquiry.current );
            $scope.enquiry.currentID = next;
            $scope.enquiry.current = model.issueList[ next ];
            setTimeout( function () {
               window.componentHandler.upgradeDom();
            } , 100 );

        }
    };

    $scope.historyBacktrack = function ( index ){
        $scope.enquiry.current = $scope.enquiry.historyList[index];
        $scope.enquiry.historyList = $scope.enquiry.historyList.slice( 0, index );
        window.setTimeout(  window.componentHandler.upgradeDom, 100 );
    };

    $scope.showGuide = function (_guide) {

        $scope.current_guide.url = 'partials/guides/' +  _guide.url ;
        $scope.current_guide.name = _guide.name;
        $scope.current_guide.show = true;
        
        console.log("Guide URL: ", 'partials/guides/' +  _guide.url );
    };

});

