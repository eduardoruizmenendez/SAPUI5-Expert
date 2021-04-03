// @ts-nocheck

//Componente de la aplicación
sap.ui.define(
    [
        "sap/ui/core/UIComponent",
        "logaligroup/SAPUI5/model/Models",
        "sap/ui/model/resource/ResourceModel",
        "./controller/HelloDialog"
    ],
    /**
     * 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
     */
    function (UIComponent, Models, ResourceModel, HelloDialog) {

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
            }

        });

    }

)