$(function () {
    var Cover = Backbone.Model.extend({
        defaults: {
            src: '',
            caption: ''
        }
    });

    var CoverList = Backbone.Collection.extend({
        model: Cover,
        sync: function (method, model, options) {
            var params = _.extend({
                type: 'GET',
                dataType: 'jsonp',
                url: model.url(),
                jsonpCallback: 'covers'
            }, options);

            return $.ajax(params);
        },
        parse: function (response) {
            return response;
        },
        url: function () {
            return 'http://touvision.gotoip3.com/content/covers.json';
        }
    });

    var CoverView = Backbone.View.extend({
        tagName: 'div',
        className: 'item',
        template: _.template($('#cover-template').html()),
        render: function () {
            if(this.model.attributes['isActive']==='true'){
                this.$el.addClass("active");
            }
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        clear: function () {
            this.model.clear();
        }
    });

    var Covers = new CoverList;

    var CoversView = Backbone.View.extend({
        el: $("#myCarousel"),

        initialize: function () {
            Covers.bind('reset', this.addAll, this);

            Covers.fetch();
        },

        addOne: function (cover) {
            var currentUrl = window.location.href;
            var imageUrl = currentUrl.substring(0, currentUrl.indexOf('/') + 1) + cover.get('src');
            if (currentUrl.substring(0, 4) != 'http') {
                imageUrl = currentUrl.substring(0, currentUrl.indexOf('src') + 4) + cover.get('src');
            }
            coverImage = new Image();
            coverImage.src = imageUrl;

            var view = new CoverView({ model: cover });
            this.$(".carousel-inner").append(view.render().el);
        },
        addAll: function () {
            Covers.each(this.addOne);
        }
    });

    var App = new CoversView;
});