//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/InvoicesFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, InvoicesFormatter, Filter, FilterOperator) {
        return Controller.extend("logaligroup.SAPUI5.controller.InvoicesList",
            {
                InvoicesFormatter: InvoicesFormatter,

                onInit: function(){
                    var oViewModel = new JSONModel({
                        usd: "USD",
                        eur: "EUR"
                    });

                    this.getView().setModel(oViewModel, "currency");

                },

                onFilterinvoices: function(oEvent){
                    const arrayFilter = [];
                    const sQuery = oEvent.getParameter("query");

                    if(sQuery){
                        arrayFilter.push( new Filter("ProductName", FilterOperator.Contains, sQuery));
                    };

                    const oList = this.getView().byId("invoiceList");
                    const oBinding = oList.getBinding("items");
                    oBinding.filter(arrayFilter);
                },

                navigateToDetails: function(oEvent){
                    const oItem = oEvent.getSource();
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    //Pass model binded to the context to NavigationPreloadManager. We need to delete the trailing slash
                    oRouter.navTo("Details", {
                        invoicePath: window.encodeURIComponent(oItem.getBindingContext("northwind").getPath().substr(1))
                    });
                }

            }
        );
    });