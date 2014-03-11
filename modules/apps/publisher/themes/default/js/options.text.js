var optionText;
$(function () {

    var OPTIONS_TEXT = '.options-text';
    var DATA_OPTIONS = 'options';
    var DATA_ADD_BUTTON_FIELD = 'add-button';
    var TABLE_ID = 'table-';
    var BUTTON_ID = 'add-button-';
    var TABLE_CSS = 'options-table';
    var DATA_SELECTED = 'selected';
    var OPTIONS_INDEX = 0;
    var TEXT_INDEX = 1;
    var DELETE_INDEX = 2;

    var optionMasterLayout = "<div><input id='" + BUTTON_ID + "{{id}}' type='button' value='{{addButtonName}}' class='btn' /> "
        + "<table id='" + TABLE_ID + "{{id}}' class='" + TABLE_CSS + "'></table>"
        + "</div>";
    var optionsLayout = "<select><option selected>{{selectedOption}}</option>{{#each data}} <option>{{this}}</option> {{/each}}</select>";
    var optionsTableButton = "<input class='btn' type='button' value='Delete' />";
    var optionsTextField = "<input type='text' value='{{selectedText}}' />";

    var compiledOptionsMasterLayout = Handlebars.compile(optionMasterLayout);
    var compiledOptionsLayout = Handlebars.compile(optionsLayout);
    var compiledOptionsTableButton = Handlebars.compile(optionsTableButton);
    var compiledOptionsTextField = Handlebars.compile(optionsTextField);


    function DataMap() {
        this.map = {};
    }

    DataMap.prototype.add = function (key, data) {
        this.map[key] = data;
    };

    DataMap.prototype.find = function (key) {
        if (this.map.hasOwnProperty(key)) {
            return this.map[key];
        }

        return null;
    };

    var dataMap = new DataMap();

    findAllOptionsTextFields(dataMap);


    /*
     The function obtains all elements in a page with the .options-text class
     */
    function findAllOptionsTextFields(dataMap) {

        $(OPTIONS_TEXT).each(function () {
            var outputOptionsMasterLayout;
            var addButtonName;
            var optionsData = $(this).data(DATA_OPTIONS);
            var optionsSelected = $(this).data(DATA_SELECTED);
            var data;

            data = optionsData.split(',');

            dataMap.add(this.id, {data: data, addButtonName: addButtonName});

            if (optionsSelected) {
                var selected = optionsSelected.split(',');
                addSelectedToMap(this.id, dataMap, selected);
            }
            addButtonName = $(this).data(DATA_ADD_BUTTON_FIELD);

            outputOptionsMasterLayout = compiledOptionsMasterLayout({id: this.id, addButtonName: addButtonName});

            $(this).html(outputOptionsMasterLayout);

            var tableInstance = $('#' + TABLE_ID + this.id)[0];

            populate(this.id, dataMap, tableInstance);

            $('#' + BUTTON_ID + this.id).on('click', function () {
                var table;
                var row;
                var cell1;
                var cell2;
                var cell3;
                var id;
                var data;
                var selectField = '';

                table = $(this).parent().children('.' + TABLE_CSS)[0];
                id = $(this).parent().parent()[0].id;

                data = dataMap.find(id);

                if (data) {
                    selectField = compiledOptionsLayout({data: data.data});
                }

                row = table.insertRow(-1);
                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);
                cell3 = row.insertCell(2);

                cell1.innerHTML = selectField;
                cell2.innerHTML = compiledOptionsTextField({selectedText: ''});
                cell3.innerHTML = compiledOptionsTableButton();

                $(cell3).on('click', function (event) {
                    var rowIndex;
                    var tableNode;
                    rowIndex = event.currentTarget.parentNode.rowIndex;
                    tableNode = event.currentTarget.parentNode.parentNode;

                    tableNode.deleteRow(rowIndex);

                });
            });


        });
    }

    /*
     The function populates the options text field with data in the data-selected attribute
     */
    function populate(key, dataMap, table) {
        var selected;
        var data;
        var item;
        var row;
        var cell1;
        var cell2;
        var cell3;

        var items = dataMap.find(key);
        selected = items.selected;
        data = dataMap.find(key).data;

        if (!selected) {
            return;
        }

        for (var index in selected) {
            item = selected[index];

            row = table.insertRow(-1);
            cell1 = row.insertCell(OPTIONS_INDEX);
            cell2 = row.insertCell(TEXT_INDEX);
            cell3 = row.insertCell(2);

            //Remove the

            cell1.innerHTML = compiledOptionsLayout(getFiltered(data, item.option));
            cell2.innerHTML = compiledOptionsTextField({selectedText: item.selectedText});
            cell3.innerHTML = compiledOptionsTableButton();

            $(cell3).on('click', function (event) {
                var rowIndex;
                var tableNode;
                rowIndex = event.currentTarget.parentNode.rowIndex;
                tableNode = event.currentTarget.parentNode.parentNode;

                tableNode.deleteRow(rowIndex);

            });
        }
    }

    function getFiltered(data, ignore) {

        var notSelected = [];

        for (var index in data) {
            if (data[index] != ignore) {
                notSelected.push(data[index]);
            }

        }

        return{
            selectedOption: ignore,
            data: notSelected
        }
    }

    /*
     The function adds the selected items to the data map
     */
    function addSelectedToMap(key, dataMap, data) {
        var item;
        var comps;
        var selected = [];
        var instance;

        instance = dataMap.find(key);

        for (var index in data) {
            item = data[index];
            comps = item.split(':');
            selected.push({option: comps[0], selectedText: comps[1]});
        }

        instance.selected = selected;
    }

    function getSelected(dataMap) {
        var row;
        var table;
        var data;

        //Go through all of the keys
        for (var key in dataMap.map) {
            //Go through each element
            table = $('#' + key).children().children()[1];

            data = [];

            for (var rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
                row = pullDataFromRow(table.rows[rowIndex]);

                //Do not add if the row is empty
                if (row != '') {
                    data.push(row);
                }

            }

            dataMap.map[key].output = data.join(',');
        }
        //console.log(getOutput(dataMap));

    }

    function getOutput(dataMap) {
        var data = [];
        var results = [];
        var item;

        for (var key in dataMap.map) {
            item = dataMap.map[key].output;
            if (item!='') {
                data.push({fieldName: key, data: item})
            }
        }

        return data;
    }

    function pullDataFromRow(row) {
        var cell1;
        var cell2;
        var combined;
        var selected;
        var text;

        cell1 = row.cells[OPTIONS_INDEX];
        cell2 = row.cells[TEXT_INDEX];

        cell1 = $(cell1).children()[0];
        cell2 = $(cell2).children()[0];

        selected = $(cell1).val();
        text = $(cell2).val();

        if ((selected == '') || (text == '')) {
            return '';
        }

        combined = selected + ':' + text;

        return combined;
    }


    function OptionText(){

    }


    OptionText.prototype.getOutput=function(){
        getSelected(dataMap);
        return getOutput(dataMap);
    };

    optionText=new OptionText();

});