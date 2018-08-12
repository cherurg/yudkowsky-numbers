;(function(window, document) {
  let currentDocument = document.currentScript.ownerDocument

  let template = currentDocument.querySelector('template').content

  class YudkowskyNumbers extends HTMLElement {
    constructor() {
      super()
    }

    connectedCallback() {
      this.attachTemplate()
    }

    attachTemplate() {
      let clone = currentDocument.importNode(template, true)

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(clone)

      this.initElements()
    }

    initElements() {
      let fisrtNumber = this.shadowRoot.querySelector('.first-number')
      let secondNumber = this.shadowRoot.querySelector('.second-number')
      let thirdNumber = this.shadowRoot.querySelector('.third-number')

      this.numberInputs = [fisrtNumber, secondNumber, thirdNumber]
      this.numberInputs.map(it =>
        it.addEventListener('focus', ({ target }) => {
          target.setSelectionRange(0, target.value.length)
        }),
      )

      this.checkButton = this.shadowRoot.querySelector('.check-button')
      // TODO: remove event listener on disconnect?
      this.checkButton.addEventListener('click', () => {
        this.checkNumbers()
        this.numberInputs[0].focus()
      })

      this.historyContainer = this.shadowRoot.querySelector(
        '.history-container',
      )
      this.statusContainer = this.shadowRoot.querySelector('.status')
    }

    checkNumbers() {
      let numbersOk = this.verifyNumbers()
      if (!numbersOk) {
        return
      }

      let numbers = this.numberInputs.map(it => +it.value)
      let result = this.rule(numbers)
      let resultStatus = result ? 'Yes' : 'No'

      let element = currentDocument.createElement('p')

      element.innerHTML = numbers.join(', ') + ': ' + resultStatus + '.'

      this.historyContainer.insertBefore(
        element,
        this.historyContainer.firstChild,
      )
    }

    verifyNumbers(numberInput) {
      let ok = true
      for (let numberInput of this.numberInputs) {
        let value = numberInput.value
        let notNan = !Number.isNaN(+value)
        let notEmpty = value !== ''
        let numberOk = notNan && notEmpty
        ok = ok && numberOk
      }

      return ok
    }

    rule(numbers) {
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i + 1] <= numbers[i]) {
          return false
        }
      }
      return true
    }
  }

  window.customElements.define('yudkowsky-numbers', YudkowskyNumbers)
})(window, document)
