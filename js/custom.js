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
            console.log(`web archive search query is: ${_this.query}`);
            queryWebArchiveApi().then((response)=>{
                console.log(`Web archive API response: ${response}`);
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
                    //For development need to delete
                    let htmlString = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>shakespeare</title><description>shakespeare</description><link /><startIndex xmlns="http://a9.com/-/spec/opensearchrss/1.0/">0</startIndex><itemsPerPage xmlns="http://a9.com/-/spec/opensearchrss/1.0/">10</itemsPerPage><query xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">shakespeare</query><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4472</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4544</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4398</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4614</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4387</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4432</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4847</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4958</index><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4269</index><urlParams xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/"><param name="i" value="4472"/><param name="i" value="4544"/><param name="i" value="2135"/><param name="i" value="4398"/><param name="i" value="4614"/><param name="i" value="4387"/><param name="i" value="4432"/><param name="i" value="4847"/><param name="i" value="4958"/><param name="i" value="4269"/><param name="q" value="shakespeare"/><param name="n" value="10"/><param name="p" value="0"/></urlParams><item><title>Brooklyn Museum: Items Tagged "Shakespeare"</title><link>http://www.brooklynmuseum.org/opencollection/tags/Shakespeare</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4398sha1:4ICPTXNK3Z36R5O7XZTGIKEDVQQXC3IGhttp://www.brooklynmuseum.org/opencollection/tags/Shakespeare</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">96.21937</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.brooklynmuseum.org</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">28263</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">application/xhtml+xml</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1.1556302</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4398</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4398</index><date>20140926145311</date><description>Brooklyn Museum: Items Tagged "&lt;b&gt;Shakespeare&lt;/b&gt; " Skip main navigation V isit E x hibitions C alendar Co l lections E ducation A b out S upport Sh o p P ress H ome F AQ A ccess D irections Con t act E- N ews</description></item><item><title>Shakespeare (William) - The National Shakespeare</title><link>http://www.dreweatts.com/cms/pages/lot/354/299</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135sha1:2JMC4QDAVZTSIMPTTMQCALE22FSZZRC4http://www.dreweatts.com/cms/pages/lot/354/299</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">90.42599</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.dreweatts.com</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">42717</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1.1342422680822206</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135</index><date>20141003191203</date><description>(William) - The National &lt;b&gt;Shakespeare&lt;/b&gt; Sold for £170 &lt;b&gt;Shakespeare&lt;/b&gt; (William) The National &lt;b&gt;Shakespeare&lt;/b&gt; 3 vol., plates by Sir J.</description></item><item><title>William Shakespeare by Giovanni Fontana</title><link>http://www.victorianweb.org/sculpture/misc/fontana1.html</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4472sha1:GXUVTSVNL4KBHYX4OIRQDLJRO37YUIPIhttp://www.victorianweb.org/sculpture/misc/fontana1.html</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">82.68855</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.victorianweb.org</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2466</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1.0602059991327963</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4472</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4472</index><date>20150709010319</date><description>William &lt;b&gt;Shakespeare&lt;/b&gt; by Giovanni Fontana [ Victorian Web Home — Visual Arts — Sculpture ] William &lt;b&gt;Shakespeare&lt;/b&gt; Giovanni Fontana 1874 Marble Leicester Square, WC2 Fontana adapted William Kent's design,</description></item><item><title>Alfred Kubin. Caliban from the portfolio Visions of Shakespeare (Shakespeare Visionen). (1918) | MoMA</title><link>https://www.moma.org/collection/works/20236</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4387sha1:4OHV7OSIAXZO2BAD4FDKTZ6A6QPBYME3https://www.moma.org/collection/works/20236</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">76.19244</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.moma.org</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">55631</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1.2053078</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4387</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4387</index><date>20180207024043</date><description>Caliban from the portfolio Visions of &lt;b&gt;Shakespeare&lt;/b&gt; (&lt;b&gt;Shakespeare&lt;/b&gt; Visionen). (1918) | MoMA Tickets Buy tickets Join Become a member Visit Plan your visit Exhibitions Exhibitions/events Exhibitions and events</description></item><item><title>Shall I compare thee to a summer's day ? William Shakespeare SONNET 18</title><link>http://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQKK28-E8yXA&amp;format=xml</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4387sha1:45BTMKVKN3FS6DUFKPYRSUPMAN4SWDF3http://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQKK28-E8yXA&amp;format=xml</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">74.55519</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.youtube.com</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">747</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1.3634074</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4387</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4387</index><date>20161126191921</date><description>William &lt;b&gt;Shakespeare&lt;/b&gt; SONNET 18 iframe width="480" height="270" src="https://www.youtube.com/embed/QKK28-E8yXA?</description></item><item><title>The Arts Collection: Songs of Shakespeare, illustrated by the Etching Club: [Title page] Songs of Shakespeare, illustrated by the Etching Club</title><link>http://digicoll.library.wisc.edu/cgi-bin/Arts/Arts-idx?type=article&amp;did=Arts.songsshake1.i0001&amp;id=Arts.songsshake1&amp;isize=M&amp;pview=hide</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4472sha1:HLQTXOC4FOH227G6AKMS4Z5PJRDVRO3Ihttp://digicoll.library.wisc.edu/cgi-bin/Arts/Arts-idx?type=article&amp;did=Arts.songsshake1.i0001&amp;id=Arts.songsshake1&amp;isize=M&amp;pview=hide</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">74.461716</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">digicoll.library.wisc.edu</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">10440</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">application/xhtml+xml</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1.1041392685158224</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4472</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4472</index><date>20150305201806</date><description>The Arts Collection: Songs of &lt;b&gt;Shakespeare&lt;/b&gt; , illustrated by the Etching Club: [Title page] Songs of &lt;b&gt;Shakespeare&lt;/b&gt; , illustrated by the Etching Club The Arts Collection Home About Search Browse Copyright Help</description></item><item><title>6065. Extract from Shakespeare second folio edition</title><link>http://auktionsverket.com/auction/rare-books/2013-10-01/6065-extract-from-shakespeare-second-folio-edition/?page=4</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135sha1:CEW6KUZ5BN473YFQHTFBAAUCK4QL3BSDhttp://auktionsverket.com/auction/rare-books/2013-10-01/6065-extract-from-shakespeare-second-folio-edition/?page=4</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">72.406845</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">auktionsverket.com</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">19642</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135</index><date>20170206061324</date><description>Object description &lt;b&gt;SHAKESPEARE&lt;/b&gt; , WILLIAM.</description></item><item><title>Shakespeare Primavera | Brooklyn Arts Council</title><link>http://www.brooklynartscouncil.org/forum/4355</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4847sha1:26W7FV5M3SDHCH3MH2KHSF2HSKV56P33http://www.brooklynartscouncil.org/forum/4355</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">72.3116</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.brooklynartscouncil.org</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">23949</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1.0954243</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4847</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4847</index><date>20170830093306</date><description>&lt;b&gt;Shakespeare&lt;/b&gt; Primavera | Brooklyn Arts Council Connect Donate Now Artist Registry Directory of Organizations Join the BAC email List Create Account Sign In View Join View Join 20 Jay Street, Suite</description></item><item><title>Exposición temporal Dalí, Shakespeare, Visconti | Noticias | Fundació Gala - Salvador Dalí</title><link>https://www.salvador-dali.org/es/servicios/prensa/noticias/314/exposicion-temporal-dali-shakespeare-visconti</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4614sha1:CMCMEWENKNZQZPZLDXJTIARFLK4KAROXhttps://www.salvador-dali.org/es/servicios/prensa/noticias/314/exposicion-temporal-dali-shakespeare-visconti</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">71.81711</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.salvador-dali.org</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">105341</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4614</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">4614</index><date>20190409200336</date><description>Dalí, &lt;b&gt;Shakespeare&lt;/b&gt; y Visconti Como gustéis es una comedia pastoral de William &lt;b&gt;Shakespeare&lt;/b&gt; escrita entre 1599 y 1600.</description></item><item><title>JOHN &amp; JOSIAH BOYDELL (PUBL), Illustrationer till Shakespeare (4). - Bukowskis</title><link>https://www.bukowskis.com/en/auctions/S189/639-john-josiah-boydell-publ-illustrationer-till-shakespeare-4</link><docId xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135sha1:6FEKRHLRJNDU3V6GTYHQGJRDFVM2ZALRhttps://www.bukowskis.com/en/auctions/S189/639-john-josiah-boydell-publ-illustrationer-till-shakespeare-4</docId><score xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">64.75481</score><site xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">www.bukowskis.com</site><length xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">20310</length><type xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">text/html</type><boost xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">1</boost><collection xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135</collection><index xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">2135</index><date>20161114143947</date><description>JOHN &amp; JOSIAH BOYDELL (PUBL), Illustrationer till &lt;b&gt;Shakespeare&lt;/b&gt; (4). Etsningar, omkring 1770-80, ca 48 x 63 cm, och 64,5 x 46,5 cm. Skador (revor, fuktfläckar, veck).</description></item><totalResults xmlns="http://a9.com/-/spec/opensearchrss/1.0/">769</totalResults><responseTime xmlns="http://web.archive.org/-/spec/opensearchrss/1.0/">0.143</responseTime></channel></rss>`;
                    resolve(new DOMParser().parseFromString(htmlString, "text/html"));
                    //----------------------------
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

   
