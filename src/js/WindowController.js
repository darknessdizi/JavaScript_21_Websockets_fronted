import Tooltip from './Tooltip';

const errors = {
  user: {
    valueMissing: 'Укажите свой псевдоним!',
    // patternMismatch: 'Имя только на латинице!', // для вариантов развития
    doubleName: 'Такое имя уже используется!',
  },
};

export default class WindowController {
  constructor(editor, port) {
    this.editor = editor;
    this.urlServer = `http://localhost:${port}`;
    this.toolTip = new Tooltip();
    this.actualMessages = [];
    this.id = null;
    // Для открытия соединения достаточно создать объект WebSocket
    // протокол для ws в скобках
    this.ws = new WebSocket(`ws://localhost:${port}`);
    this.createChat = false;
  }

  init() {
    this.editor.init();
    this.editor.addFormListeners(this.onSubmitForm.bind(this));
    this.editor.addInputListeners(this.onInputValue.bind(this));
    this.editor.addChangeListeners(this.onChangeChat.bind(this));

    this.ws.addEventListener('open', (e) => {
      console.log(e);
      console.log('ws open');
    });

    this.ws.addEventListener('close', (e) => {
      console.log(e);
      console.log('ws close');
    });

    this.ws.addEventListener('error', (e) => {
      console.log(e);
      console.log('ws error');
    });

    this.ws.addEventListener('message', (e) => {
      console.log(e);
      const data = JSON.parse(e.data);
      if (data.status === 'connect') {
        this.id = data.body.id;
        return;
      }
      if (data.status === 'addUser') {
        if ((data.body.id === this.id) || (!this.createChat)) {
          return;
        }
        this.editor.drawUser(data.body.id, data.body.name);
        return;
      }
      if (data.status === 'delete') {
        const div = document.getElementById(data.body.id);
        if (div) {
          div.remove();
        }
        return;
      }
      if ((data.status === 'message') && (this.createChat)) {
        const obj = data.body;
        const date = WindowController.getNewFormatDate(obj.create);
        obj.create = date;
        const div = this.editor.drawMessage(obj);
        if (data.body.id === this.id) {
          div.classList.add('owner');
        }
        this.editor.chat.scrollTop = this.editor.chat.scrollHeight;
      }
    });
  }

  async onSubmitForm(event) {
    // Callback - событие submit ввода имя пользователя
    const { elements } = event.target;
    [...elements].some((elem) => {
      const error = WindowController.getError(elem);
      if (error) {
        this.showTooltip(error, elem); // popup об ошибке ввода имени
        elem.focus();
        return true;
      }
      return false;
    });
    if (!event.target.checkValidity()) {
      return;
    }

    const url = `${this.urlServer}/addUser/`;
    const data = new FormData(event.target);
    data.append('id', this.id);
    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });

    const obj = await response.json();
    if (response.status === 201) {
      this.editor.popup.remove();
      this.editor.popup = null;
      this.createChat = this.editor.drawChat();
      for (const item of obj.array) {
        if (item.name) {
          this.editor.drawUser(item.id, item.name);
        }
        if (item.id === this.id) {
          this.editor.constructor.colorName(item.id);
          this.ws.send(JSON.stringify({ id: item.id, name: item.name }));
        }
      }
      for (const item of obj.meassages) {
        this.editor.drawMessage(item);
      }
      this.editor.chat.scrollTop = this.editor.chat.scrollHeight;
    }
    if (obj.status === 'имя занято') {
      const elem = [...elements].find((el) => el.name === 'user');
      this.showTooltip(errors.user.doubleName, elem);
    }
  }

  onChangeChat(event) {
    // отправка сообщений в чате
    const obj = {
      id: this.id,
      message: event.target.value,
    };
    this.ws.send(JSON.stringify(obj));
    const { target } = event;
    target.value = '';
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
    // Удаление сообщения об ошибке в поле input
    this.actualMessages.forEach((item) => {
      this.toolTip.removeTooltip(item.id);
    });
    this.actualMessages = [];
  }

  static _addZero(number) {
    // делает число двухзначным
    let result = number;
    if (result < 10) {
      result = `0${result}`;
    }
    return result;
  }

  static getNewFormatDate(timestamp) {
    // возвращает новый формат даты и времени
    const start = new Date(timestamp);
    const year = String(start.getFullYear());
    const month = WindowController._addZero(start.getMonth());
    const date = WindowController._addZero(start.getDate());
    const hours = WindowController._addZero(start.getHours());
    const minutes = WindowController._addZero(start.getMinutes());
    const time = `${hours}:${minutes} ${date}.${month}.${year}`;
    return time;
  }
}
