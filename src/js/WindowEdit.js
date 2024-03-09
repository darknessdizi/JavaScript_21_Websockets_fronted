export default class WindowEdit {
  constructor(conteiner) {
    this.conteiner = conteiner;
    this.chat = null;
    this.formListeners = [];
    this.changeListeners = [];
    this.popup = null;
    this.inputListeners = [];
  }

  init() {
    // Добавляем обработчики событий для элементов
    const form = this.drawPopup();
    form.addEventListener('submit', (event) => this.onSubmitForm(event));
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
    this.chat = WindowEdit.addTagHTML(content, 'chat-text', 'div');
    const input = WindowEdit.addTagHTML(content, 'chat-input', 'input');
    input.setAttribute('placeholder', 'Type your message here');
    input.addEventListener('change', (event) => this.onChangeChat(event));
    input.focus();
    return true;
  }

  drawUser(id, name) {
    // Отрисовка нового пользователя
    const block = this.conteiner.querySelector('.chat-names');
    const div = WindowEdit.addTagHTML(block, 'user-conteiner');
    WindowEdit.addTagHTML(div, 'user-avatar');
    const nameUser = WindowEdit.addTagHTML(div, 'user-name');
    nameUser.textContent = name;
    div.setAttribute('id', id);
  }

  drawMessage(obj) {
    // Отрисовка сообщения пользователя
    const div = WindowEdit.addTagHTML(this.chat, 'message');
    const title = WindowEdit.addTagHTML(div, 'message-title');
    title.textContent = `${obj.name}, ${obj.create}`;
    const text = WindowEdit.addTagHTML(div, 'message-text');
    text.textContent = obj.message;
    return div;
  }

  static colorName(id) {
    // Подкраска имени текущего пользователя
    const target = document.getElementById(id);
    target.classList.add('curentUser');
    // const name = target.querySelector('.user-name');
    // name.textContent = 'Я';
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
    this.changeListeners.forEach((o) => o.call(null, event));
  }

  addChangeListeners(callback) {
    // Сохраняет callback отправки формы
    this.changeListeners.push(callback);
  }
}
