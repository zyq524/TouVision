$(function () {
    window.app = window.app || { };
    window.app.MenuItem = Backbone.Model.extend({
        defaults: {
            id: '',
            parent: '',
            name: '',
            src: '',
            isActive: false,
        },
        active: function () {
            this.save({ isActive: true });
        }
    });

    window.app.Menu = Backbone.Collection.extend({
        model: app.MenuItem,
        sync: function (method, model, options) {
            var params = _.extend({
                type: 'GET',
                dataType: 'jsonp',
                url: model.url(),
                jsonpCallback: 'menu'
            }, options);

            return $.ajax(params);
        },
        parse: function (response) {
            return response;
        },
        url: function () {
            return 'http://touvision.gotoip3.com/content/menu.json';
        }
    });

    window.app.MenuItemView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#menu-template').html()),
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get('isActive')) {
                this.$("#" + this.model.get('name')).addClass('active');
                if(this.model.get('displayParentName')=='weddings'){
                    $('ul#gallery-items').removeClass('non-display');
                    $('ul#weddings-items').removeClass('non-display');
                }
                else if(this.model.get('displayParentName')=='travels'){
                    $('ul#gallery-items').removeClass('non-display');
                    $('ul#travels-items').removeClass('non-display');
                }
            }
            
            return this;
        },

        events: {
            'click a#gallery': 'galleryClick',
            'click a#weddings': 'weddingsClick',
            'click a#travels': 'travelsClick'
        },

        galleryClick: function (e) {
            if (this.el.children[0] !== e.target) {
                return false;
            }
            $('ul#gallery-items').toggle('slow');
        },

        weddingsClick: function (e) {
            if (this.el.children[0] !== e.target) {
                return false;
            }
            $('ul#weddings-items').toggle('slow');

            $('ul#travels-items').hide('slow');
        },

        travelsClick: function (e) {
            if (this.el.children[0] !== e.target) {
                return false;
            }
            $('ul#travels-items').toggle('slow');

            $('ul#weddings-items').hide('slow');
        },

        clear: function () {
            this.model.clear();
        }
    });

    var MyMenu = new app.Menu;

    window.app.MenuView = Backbone.View.extend({
        el: $("#myMenu"),

        initialize: function (activeName, parentName) {
            this.activeItem = activeName;
            this.displayParentName = parentName;
            MyMenu.bind('reset', this.addAll, this);

            MyMenu.fetch();
        },

        addOne: function (menuItem, pClass) {

            if (menuItem.get('name') == this.activeItem) {
                menuItem.active();
                menuItem.set('displayParentName', this.displayParentName);
            }
            var src=menuItem.get('src');
            if(src != 'javascript:void(0)' &&  typeof this.displayParentName != 'undefined'){
                menuItem.set('src', '../../'+menuItem.get('src'));
            }
        
            var view = new app.MenuItemView({ model: menuItem });
            this.$('#' + pClass).append(view.render().el);
        },

        addAll: function () {
            this.list = _.groupBy(MyMenu.models, function (Menu) { return Menu.get('parent') });
            this.buildMenu(this.list[0], this.list, 'menu');
        },

        buildMenu: function (k, l, pClass) {
            for (var i = 0; i < k.length; i++) {
                this.addOne(k[i], pClass);
                var c = this.list[k[i].id];
                if (typeof c != 'undefined') {
                    this.$('#' + k[i].attributes['name']).parent().append('<ul class="nav sub-nav non-display" id="' + k[i].attributes['name'] + '-items">');
                    this.buildMenu(c, this.list, k[i].attributes['name'] + '-items');
                }

            }
        }
    });
//    var App = new MenuView('home');
});