/* eslint-define no-undef */
//@ts-nocheck
sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/RatingIndicator",
    "sap/m/Label",
    "sap/m/Button"
],
    /**
     * 
     * @param {typeof sap.ui.core.Control} Control 
     * @param {typeof sap.m.RatingIndicator} RatingIndicator 
     * @param {typeof sap.m.Label} Label 
     * @param {typeof sap.m.Button} Button 
     */
    function (Control, RatingIndicator, Label, Button) {
        'use strict';

        return Control.extend("logaligroup.SAPUI5.control.ProductRating", {
            //Required for a Custom Control: properties, aggregations and events
            metadata: {
                properties: {
                    value: {
                        type: "float",
                        defaultValue: 0
                    }
                },

                aggregations: {
                    _rating: {
                        type: "sap.m.RatingIndicator",
                        multiple: false,
                        visibility: "hidden"
                    },
                    _label: {
                        type: "sap.m.Label",
                        multiple: false,
                        visibility: "hidden"
                    },
                    _button: {
                        type: "sap.m.Button",
                        multiple: false,
                        visibility: "hidden"
                    }
                },
                events: {
                    change: {
                        parameters: {
                            value: {
                                type: "int"
                            }
                        }
                    }
                }
            },

            //Required for a Custom Control
            init: function () {
                this.setAggregation("_rating", new RatingIndicator({
                    value: this.getValue(),                 //property value from metadata
                    iconSize: "2rem",
                    visualMode: "Half",
                    liveChange: this._onRate.bind(this)
                }));

                this.setAggregation("_label", new Label({
                    text: "{i18n>productRatingLabelInitial}"
                }).addStyleClass("sapUiSmallMargin"));

                this.setAggregation("_button", new Button({
                    text: "{i18n>productRatingButton}",
                    press: this._onSubmit.bind(this)
                }).addStyleClass("sapUiTinyMarginTopBottom"));
            },

            //Required for a Custom Control
            renderer: function (oRenderManager, oControl) {
                oRenderManager.openStart("div", oControl);
                oRenderManager.class("productRating sapMRI");
                oRenderManager.openEnd();
                oRenderManager.renderControl(oControl.getAggregation("_rating"));
                oRenderManager.renderControl(oControl.getAggregation("_label"));
                oRenderManager.renderControl(oControl.getAggregation("_button"));
                oRenderManager.close("div");
            },

            //Functions needed to make changes in control handling events as indicated in init()
            _onRate: function (oEvent) {
                const oResurceBundle = this.getModel("i18n").getResourceBundle();
                const fValue = oEvent.getParameter("value");

                //Update value property of custom control
                this.setProperty("value", fValue, true);
                //Set text: Your rating: {0} out of {1}
                this.getAggregation("_label").setText(oResurceBundle.getText("productRatingIndicator", [fValue, oEvent.getSource().getMaxValue()]));
                this.getAggregation("_label").setDesign("Bold");
            },

            _onSubmit: function (oEvent) {
                const oResurceBundle = this.getModel("i18n").getResourceBundle();

                this.getAggregation("_rating").setEnabled(false);
                this.getAggregation("_label").setText(oResurceBundle.getText("productRatingLabelFinal"));
                this.getAggregation("_button").setEnabled(false);
                this.fireEvent("change", {
                    value: this.getValue()
                })
            },

            //Overwrite default setter for property value to update RatingIndicator when updating value
            setValue: function(fValue){
                this.setProperty("value", fValue, true);
                this.getAggregation("_rating").setValue(fValue);
            },

            //Function externally available to reset the status of the custom control
            reset: function(){
                const oResurceBundle = this.getModel("i18n").getResourceBundle();
                this.setValue(0);
                this.getAggregation("_rating").setEnabled(true);
                this.getAggregation("_label").setText(oResurceBundle.getText("productRatingLabelInitial"));
                this.getAggregation("_button").setEnabled(true);
                this.getAggregation("_label").setDesign("Standard");
            }
        });
    });