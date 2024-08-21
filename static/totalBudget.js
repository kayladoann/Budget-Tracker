(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['totalBudget'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"total-budget-container\">\n    <div class=\"total-budget\">Total Budget: $"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"totalBudget") || (depth0 != null ? lookupProperty(depth0,"totalBudget") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"totalBudget","hash":{},"data":data,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":60}}}) : helper)))
    + "</div>\n</div>\n";
},"useData":true});
})();