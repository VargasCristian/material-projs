// Modelo

var Producto = ProJS.Model.extend({
  init: function() {
    this._super.apply(this, arguments);
  },
  defaults: {
    nombre: "Producto sin nombre",
    categoria: "Sin categorizar",
    pais: "España",
    precio: 0
  },
  set: function(attrs, options) {
    return this._super(attrs, merge(options, {validate: true}));
  },
  validate: function(attrs) {
    var vacio = /^\s*$/,
        pais = /España|Francia|Portugal/,
        numerico = /^\d+$/;
    if (vacio.test(attrs["nombre"]) ||
        vacio.test(attrs["categoria"]) ||
        (attrs["pais"] && !pais.test(attrs["pais"])) ||
        (attrs["precio"] && !numerico.test(attrs["precio"])) ||
        (attrs["id"] && !numerico.test(attrs["id"]))) {
      return "Producto no válido!";
    }
  }
});

// Colección

var ListadoProductos = ProJS.Collection.extend({
  model: Producto,
  url: "/products"
});


// Vista detallada

var VistaProducto = ProJS.View.extend({
  init: function(options) {
    this._super(options);
    this.template = $("#template-producto").html();
  },
  tagName: "div",
  render: function() {
    var data = this.model.toJSON();
    this.$el.html(
      _.template(this.template, data)
    );
    return this;
  }
});

// Vista de la barra lateral

var VistaListado = ProJS.View.extend({
  init: function() {
    this._super.apply(this, arguments);   
    this.template = $('#template-producto-sidebar').html();
    this.collection.on("sync", _.bind(this.render, this));
  },
  render: function() {
    this.collection.map(function(model) {
      var attrs = model.toJSON();
      this.$el.append(_.template(this.template, attrs));
    }.bind(this));
    return this;
  }

});

// Inicialización

$(function() {
  var productos = new ListadoProductos();
  var vistaListado = new VistaListado({collection: productos}); 
  $('#barra-lateral').append(vistaListado.render().el);

  productos.fetch();
});
