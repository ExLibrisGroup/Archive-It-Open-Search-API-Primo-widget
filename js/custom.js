(function () {
    "use strict";
    'use strict';


    var app = angular.module('viewCustom', ['angularLoad']);

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/

    app.component('prmSearchResultToolBarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'webArchiveAddonController',
        template: `
                <div ng-if="$ctrl.item" layout="column"
                     layout-sm="column">
                    <h2 class="accessible-only">
                        <span>Accessibility: Web Archive results</span>
                    </h2>
                    <div layout="row">
                        <div layout="row" flex>
                            <md-card layout="column" layout-align="center start"
                                     ng-class="$ctrl.previewClass"
                                     class="one-slot default-shadow">
                                <md-card-header class="resource-header"
                                     layout="column"
                                     layout-align="space-between start">
                                     <div layout="row" layout-align="space-between">
                                        <span>WEB ARCHIVE RESULTS FOR "{{$ctrl.query.toUpperCase()}}"</span>
                                        <div>
                                            <md-icon md-svg-icon="primo-actions:info"></md-icon>
                                            <md-tooltip>this is a widget containing results from Web Archive API</md-tooltip>
                                        </div>
                                        
                                     </div>
                                     <h3>
                                               <a ng-href="{{$ctrl.item.titleURL}}" target="_blank">{{$ctrl.item.title}}</a>

                                     </h3>
                                </md-card-header>
                                <md-card-content layout="row">
                                    <div class="max-width-100">
                                        <span ng-bind-html="$ctrl.item.description"></span>
                                    </div>
                                </md-card-content>
                                <md-card-actions layout="row" layout-align="space-between center">
                                    <md-button class="md-primary" ng-href="{{$ctrl.item.viewAllVersionsURL}}" target="_blank">View All Versions</md-button>
                                    <md-button class="md-primary" ng-href="{{$ctrl.item.moreResultsURL}}" target="_blank">more web archive results</md-button>
                                </md-card-actions>
                            </md-card>
                        </div>
                    </div>
                </div>
        `
    });

    app.controller('webArchiveAddonController', ['$scope', '$q', '$stateParams', '$sce', function ($scope, $q, $stateParams, $sce) {
        let _this = this;
        this.$onInit = () => {
            _this.query = getQuery();
            queryWebArchiveApi().then((response)=>{
                let firstItem = response.querySelector('item');
                let item = {};
                item.title = firstItem.querySelector('title').innerHTML;
                item.description= htmlDecode(firstItem.querySelector('description').innerHTML);
                let collection= firstItem.querySelector('collection').innerHTML;
                let date = firstItem.querySelector('date').innerHTML;
                let link = firstItem.querySelector('link').innerHTML;
                item.titleURL = `http://wayback.archive-it.org/${collection}/${date}/${link}`;
                item.viewAllVersionsURL = `http://wayback.archive-it.org/${collection}/*/${link}`;
                item.moreResultsURL = `https://www.archive-it.org/organizations/484?q=${_this.query.toLowerCase()}&page=1&show=ArchivedPages`
                _this.item = item;
            });
        }

        function htmlDecode(input) {
            let doc = new DOMParser().parseFromString(input, "text/html");
            return doc.documentElement.textContent;
        }

        function getQuery() {
            let q = $stateParams.query;
            if (!q) {
                return false;
            }
            if (Array.isArray(q)) {
                q = q[0];
            }
            let qargs = q.split(',');
            if (qargs.length < 3) {
                return false;
            }
            return qargs[2];
        }

        function queryWebArchiveApi(){
            return $q((resolve, reject)=> {
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        if (this.status === 200){
                            resolve(this.responseXML);
                        }
                        else{
                            reject();
                        }
                    }
                };
                let apiUrl = `https://archive-it.org/seam/resource/opensearch?i=4472&i=4544&i=2135&i=4398&i=4614&i=4387&i=4432&i=4847&i=4958&i=4269&n=10&q=${_this.query.toLowerCase()}`;
                xhttp.open("GET", apiUrl, true);
                xhttp.send();
            });
        }
    }])
})();

   
