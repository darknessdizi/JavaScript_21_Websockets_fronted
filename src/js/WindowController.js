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
    this.id = null;
  }

  init() {
    this.editor.init();
    this.editor.addFormListeners(this.onSubmitForm.bind(this));
    this.editor.addInputListeners(this.onInputValue.bind(this));
    this.editor.addChangeListeners(this.onChangeChat.bind(this));
  }

  async onChangeChat(event) {
    // const query = encodeURIComponent(event.target.value);
    const url = `${this.urlServer}/message/`;
    const obj = {
      id: this.id,
      message: event.target.value
    }
    // const response = await fetch(url + query, {
    const response = await fetch(url, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json' // задаем тип передаваемого параметра
      // },
      body: JSON.stringify(obj)
    });
    // const message = event.target.value;
    const res = await response.json();
    console.log('chat', typeof res, res)
    // const res = JSON.parse
    this.editor.drawMessage(res.result);
  }

  // saveName(elements) {
  //   // Сохранение своего имени
  //   // console.log(elements);
  //   [...elements].forEach((elem) => {
  //     // console.log(elem)
  //     if (elem.name) {
  //       // console.log('успех')
  //       this.userName = elem.value;
  //       // console.log(this.userName)
  //     }
  //   });
  // }

  async onSubmitForm(event) {
    // Callback - событие submit ввода имя пользователя
    const { elements } = event.target;
    // this.saveName(elements);
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
      this.id = obj.array[obj.array.length - 1].id;
      for (const item of obj.array) {
        this.editor.drawUser(item.id, item.name);
        if (item.id === this.id) {
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
