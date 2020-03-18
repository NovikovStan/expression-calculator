function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  // remove all spaces
  expr = expr.replace(/\s+/g, "");

  // split string to array
  let exprArray = [];
  let previousSymbolIsNumber = /[0-9]/.test(expr[0]);
  let previousSymbol = expr[0];
  exprArray.push(previousSymbol);

  for (let i = 1; i < expr.length; i++) {
    if (/[0-9]/.test(expr[i]) && previousSymbolIsNumber) {
      let prev = exprArray.pop();
      exprArray.push(prev + expr[i]);
      previousSymbolIsNumber = true;
      previousSymbol = prev + expr[i];
    } else if (!/[0-9]/.test(expr[i])) {
      exprArray.push(expr[i]);
      previousSymbol = expr[i];
      previousSymbolIsNumber = false;
    } else if (/[0-9]/.test(expr[i]) && !previousSymbolIsNumber) {
      exprArray.push(expr[i]);
      previousSymbol = expr[i];
      previousSymbolIsNumber = true;
    }
  }

  checkPairedBrackets(exprArray);

  // cover expression in brackets so result is a number
  exprArray.push(")");
  exprArray.unshift("(");

  // stacks
  let operandStack = [];
  let operatorStack = [];

  // operand table
  let operators = {
    "(": {
      sigil: "(",
      priority: 0
    },
    ")": {
      sigil: ")",
      priority: 1
    },
    "+": {
      sigil: "+",
      priority: 2,
      result: (a, b) => a + b
    },
    "-": {
      sigil: "-",
      priority: 2,
      result: (a, b) => b - a
    },
    "*": {
      sigil: "*",
      priority: 3,
      result: (a, b) => a * b
    },
    "/": {
      sigil: "/",
      priority: 3,
      result: (a, b) => {
        if (a == 0) throw new TypeError("TypeError: Division by zero.");
        else return b / a;
      }
    }
  };

  exprArray.forEach(element => {
    // serve numbers
    if (!isNaN(+element)) {
      // if number has "-" before it then make it negative
      if(operatorStack[operatorStack.length - 1] == '-') {
        operatorStack.pop();
        operatorStack.push("+");
        operandStack.push(0 - +element);
      } else operandStack.push(+element);
    } else {
      // start to fill operatorStack
      if (operatorStack.length == 0) {
        operatorStack.push(element);
      } else if (element == "(") {
        operatorStack.push(element);
      } else if (element == ")") {
        // find ")" and solve all operations back to previous "("
        while (
          operators[operatorStack[operatorStack.length - 1]].priority != 0
        ) {
          operandStack.push(
            operators[operatorStack[operatorStack.length - 1]].result(
              operandStack.pop(),
              operandStack.pop()
            )
          );
          operatorStack.pop();
        }
        operatorStack.pop();
        // if "-" before "(" then change "-" to "+", but make operand negative
        if (operatorStack[operatorStack.length - 1] == '-') {
          operandStack.push(0 - operandStack.pop());
          operatorStack.pop();
          operatorStack.push("+");
        } 
      } else if (
        operators[element].priority >
        operators[operatorStack[operatorStack.length - 1]].priority
      ) {
        operatorStack.push(element);
      } else {
        operandStack.push(
          operators[operatorStack[operatorStack.length - 1]].result(
            operandStack.pop(),
            operandStack.pop()
          )
        );
        operatorStack.pop();
        operatorStack.push(element);
      }
    }
  });
  return operandStack[0];
  // write your solution here
}

function checkPairedBrackets(arr) {
  let counter = 0;
  arr.forEach(el => {
    if (el == "(") {
      counter++;
    } else if (el == ")") {
      counter--;
      if (counter < 0)
        throw new Error("ExpressionError: Brackets must be paired");
    }
  });
  if (counter != 0) throw new Error("ExpressionError: Brackets must be paired");
}

module.exports = {
  expressionCalculator
};
