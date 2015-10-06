var _ = require("lodash");

module.exports = {
    invertMap: function(hash) {
        var inverted = {};
        _.each(hash, function(category, categoryName){
            
            // single level attribute (eg. 'all');
            if (!_.isObject(category)) {
                inverted[category] = categoryName;
            }
            
            _.each(category, function(hex, subCatName){
                var fullCategory = categoryName + "." + subCatName;
                inverted[hex] = fullCategory;
            });
        })
        
        return inverted;
    },

    dotNotatedIndex: function(hash, idx) {
        var a = idx.split('.');
        var i = 0;
        var step = a[i].toLowerCase();
        var obj = hash
        var ret = null;
        while (obj = obj[step]) {
            ret = obj;
            i++;
            step = a[i] ? a[i].toLowerCase() : null;
        }
        
        return ret;
    }
}
