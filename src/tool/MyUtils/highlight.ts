import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('javascript', javascript)

export default hljs
