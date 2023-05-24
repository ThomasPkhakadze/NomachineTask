var container = document.getElementById('container');

getProductNames();

function getProductNames(){
    // Maybe ajax call was unnecessary, 
    // Logic work in .done(), but machines.js file should be viewed as string aka .txt file
    // to read comments as properties...
    var commentsArray = [];
    $.ajax({
        type: 'GET',
        headers:{
            'Content-Type':'text/plain',
            'Access-Control-Allow-Headers': '*'
        },
        url: './js/machines.js',
    })
    .done(function(response) {
        var regex = /(\/\/.*)/g;
        var comments = response.match(regex);
        comments.forEach(function(comment, index) {                
            commentsArray[index] = comment.substring(3, comment.length);
        });
        updateProductNames(commentsArray);
    });
}

function updateProductNames(productNames){
    // Update machine objects with full product names            
    for(var i = 0; i < machines.length; i++){ // machines variable comes from machines.js(included script file in head)
        machines[i]['Product'] = productNames[i]; 
        // Pass Machine specs to be iterated into data rows when creating new HTML element    
        var machineSpecs = [
            {
                OS: machines[i]['OS'] 
            },
            {
                'Machine name': machines[i]['Machine name']
            },
            {
                Status: machines[i]['Status']
            }
        ];

        // Create HTML elements
        createItem(machines[i]['Product'], machines[i]['ID'], machines[i]['Parent-ID'], machineSpecs);
    }
}    

function createItem(productName, Id, ParentId, MachineSpecs){
    // Item
    var item = document.createElement("div");
    item.classList.add('item')

    // Add data-id and data-parent-id to item
    item.setAttribute('data-id', Id);
    item.setAttribute('data-parent-id', ParentId);

    // Title
    var itemTitle = document.createElement("p");
    itemTitle.classList.add('title');

    // Title text
    var itemTitleText = document.createTextNode(productName);

    // Append text to title and title to item
    itemTitle.appendChild(itemTitleText);
    item.appendChild(itemTitle);

    for(var i = 0; i < MachineSpecs.length; i++){
        // If unrechable add styling
        if(MachineSpecs[i]['Status'] === 'unreachable'){
            item.classList.add('unrechable');
        }
        // IF not add click function
        else if(MachineSpecs[i]['Status'] === 'running'){
            item.addEventListener('dblclick', function(){
                item.classList.add('selected');
                showChildren(Id);
            })
        }
        // Data row
        var ItemDataRow = document.createElement("div")
        ItemDataRow.classList.add('data-row');

        // Data row property
        var ItemDataRowProperty = document.createElement("p");
        ItemDataRowProperty.classList.add('property');

        // Data row property text
        var ItemDataRowPropertyText = document.createTextNode(Object.keys(MachineSpecs[i]));

        // Append property text to parent        
        ItemDataRowProperty.appendChild(ItemDataRowPropertyText);

        // Data row value
        var ItemDataRowValue = document.createElement("p");
        ItemDataRowValue.classList.add('value');
        
        // Data row value text
        var ItemDataRowValueText = document.createTextNode(Object.values(MachineSpecs[i]));

        // Append value text to parent                
        ItemDataRowValue.appendChild(ItemDataRowValueText);

        // Append property & value to data-row and data-row to item
        ItemDataRow.appendChild(ItemDataRowProperty)
        ItemDataRow.appendChild(ItemDataRowValue)
        item.appendChild(ItemDataRow);
    }
    // Finally append item to container
    container.appendChild(item);
}

function showChildren(Id){
    var items = document.querySelectorAll('.item');
    items.forEach(function(item, index) {    
        item.classList.remove('hidden');            
        if(item.getAttribute('data-parent-id') !== Id && item.getAttribute('data-id') !== Id){
            item.classList.add('hidden');
        }
    });
}
