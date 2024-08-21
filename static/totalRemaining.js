(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['totalRemaining'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"total-remaining-container\">\n    <div class=\"total-remaining\">Total Remaining: $"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"totalRemaining") || (depth0 != null ? lookupProperty(depth0,"totalRemaining") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"totalRemaining","hash":{},"data":data,"loc":{"start":{"line":2,"column":51},"end":{"line":2,"column":69}}}) : helper)))
    + "</div>\n</div>\n\n\n\n";
},"useData":true});
})();