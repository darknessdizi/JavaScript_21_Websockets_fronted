export default class WindowEdit {
  constructor(conteiner) {
    this.conteiner = conteiner;
    // this.conteinerTasks = null;
    this.formListeners = [];
    // this.tasksListeners = [];
    // this.newTaskListeners = [];
    // this.deleteTaskListeners = [];
    this.changeListeners = [];
    this.popup = null;
    this.inputListeners = [];
  }

  init() {
    // Добавляем обработчики событий для элементов
    const form = this.drawPopup();
    form.addEventListener('submit', (event) => this.onSubmitForm(event));
    // const form = this.conteiner.querySelector('.add-form');
    // form.addEventListener('submit', (event) => this.onSubmitForm(event));

    // this.conteinerTasks = this.conteiner.querySelector('.conteiner-tasks');
    // this.conteinerTasks.addEventListener('click', (event) => this.onClickTasks(event));
  }

  static addTagHTML(parent, className = null, type = 'div') {
    // Создает заданный тег и добавляет его в parent
    const div = document.createElement(type);
    div.classList.add(className);
    parent.append(div);
    return div;
  }

  drawPopup() {
    // добавляет всплывающее окно ввода пользователя
    this.popup = WindowEdit.addTagHTML(this.conteiner, 'background-popup');
    const form = WindowEdit.addTagHTML(this.popup, 'popup-input-user', 'form');
    form.setAttribute('novalidate', '');

    const title = WindowEdit.addTagHTML(form, 'popup-title');
    title.textContent = 'Выберите псевдоним';

    const input = WindowEdit.addTagHTML(form, 'popup-input', 'input');
    input.setAttribute('required', '');
    input.setAttribute('name', 'user');
    input.focus();
    input.addEventListener('input', (event) => this.onInputValue(event));

    const btn = WindowEdit.addTagHTML(form, 'popup-button', 'button');
    btn.textContent = 'Продолжить';
    btn.type = 'Submit';

    return form;
  }

  drawChat() {
    // Отрисовка чата
    this.conteiner.classList.add('chat');
    WindowEdit.addTagHTML(this.conteiner, 'chat-names');
    const content = WindowEdit.addTagHTML(this.conteiner, 'chat-content');
    const textarea = WindowEdit.addTagHTML(content, 'chat-text', 'textarea');
    const input = WindowEdit.addTagHTML(content, 'chat-input', 'input');
    input.setAttribute('placeholder', 'Type your message here');
    input.addEventListener('change', (event) => this.onChangeChat(event));
  }

  drawUser(id, name) {
    // Отрисовка нового пользователя
    const block = this.conteiner.querySelector('.chat-names');
    const div = WindowEdit.addTagHTML(block, 'user-conteiner');
    const avatar = WindowEdit.addTagHTML(div, 'user-avatar');
    const nameUser =  WindowEdit.addTagHTML(div, 'user-name');
    nameUser.textContent = name;
    nameUser.setAttribute('id', id);
  }

  colorName(id) {
    // Подкраска имени
    const target = document.getElementById(id);
    target.classList.add('curentUser');
  }

  onSubmitForm(event) {
    // Событие Submit для формы 'Добавить тикет'
    event.preventDefault();
    this.formListeners.forEach((o) => o.call(null, event));
  }

  addFormListeners(callback) {
    // Сохраняет callback отправки формы
    this.formListeners.push(callback);
  }

  onInputValue(event) {
    // Событие ввода текста в поле input (имя пользователя)
    event.preventDefault();
    this.inputListeners.forEach((o) => o.call(null));
  }

  addInputListeners(callback) {
    // Сохраняет callback отправки формы
    this.inputListeners.push(callback);
  }

  onChangeChat(event) {
    // Событие ввода сообщения (поле input общего чата)
    event.preventDefault();
    this.changeListeners.forEach((o) => o.call(null));
  }

  addChangeListeners(callback) {
    // Сохраняет callback отправки формы
    this.changeListeners.push(callback);
  }

  // addTask(obj) {
  //   // Отрисовывает задачу
  //   const content = WindowEdit.addTagHTML(this.conteinerTasks, 'content-task');
  //   content.setAttribute('id', obj.id);
  //   const task = WindowEdit.addTagHTML(content, 'task');
  //   const status = WindowEdit.addTagHTML(task, 'task-status');
  //   if (obj.status === 'true') {
  //     status.classList.add('done');
  //   }
  //   const name = WindowEdit.addTagHTML(task, 'task-name');
  //   name.textContent = obj.name;
  //   const created = WindowEdit.addTagHTML(task, 'task-created');
  //   created.textContent = obj.created;
  //   const blockControll = WindowEdit.addTagHTML(task, 'task-controll');
  //   const edit = WindowEdit.addTagHTML(blockControll, 'task-edit');
  //   const cross = WindowEdit.addTagHTML(blockControll, 'task-delete');
  // }

  // addDescriptionTask(parent, text) {
  //   // отрисовывает полное описание задачи
  //   const description = WindowEdit.addTagHTML(parent, 'task-description');
  //   const pre = WindowEdit.addTagHTML(description, 'task-description-text', 'pre');
  //   if (text) {
  //     pre.textContent = text;
  //   } else {
  //     pre.textContent = 'Нету данных';
  //   }
  // }

  // createPopupNewTask() {
  //   // добавляет всплывающее окно новой задачи
  //   const btn = this.drawPopup();
  //   btn.addEventListener('click', (event) => this.onAddNewTasks(event));
  // }

  // createPopupEditTask() {
  //   // добавляет всплывающее окно для редактирования задачи
  //   const btn = this.drawPopup();
  //   btn.addEventListener('click', (event) => this.onEditTasks(event));
  // }

  // drawPopup() {
  //   // добавляет всплывающее окно новой задачи
  //   this.popup = WindowEdit.addTagHTML(this.conteiner, 'background-popup');
  //   const form = WindowEdit.addTagHTML(this.popup, 'popup-window', 'form');
  //   form.setAttribute('novalidate', '');

  //   const title = WindowEdit.addTagHTML(form, 'popup-title');
  //   title.textContent = 'Добавить тикет';

  //   const description = WindowEdit.addTagHTML(form, 'popup-description');
  //   description.textContent = 'Краткое описание';

  //   const input = WindowEdit.addTagHTML(form, 'popup-description-input', 'input');
  //   input.setAttribute('required', '');
  //   input.focus();

  //   const descriptionFull = WindowEdit.addTagHTML(form, 'popup-description-full');
  //   descriptionFull.textContent = 'Подробное описание';

  //   const textArea = WindowEdit.addTagHTML(form, 'popup-description-textarea', 'textarea');

  //   const divButtons = WindowEdit.addTagHTML(form, 'popup-buttons');

  //   const btnCancel = WindowEdit.addTagHTML(divButtons, 'popup-button-cancel', 'button');
  //   btnCancel.textContent = 'Отмена';
  //   btnCancel.type = 'Reset';

  //   const btn = WindowEdit.addTagHTML(divButtons, 'popup-button-ok', 'button');
  //   btn.textContent = 'Ок';
  //   btn.type = 'Submit';

  //   btnCancel.addEventListener('click', () => {
  //     this.popup.remove();
  //     this.popup = null;
  //   });
  //   return btn;
  // }

  // drawPopupNewTask() {
    // // добавляет всплывающее окно новой задачи
    // this.popup = WindowEdit.addTagHTML(this.conteiner, 'background-popup');
    // const form = WindowEdit.addTagHTML(this.popup, 'popup-window', 'form');
    // form.setAttribute('novalidate', '');

    // const title = WindowEdit.addTagHTML(form, 'popup-title');
    // title.textContent = 'Добавить тикет';

    // const description = WindowEdit.addTagHTML(form, 'popup-description');
    // description.textContent = 'Краткое описание';

    // const input = WindowEdit.addTagHTML(form, 'popup-description-input', 'input');
    // input.setAttribute('required', '');
    // input.focus();

    // const descriptionFull = WindowEdit.addTagHTML(form, 'popup-description-full');
    // descriptionFull.textContent = 'Подробное описание';

    // const textArea = WindowEdit.addTagHTML(form, 'popup-description-textarea', 'textarea');

    // const divButtons = WindowEdit.addTagHTML(form, 'popup-buttons');

    // const btnCancel = WindowEdit.addTagHTML(divButtons, 'popup-button-cancel', 'button');
    // btnCancel.textContent = 'Отмена';
    // btnCancel.type = 'Reset';

    // const btn = WindowEdit.addTagHTML(divButtons, 'popup-button-ok', 'button');
    // btn.textContent = 'Ок';
    // btn.type = 'Submit';

    // btnCancel.addEventListener('click', () => {
    //   this.popup.remove();
    //   this.popup = null;
    // });

    // btn.addEventListener('click', (event) => this.onAddNewTasks(event));
  // }



  // drawPopupDeleteTask(id) {
  //   // добавляет всплывающее окно удаления задачи
  //   this.popup = WindowEdit.addTagHTML(this.conteiner, 'background-popup');
  //   const form = WindowEdit.addTagHTML(this.popup, 'popup-window', 'form');

  //   const title = WindowEdit.addTagHTML(form, 'popup-title');
  //   title.textContent = 'Удалить тикет';

  //   const description = WindowEdit.addTagHTML(form, 'popup-description');
  //   description.textContent = 'Вы уверены, что хотите удалить тикет? Это действие необратимо.';

  //   const divButtons = WindowEdit.addTagHTML(form, 'popup-buttons');

  //   const btnCancel = WindowEdit.addTagHTML(divButtons, 'popup-button-cancel', 'button');
  //   btnCancel.textContent = 'Отмена';
  //   btnCancel.type = 'Reset';

  //   const btn = WindowEdit.addTagHTML(divButtons, 'popup-button-ok', 'button');
  //   btn.textContent = 'Ок';
  //   btn.type = 'Submit';

  //   btnCancel.addEventListener('click', () => {
  //     this.popup.remove();
  //     this.popup = null;
  //   });

  //   btn.addEventListener('click', (event) => this.onDeleteTasks(event, id));
  // }

  // onClickTasks(event) {
  //   // Событие нажатия клика на поле задачи
  //   event.preventDefault();
  //   this.tasksListeners.forEach((o) => o.call(null, event));
  // }

  // addClickTasksListeners(callback) {
  //   // Сохраняет callback нажатия поля задачи
  //   this.tasksListeners.push(callback);
  // }

  // onAddNewTasks(event) {
  //   // Событие click для кнопки 'ОК' добавления новой задачи
  //   event.preventDefault();
  //   const form = event.target.closest('.popup-window');
  //   if (form.checkValidity()) { // Проверка валидности формы
  //     this.newTaskListeners.forEach((o) => o.call(null, event));
  //   }
  // }

  // addNewTaskListeners(callback) {
  //   // Сохраняет callback нажатия поля задачи
  //   this.newTaskListeners.push(callback);
  // }

  // onEditTasks(event) {
  //   event.preventDefault();
  //   const form = event.target.closest('.popup-window');
  //   if (form.checkValidity()) { // Проверка валидности формы
  //     this.editTaskListeners.forEach((o) => o.call(null, event));
  //   }
  // }

  // addEditTaskListeners(callback) {
  //   // Сохраняет callback нажатия поля задачи
  //   this.editTaskListeners.push(callback);
  // }

  // onDeleteTasks(event, id) {
  //   // Событие click для кнопки 'ОК' удаления задачи
  //   event.preventDefault();
  //   this.deleteTaskListeners.forEach((o) => o.call(null, event, id));
  // }

  // addDeleteTaskListeners(callback) {
  //   // Сохраняет callback нажатия поля крестик для удаления задачи
  //   this.deleteTaskListeners.push(callback);
  // }
}