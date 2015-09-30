var _ = require("lodash");

var categoriesToHex = {

    "lighting": {
        "general": 0x01
    },
    
    "sound": {
        "general": 0x10
    },
    
    "machinery": {
        "general": 0x20
    },
    
    "video": {
        "general": 0x30
    },
    
    "projection": {
        "general": 0x40
    },
    
    "processControl": {
        "general": 0x50
    },
    
    "pyro": {
        "general": 0x60
    },

    "allCall": 0x7f
}


var hexToCategories = {};
_.each(categoriesToBytes, function(category, categoryName){
    
    // allCall
    if (!_.isObject(category)) {
        bytesToCategories[category] = categoryName;
    }
    
    _.each(category, function(hex, subCatName){
        var fullCategory = categoryName + "." + subCatName;
        bytesToCategories[hex] = fullCategory;
    });
})


module.exports = {
    categoriesToHex: categoriesToHex,
    hexToCategories: hexToCategories
}
