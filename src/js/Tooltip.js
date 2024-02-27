export default class Tooltip {
  constructor() {
    this._tooltips = [];
  }

  showTooltip(message, element) {
    // Показывает сообщение об ошибке
    const tooltipElement = document.createElement('div');
    tooltipElement.classList.add('form-error');
    tooltipElement.textContent = message;

    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    tooltipElement.append(arrow);

    document.body.appendChild(tooltipElement);

    const id = performance.now();
    this._tooltips.push({
      id,
      element: tooltipElement,
    });

    const elementCenter = element.offsetLeft + (element.offsetWidth / 2);
    const left = elementCenter - (tooltipElement.offsetWidth / 2);
    tooltipElement.style.left = `${left}px`;

    const top = element.offsetTop - tooltipElement.offsetHeight - 8;
    tooltipElement.style.top = `${top}px`;
    
    const widthArrow = tooltipElement.offsetWidth / 2 - arrow.offsetWidth / 2;
    arrow.style.left = `${widthArrow}px`;
    return id;
  }

  removeTooltip(id) {
    // Удаляет сообщение об ошибке
    const tooltip = this._tooltips.find((t) => t.id === id);
    tooltip.element.remove();
    this._tooltips = this._tooltips.filter((t) => t.id !== id);
  }
}