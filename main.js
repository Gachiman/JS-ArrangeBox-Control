class ArrangeBoxContainer {

  constructor() {
    this.container = document.getElementById('arrangeBoxContainer');

    this.initialAvailableValues = [];
    for (let i = 0; i < 10; i++) {
      this.initialAvailableValues.push(this.generateRandomString());
    }

    this.clickedListItem = undefined;

    this.listAvailable = this.createList(this.initialAvailableValues);
    this.listSelected = this.createList();

    let boxContainer = document.createElement('div');
    boxContainer.className = 'arrange_box_main_container';

    boxContainer.append(this.createArrangeBoxArea(), this.createControlArea());
    this.container.append(boxContainer);
  }

  createArrangeBoxArea() {
    let arrangeBoxArea = document.createElement('div');
    arrangeBoxArea.className = 'arrange_box_area';

    let leftButtonsArea = this.createButtons(
      5,
      ['\u25B2', '\u25B3', '\u25BD', '\u25BC', '\u271A'],
      [
        () => this.upByAll(this.listAvailable),
        () => this.upByOne(),
        () => this.downByOne(),
        () => this.downByAll(this.listAvailable),
        () => this.addListElement(this.listAvailable)
      ]
    );

    let leftBoxArea = this.createBoxArea('Available');

    let middleButtonsArea = this.createButtons(
      4,
      ['\u25B6', '\u25B7', '\u25C1', '\u25C0'],
      [
        () => this.moveAllToSelected(),
        () => this.moveOneToSelected(),
        () => this.moveOneToAvailable(),
        () => this.moveAllToAvailable(),
      ]
    );

    let rightBoxArea = this.createBoxArea('Selected');

    let rightButtonsArea = this.createButtons(
      5,
      ['\u25B2', '\u25B3', '\u25BD', '\u25BC', '\u271A'],
      [
        () => this.upByAll(this.listSelected),
        () => this.upByOne(),
        () => this.downByOne(),
        () => this.downByAll(this.listSelected),
        () => this.addListElement(this.listSelected)
      ]
    );

    arrangeBoxArea.append(leftButtonsArea, leftBoxArea, middleButtonsArea, rightBoxArea, rightButtonsArea);

    return arrangeBoxArea;
  }

  // create buttons for arrangeBoxArea
  createButtons(amount, opSymbols, operations) {
    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'arrange_box_area_buttons';

    for (let i = 0; i < amount; i++) {
      let button = document.createElement('button');
      button.innerText = opSymbols[i];
      button.addEventListener('click', operations[i]);
      buttonsContainer.append(button);
    }

    return buttonsContainer;
  }

  // create main areas for arrangeBoxArea
  createBoxArea(labelText) {
    let boxContainer = document.createElement('div');
    boxContainer.className = 'box_area';

    let boxLabel = document.createElement('div');
    boxLabel.className = 'box_area_head';
    boxLabel.innerText = labelText;

    let boxSearch = document.createElement('div');
    boxSearch.className = 'box_search';
    let boxSearchInput = document.createElement('input');
    boxSearchInput.className = 'box_search_input';
    boxSearchInput.setAttribute('placeholder', 'Search by name');
    
    if (labelText == 'Available') {
      boxSearchInput.addEventListener('input', () => this.searchInput(this.listAvailable, boxSearchInput))
      boxSearch.append(boxSearchInput);
      boxContainer.append(boxLabel, boxSearch, this.listAvailable);
    } else {
      boxSearchInput.addEventListener('input', () => this.searchInput(this.listSelected, boxSearchInput))
      boxSearch.append(boxSearchInput);
      boxContainer.append(boxLabel, boxSearch, this.listSelected);
    }
    return boxContainer;
  }

  searchInput(targetedList, searchInput) {
    let searchText = searchInput.value.toLowerCase();

    for (let item of targetedList.children) {
      if (item.textContent.toLowerCase().includes(searchText)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    }
  }

  createList(initialValues) {
    let boxItemsList = document.createElement('ul');
    boxItemsList.className = 'box_list';

    if (initialValues === undefined)  return boxItemsList;

    for (let value of initialValues) {
      let listElem = document.createElement('li');
      listElem.innerText = value;
      listElem.addEventListener('click', () => this.clickListItem(listElem));
      boxItemsList.append(listElem);
    }

    return boxItemsList;
  }

  clickListItem(clickedListItem) {
    if (this.clickedListItem) {
      this.clickedListItem.classList.remove('clicked_list_item');
      if (this.clickedListItem === clickedListItem) {
        this.clickedListItem = undefined;
      } else {
        this.clickedListItem = clickedListItem;
        this.clickedListItem.classList.add('clicked_list_item');
      }
    } else {
      this.clickedListItem = clickedListItem;
      clickedListItem.classList.add('clicked_list_item');
    }
  }

  // BUTTONS OPERATIONS /////////////////////////////////

  upByAll(targetedList) {
    if (this.clickedListItem) {
      targetedList.firstElementChild.before(this.clickedListItem);
    }
  }

  upByOne() {
    if (this.clickedListItem) {
      let upperSibling = this.clickedListItem.previousElementSibling;
      if (upperSibling) {
        upperSibling.before(this.clickedListItem);
      }
    }
  }

  downByOne() {
    if (this.clickedListItem) {
      let downerSibling = this.clickedListItem.nextElementSibling;
      if (downerSibling) {
        downerSibling.after(this.clickedListItem);
      }
    }
  }

  downByAll(targetedList) {
    if (this.clickedListItem) {
      targetedList.lastElementChild.after(this.clickedListItem);
    }
  }

  addListElement(targetedList) {
    let newItemText = prompt('Enter your wish:');
    if (newItemText) {
      let listItem = document.createElement('li');
      listItem.innerText = newItemText;
      listItem.addEventListener('click', () => this.clickListItem(listItem));
      targetedList.append(listItem);
    }
  }

  moveAllToSelected() {
    for (let i = this.listAvailable.children.length - 1; i >= 0; i--) {
      this.listSelected.append(this.listAvailable.children[i]);
    }
  }

  moveOneToSelected() {
    if (this.clickedListItem) {
      this.listSelected.append(this.clickedListItem);
    }
  }

  moveOneToAvailable() {
    if (this.clickedListItem) {
      this.listAvailable.append(this.clickedListItem);
    }
  }

  moveAllToAvailable() {
    for (let i = this.listSelected.children.length - 1; i >= 0; i--) {
      this.listAvailable.append(this.listSelected.children[i]);
    }
  }

  // CONTROL AREA /////////////////////////////////

  createControlArea() {
    let controlArea = document.createElement('div');
    controlArea.className = 'control_area';

    let getLeftButton = document.createElement('button');
    getLeftButton.innerText = 'Get available';
    getLeftButton.addEventListener('click', () => this.showListItems(this.listAvailable));

    let createNewBoxButton = document.createElement('button');
    createNewBoxButton.innerText = 'Create new arrange box';
    createNewBoxButton.addEventListener('click', this.createNewArrangeBox);

    let resetButton = document.createElement('button');
    resetButton.innerText = 'Reset';
    resetButton.addEventListener('click', () => this.resetToInitialState());

    let getRightButton = document.createElement('button');
    getRightButton.innerText = 'Get selected';
    getRightButton.addEventListener('click', () => this.showListItems(this.listSelected));

    controlArea.append(getLeftButton, createNewBoxButton, resetButton, getRightButton);

    return controlArea;
  }

  resetToInitialState() {
    for (let i = this.listSelected.children.length - 1; i >= 0; i--) {
      this.listSelected.children[i].remove();
    }
    for (let i = this.listAvailable.children.length - 1; i >= 0; i--) {
      this.listAvailable.children[i].remove();
    }

    for (let value of this.initialAvailableValues) {
      let listElem = document.createElement('li');
      listElem.innerText = value;
      this.listAvailable.append(listElem);
    }
  }

  showListItems(targetList) {
    let itemsSet = [];
    for (let item of targetList.children) {
      itemsSet.push(item.textContent);
    }

    if (itemsSet.length) {
      itemsSet = itemsSet.join(', ');
      itemsSet = 'Let\'s take a look: ' + itemsSet;
    } else {
      itemsSet = 'Your treasury is empty, my Lord.';
    }

    alert(itemsSet);
    console.log(itemsSet);
  }

  generateRandomString() {
    const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charSetLength = charSet.length;
    for (let i = 0; i < 7; i++) {
      result += charSet.charAt(Math.floor(Math.random() * charSetLength));
    }
    return result;
  }

  createNewArrangeBox() {
    let newBox = new ArrangeBoxContainer();
  }

}

let arrangeBox = new ArrangeBoxContainer();