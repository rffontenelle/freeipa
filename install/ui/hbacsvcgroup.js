/*jsl:import ipa.js */

/*  Authors:
 *    Endi Sukma Dewata <edewata@redhat.com>
 *
 * Copyright (C) 2010 Red Hat
 * see file 'COPYING' for use and warranty information
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* REQUIRES: ipa.js, details.js, search.js, add.js, entity.js */

IPA.entity_factories.hbacsvcgroup = function () {

    var that = IPA.entity({
        'name': 'hbacsvcgroup'
    });

    that.init = function() {

        that.create_association({
            'name': 'hbacsvc',
            'add_method': 'add_member',
            'remove_method': 'remove_member'
        });

        var dialog = IPA.hbacsvcgroup_add_dialog({
            'name': 'add',
            'title': 'Add New HBAC Service Group'
        });
        that.add_dialog(dialog);
        
        var facet = IPA.hbacsvcgroup_search_facet({
            'name': 'search',
            'label': 'Search'
        });
        that.add_facet(facet);

        facet = IPA.hbacsvcgroup_details_facet({
            'name': 'details'
        });
        that.add_facet(facet);

        that.entity_init();
    };

    return that;
};


IPA.hbacsvcgroup_add_dialog = function (spec) {

    spec = spec || {};

    var that = IPA.add_dialog(spec);

    that.init = function() {

        that.add_field(IPA.text_widget({name:'cn', undo: false}));
        that.add_field(IPA.text_widget({name:'description', undo: false}));

        that.add_dialog_init();
    };

    return that;
};


IPA.hbacsvcgroup_search_facet = function (spec) {

    spec = spec || {};

    var that = IPA.search_facet(spec);

    that.init = function() {

        that.create_column({name:'cn', primary_key: true});
        that.create_column({name:'description'});

        that.search_facet_init();
    };


    return that;
};


IPA.hbacsvcgroup_details_facet = function (spec) {

    spec = spec || {};

    var that = IPA.details_facet(spec);

    that.init = function() {

        var section = IPA.details_list_section({
            'name': 'general',
            'label': 'General'
        });
        that.add_section(section);

        section.create_field({'name': 'cn'});
        section.create_field({'name': 'description'});

        section = IPA.details_section({
            'name': 'services',
            'label': 'Services'
        });
        that.add_section(section);

        var field = IPA.hbacsvcgroup_member_hbacsvc_table_widget({
            'name': 'member_hbacsvc',
            'label': 'Services',
            'other_entity': 'hbacsvc',
            'save_values': false
        });
        section.add_field(field);

        that.details_facet_init();
    };

    return that;
};


IPA.hbacsvcgroup_member_hbacsvc_table_widget = function (spec) {

    spec = spec || {};

    var that = IPA.association_table_widget(spec);

    that.init = function() {

        var column = that.create_column({
            name: 'cn',
            primary_key: true,
            width: '150px'
        });

        column.setup = function(container, record) {
            container.empty();

            var value = record[column.name];
            value = value ? value.toString() : '';

            $('<a/>', {
                'href': '#'+value,
                'html': value,
                'click': function (value) {
                    return function() {
                        var state = IPA.tab_state(that.other_entity);
                        state[that.other_entity + '-facet'] = 'details';
                        state[that.other_entity + '-pkey'] = value;
                        $.bbq.pushState(state);
                        return false;
                    };
                }(value)
            }).appendTo(container);
        };

        that.create_column({
            name: 'description',
            width: '350px'
        });

        that.create_adder_column({
            name: 'cn',
            primary_key: true,
            width: '100px'
        });

        that.create_adder_column({
            name: 'description',
            width: '100px'
        });

        that.association_table_widget_init();
    };

    return that;
};
