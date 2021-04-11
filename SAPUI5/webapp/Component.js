// @ts-nocheck

//Componente de la aplicación
sap.ui.define(
    [
        "sap/ui/core/UIComponent",
        "logaligroup/SAPUI5/model/Models",
        "sap/ui/model/resource/ResourceModel",
        "./controller/HelloDialog",
        "sap/ui/Device"
    ],
    /**
     * 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
     * @param {typeof sap.ui.Device} Device
     */
    function (UIComponent, Models, ResourceModel, HelloDialog, Device) {

        return UIComponent.extend("logaligroup.SAPUI5.Component", {

            metadata: {
                manifest: "json"
            },

            init: function () {
                //Llamamos al init() del componente padre
                UIComponent.prototype.init.apply(this, arguments);

                //Asignación de modelo a vista
                this.setModel(Models.createRecipient());

                //Set i18n => Commented due to model being declared in metadata, manifest.json
                //var i18nModel = new ResourceModel({ bundleName: "logaligroup.SAPUI5.i18n.i18n" });
                //this.setModel(i18nModel, "i18n");

                //set the Device model
                this.setModel(Models.createDeviceModel(), "device");

                this._helloDialog = new HelloDialog(this.getRootControl());

                //Create the views based on the url
                this.getRouter().initialize();
            },

            exit: function(){
                this._helloDialog.destroy();
                delete this._helloDialog;
            },

            //Function called to open the Hello Dialog
            openHelloDialog: function(){
                this._helloDialog.open();
            },

            //Get density of content: cozy or compact   
            getContentDensityClass: function(){
                if(Device.support.touch){
                    this._sContentDensityClass = "sapUiSizeCozy";
                }else{
                    this._sContentDensityClass = "sapUiSizeCompact";
                }

                return this._sContentDensityClass;
            }

        });

    }

)