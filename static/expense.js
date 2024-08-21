(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['expense'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"expense-card\" class=\"color\" data-category=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"expenseCategory") || (depth0 != null ? lookupProperty(depth0,"expenseCategory") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"expenseCategory","hash":{},"data":data,"loc":{"start":{"line":1,"column":52},"end":{"line":1,"column":71}}}) : helper)))
    + "\">\r\n    <div class=\"item-cate\">\r\n        "
    + alias4(((helper = (helper = lookupProperty(helpers,"expenseCategory") || (depth0 != null ? lookupProperty(depth0,"expenseCategory") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"expenseCategory","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":27}}}) : helper)))
    + "\r\n    </div>\r\n    <div class=\"item-cate\">\r\n        $"
    + alias4(((helper = (helper = lookupProperty(helpers,"expenseAmount") || (depth0 != null ? lookupProperty(depth0,"expenseAmount") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"expenseAmount","hash":{},"data":data,"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":26}}}) : helper)))
    + "\r\n    </div>\r\n    <button class=\"delete-expense\" data-id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"_id") || (depth0 != null ? lookupProperty(depth0,"_id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"_id","hash":{},"data":data,"loc":{"start":{"line":8,"column":44},"end":{"line":8,"column":51}}}) : helper)))
    + "\">x</button>\r\n</div>\r\n";
},"useData":true});
})();