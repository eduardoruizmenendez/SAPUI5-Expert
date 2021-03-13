//@ts-nocheck
sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
],
    /**
     * 
     * @param {typeof sap.ui.core.util.MockServer} MockServer 
     * @param {typeof sap.ui.model.jason.JSONModel} JSONModel 
     * @param {typeof sap.base.util.UriParameters} UriParameters 
     * @param {typeof sap.base.Log} Log 
     */
    function (MockServer, JSONModel, UriParameters, Log) {

        "use strict";

        var oMockServer,
            _sAppPath = "logaligroup/SAPUI5/",
            _sJsonFilesPath = _sAppPath + "localService/mockdata";
        
        var oMockServerInterface = {

            /**
             * Initializes the mock server asynchronously
             * @protected
             * @param {Object} oOptionsParameter 
             * @returns {Promise} a promise resolved when the Moch Server has been started (InitMockServer.js)
             */
            init: function(oOptionsParameter){

                var oOptions = oOptionsParameter || {};

                return new Promise( function(fnResolve, fnReject){

                    var sManifestUrl = sap.ui.require.toUrl(_sAppPath+"manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function(){
                        var oUriParameters = new UriParameters(window.location.href);

                        //parse manifest.json for local metadata URI
                        var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
                            oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService"),
                            sMetadataUrl = sap.ui.require.toUrl(_sAppPath+oMainDataSource.settings.localUri);

                        //Ensure there is a trailing slash
                        var sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                        //Create a mock server instance or stop the existing one to reinitialize
                        if (!oMockServer){
                            oMockServer = new MockServer({
                                rootUri : sMockServerUrl
                            });
                        } else {
                            oMockServer.stop();
                        };

                        //Configure mock server with the given options (parameter) or a default deley of 0.5 seconds
                        MockServer.config({
                            autoRespond: true,
                            autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500 )
                        });

                        //Simulate all request using mock data
                        oMockServer.simulate(sMetadataUrl, {
                            sMockdataBaseUrl: sJsonFilesUrl,
                            bGenerateMissingMockData: true
                        });

                        var aRequests = oMockServer.getRequests();

                        //Compose an error response for each request
                        var fnResponse = function(iErrCode, sMessage, aRequest){
                            aRequest.response = function(oXhr){
                                oXhr.response(iErrCode, {
                                    "Content-Type": "text/plain; charset=utf-8"
                                }, sMessage);
                            };
                        };

                        //Simulate metadata errors
                        if(oOptions.metadataError || oUriParameters.get("metadataError")){
                            aRequests.foreach(function(aEntry){
                                if(aEntry.path.toString().indexof("$metadata") > -1){
                                    fnResponse(500, "Metadata error", aEntry);
                                };
                            });
                        };

                        //Simulate requests errors
                        var sErrorParam = oOptions.errorType || oUriParameters.get("errorType"),
                            iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

                        if(sErrorParam){
                            aRequests.foreach(function(aEntry){
                                fnResponse(iErrorCode, sErrorParam, aEntry);
                            });
                        };

                        //Set requests and start the server
                        oMockServer.setRequests(aRequests);
                        oMockServer.start();

                        Log.info("Running the app with mock data");
                        fnResolve();

                    });

                    oManifestModel.attachRequestFailed(function(){
                        var sError = "Fail to load the application manifest"
                        Log.error(sError);
                        fnReject(new Error(sError));
                    });

                });

            }

        };

        return oMockServerInterface;

    }
);