module.exports = {
  // ⼀⾏代码的最⼤字符数，默认是80(printWidth: <int>)
  printWidth: 120,
  // tab宽度为2空格(tabWidth: <int>)
  tabWidth: 2,
  // 是否使⽤tab来缩进，我们使⽤空格(useTabs: <bool>)
  useTabs: false,
  // 结尾是否添加分号，false的情况下只会在⼀些导致ASI错误的其⼯况下在开头加分号(semi: <bool>)
  semi: false,
  // 使⽤单引号(singleQuote: <bool>)
  singleQuote: true,
  // object对象中key值是否加引号（quoteProps: "<as-needed|consistent|preserve>"）as-needed只有在需求要的情况下加引号，consistent是有⼀个需要引号就统⼀加，prese
  quoteProps: 'as-needed',
  // 在jsx⽂件中的引号需要单独设置（jsxSingleQuote: <bool>）
  jsxSingleQuote: false,
  // 尾部逗号设置，es5是尾部逗号兼容es5，none就是没有尾部逗号，all是指所有可能的情况，需要node8和es2017以上的环境。（trailingComma: "<es5|none|all>"）
  trailingComma: 'es5',
  // object对象⾥⾯的key和value值和括号间的空格(bracketSpacing: <bool>)
  bracketSpacing: true,
  // 多行的HTML或JSX标签，是否把 > 放在最后一行的结尾，而不是另起一行
  bracketSameLine: false,
  // jsx标签多⾏属性写法时，尖括号是否另起⼀⾏(jsxBracketSameLine: <bool>)
  jsxBracketSameLine: false,
  // 箭头函数单个参数的情况是否省略括号，默认always是总是带括号（arrowParens: "<always|avoid>"）
  arrowParens: 'always',
  // endOfLine: "<lf|crlf|cr|auto>" ⾏尾换⾏符,默认是lf,
  endOfLine: 'lf',
  // embeddedLanguageFormatting: "off",默认是auto,控制被引号包裹的代码是否进⾏格式化
  embeddedLanguageFormatting: 'off',
  proseWrap: 'always',
};
