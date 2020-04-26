import { Dropdown, staticDataBindHandler, debounce } from '../src/index.js';
import data from './data.js';

const DEBOUNCE_TIME = 5000;

new Dropdown({
        targetElementSelector: '.dropdown-target',
        keyPorpertyIndetifier: 'id',
        valuePropertyIdentifier: 'product',
        selected: new Map([ [ '10', 'TrailChef Deluxe Cook Set' ] ]),
    })
    .onDataBind(staticDataBindHandler(data))
    // listen to select change with a 5s debounce delay.
    .onSelectionChange(debounce((map) => {
        let selectedItems = Array.from(map).map(([ key, value ]) => {
            return `${key} - ${value}`;
        }).join('\n');

        alert(selectedItems || 'No options selected.');
    }, DEBOUNCE_TIME))
    .redner();
