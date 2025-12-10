import { useState } from 'react'
export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num)
  }

  const handleOperation = (op: string) => {
    setPreviousValue(parseFloat(display))
    setOperation(op)
    setDisplay('0')
  }

  const handleEquals = () => {
    if (previousValue === null || operation === null) return

    const current = parseFloat(display)
    let result = 0

    switch (operation) {
      case '+':
        result = previousValue + current
        break
      case '-':
        result = previousValue - current
        break
      case '*':
        result = previousValue * current
        break
      case '/':
        result = previousValue / current
        break
    }

    setDisplay(result.toString())
    setPreviousValue(null)
    setOperation(null)
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
  }

  return (
    <div className="calculator">
      <div className="calculator-display">{display}</div>
      <div className="calculator-buttons">
        <button onClick={handleClear} className="calculator-btn calculator-btn-clear">C</button>
        <button onClick={() => handleOperation('/')} className="calculator-btn calculator-btn-operation">/</button>
        <button onClick={() => handleOperation('*')} className="calculator-btn calculator-btn-operation">×</button>
        <button onClick={() => handleOperation('-')} className="calculator-btn calculator-btn-operation">-</button>

        <button onClick={() => handleNumber('7')} className="calculator-btn">7</button>
        <button onClick={() => handleNumber('8')} className="calculator-btn">8</button>
        <button onClick={() => handleNumber('9')} className="calculator-btn">9</button>
        <button onClick={() => handleOperation('+')} className="calculator-btn calculator-btn-operation">+</button>

        <button onClick={() => handleNumber('4')} className="calculator-btn">4</button>
        <button onClick={() => handleNumber('5')} className="calculator-btn">5</button>
        <button onClick={() => handleNumber('6')} className="calculator-btn">6</button>

        <button onClick={() => handleNumber('1')} className="calculator-btn">1</button>
        <button onClick={() => handleNumber('2')} className="calculator-btn">2</button>
        <button onClick={() => handleNumber('3')} className="calculator-btn">3</button>

        <button onClick={() => handleNumber('0')} className="calculator-btn calculator-btn-zero">0</button>
        <button onClick={() => handleNumber('.')} className="calculator-btn">.</button>
        <button onClick={handleEquals} className="calculator-btn calculator-btn-equals">=</button>
      </div>
    </div>
  )
}
