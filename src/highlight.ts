import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'

hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)

export default hljs
