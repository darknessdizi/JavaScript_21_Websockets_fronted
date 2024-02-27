import Tooltip from './ToolTip';

const errors = {
  user: {
    valueMissing: 'Укажите свой псевдоним!',
    // patternMismatch: 'Имя только на латинице!', // для вариантов развития
    doubleName: 'Такое имя уже используется!',
  }
};

export default class WindowController {
  constructor(editor, port) {
    this.editor = editor;
    this.urlServer = `http://localhost:${port}`;
    this.toolTip = new Tooltip();
    this.actualMessages = [];
    this.userName = null;
  }

  init() {
    this.editor.init();
    this.editor.addFormListeners(this.onSubmitForm.bind(this));
    this.editor.addInputListeners(this.onInputValue.bind(this));
    this.editor.addChangeListeners(this.onChangeChat.bind(this));
  }

  onChangeChat() {
    
  }

  saveName(elements) {
    // Сохранение своего имени
    // console.log(elements);
    [...elements].forEach((elem) => {
      // console.log(elem)
      if (elem.name) {
        // console.log('успех')
        this.userName = elem.value;
        // console.log(this.userName)
      }
    });
  }

  async onSubmitForm(event) {
    // Callback - событие submit ввода имя пользователя
    const { elements } = event.target;
    this.saveName(elements);
    [...elements].some((elem) => {
      const error = WindowController.getError(elem);
      if (error) {
        this.showTooltip(error, elem);
        elem.focus();
        return true;
      }
      return false;
    });
    if (!event.target.checkValidity()) {
      return;
    }

    const url = `${this.urlServer}/addUser/`;
    const response = await fetch(url, {
      method: 'POST',
      body: new FormData(event.target)
    });

    const obj = await response.json();
    if (response.status === 201) {
      this.editor.popup.remove();
      this.editor.popup = null;
      this.editor.drawChat();
      for (const item of obj.array) {
        this.editor.drawUser(item.id, item.name);
        if (item.name === this.userName) {
          this.editor.colorName(item.id);
        }
      }
    }
    if (obj.status === 'имя занято') {
      const elem = [...elements].find((elem) => {
        return elem.name === 'user';
      });
      this.showTooltip(errors.user.doubleName, elem);
    }
  }

  showTooltip(message, el) {
    // Сохраняет имя элемента с ошибкой и его номер
    this.actualMessages.push({
      name: el.name,
      id: this.toolTip.showTooltip(message, el),
    });
  }

  static getError(el) {
    // Возвращает текст сообщения об ошибке
    const errorKey = Object.keys(ValidityState.prototype).find((key) => {
      if (!el.name) return false;
      if (key === 'valid') return false;
      return el.validity[key];
    });
    if (!errorKey) return false;
    return errors[el.name][errorKey];
  }

  onInputValue() {
    // Удаление сообщения об ошибке поля input
    this.actualMessages.forEach((item) => {
      this.toolTip.removeTooltip(item.id);
    });
    this.actualMessages = [];
  }

  
}
