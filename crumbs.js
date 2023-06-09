﻿
var crumb_class = function () {

    var crumb_item = function (componentSelector, crumb_id) {

        var properties = {

            item_id: 0,
            values: [],

            outer_container: null,
            control_textbox: null,
            control_add_button: null,
            crumbs_container: null,
            control_values: null

        };

        var root = this;

        this.isCrumb = function (id) {
            return (properties.item_id === id);
        };

        this.deleteItem = function (value) {
            properties.values.pop(value);
            properties.control_values.val(properties.values.join(','));
        };

        this.attachButtonEventHandler = function () {
            properties.control_add_button.on('click', function () {
                var newItems = properties.control_textbox.val().split(',');

                for (var i = 0; i < newItems.length; i++) {
                    var sanitized = newItems[i].trim().toLowerCase();
                    if (sanitized === "") {
                        continue;
                    }

                    var exists = false;
                    for (var j = 0; j < properties.values.length; j++) {
                        if (properties.values[j] === sanitized) {
                            exists = true;
                            break;
                        }
                    }

                    if (!exists) {
                        properties.crumbs_container.append(
                            "<div class='crumb-item' data-value='" + sanitized + "'>" + sanitized + "<span class='crumb-remove-button'>&times;</span></div>"
                        );

                        properties.values.push(sanitized);
                        properties.control_values.val(properties.values.join(','));
                    }

                    properties.control_textbox.val('');
                }
            });
        };

        this.init = function (componentSelector, crumb_id) {
            if ((componentSelector === null) || (componentSelector === "") || ($(componentSelector).length === 0)) {
                throw "'" + componentSelector + "' is null, empty or does not reference a valid object in the DOM.";
            }

            if (($(componentSelector + ' .crumbs-input-user').length === 0) || ($(componentSelector + ' .crumbs-button-add').length === 0) || ($(componentSelector + ' .crumbs-container').length === 0) || ($(componentSelector + ' .crumbs-input-data').length === 0)) {
                throw "Object refered to by '" + componentSelector + "' does not contain component elements.";
            }

            properties.item_id = crumb_id;
            properties.outer_container = $(componentSelector);
            properties.control_textbox = $(componentSelector + ' .crumbs-input-user');
            properties.control_add_button = $(componentSelector + ' .crumbs-button-add');
            properties.crumbs_container = $(componentSelector + ' .crumbs-container');
            properties.control_values = $(componentSelector + ' .crumbs-input-data');

            properties.crumbs_container.data('crumbid', crumb_id);

            var currentValues = properties.control_values.val();
            if ((currentValues !== null) && (currentValues !== "")) {
                properties.values = currentValues.split(',');
            }

            this.attachButtonEventHandler();
        };

        this.init(componentSelector, crumb_id);
    };

    var properties = {
        item_count: 0,
        items: []
    };

    var root = this;

    this.init = function (selectors) {
        if ((selectors === null) || (selectors.length === 0)) {
            throw "There are no selectors specified.";
        }

        properties.item_count = 0;
        properties.items = [];

        var processed = [];
        for (var i = 0; i < selectors.length; i++) {
            for(var j = 0; j < processed.length; j++) {
                if (processed[j] === selectors[i]) {
                    throw "Duplicator selector '" + selectors[i] + "' found.";
                }
            }

            processed.push(selectors[i]);

            properties.items.push(new crumb_item(selectors[i], properties.item_count));
            properties.item_count++;
        }
    };

    this.deleteCrumb = function (crumb_id, value) {
        for (var i = 0; i < properties.items.length; i++) {
            if (properties.items[i].isCrumb(crumb_id)) {
                properties.items[i].deleteItem(value);
            }
        }
    };
};

var crumbs = new crumb_class();

$(document).on('click', 'span.crumb-remove-button', function () {
    var item = $(this).parent('div.crumb-item');
    var container = item.parent('.crumbs-container');
    var crumb_id = parseInt(container.data('crumbid'));

    var value = item.data('value');
    crumbs.deleteCrumb(crumb_id, value);

    // delete itself
    item.remove();
});

