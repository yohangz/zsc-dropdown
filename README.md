# ZSC Multi Select Dropdown Component
> Framework agnostic multi select dropdown component.

## Usage

### Integration

```js
import { Dropdown, staticDataBindHandler, debounce } from 'path/to/dropdown';
import data from './data.js';

// Create dropdown with configuration options.
const dropdown = new Dropdown({
  targetElementSelector: '.dropdown-target',
  keyPorpertyIndetifier: 'id',
  valuePropertyIdentifier: 'product',
  selected: new Map([['10', 'TrailChef Deluxe Cook Set']]),
})
  .onDataBind(staticDataBindHandler(data)) // Static data bind handler can be used to directly bind static data sources.
  .onSelectionChange((selected) => {
    // This event is triggered when option select state change.
    // This event handler is triggered with all selected options map.
  })
  .onOptionSelectionChange(( { key, value, selected } ) => {
    // This event is triggered when option select state change.
    // This event handler is triggered with each selection changed items state.
  })
  .redner(); // Render dropdown component.


// Dispose method can be used to safely remove and cleanup dropdown reference.
dropdown.dispose();
```

### Config options

|   |   |
|---|---|
|   |   |
|   |   |
|   |   |

### Run Demo

Host project root in any HTTP server and view `demo/index.html`

## TODO: Future Enhansments
- Comprehensive unit test suite.
- Cross browser compatibility.
- Selected option remove support in selection view.
- Lazy loading dropdown options.
- Comprehensive accessibility support.
- Multi theme compatibility.
- Proper packaging/bunding support.
