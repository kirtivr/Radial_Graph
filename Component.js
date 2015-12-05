jQuery.sap.declare("com.Component");

sap.ui.core.UIComponent.extend("com.Component", {

    createContent : function() {
        var oViewData = {
            component: this
        };

        // create root view
        var oView = sap.ui.view({
            id : "app",
            viewName : "com.Main",
            type : sap.ui.core.mvc.ViewType.XML,
            viewData : oViewData
        });

        // set device model
        var deviceModel = new sap.ui.model.json.JSONModel({
            isPhone : jQuery.device.is.phone,
            isNoPhone : ! jQuery.device.is.phone,
            listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
            listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
        });
        deviceModel.setDefaultBindingMode("OneWay");
        oView.setModel(deviceModel, "device");

        // set local model
        var localModel = new sap.ui.model.json.JSONModel({
            appMode : null,
            inEdit : false,
            inDelete : false,
            inBatch : false
        });
        oView.setModel(localModel, "local");

        // Using a local model for offline development
        var oModel = new sap.ui.model.json.JSONModel("model/mock_data.json");
        oView.setModel(oModel);

        // done
        return oView;
    }
});
