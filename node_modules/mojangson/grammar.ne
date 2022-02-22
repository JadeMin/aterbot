@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

MAIN -> _ JVALUE _ {% (d) => d[1] %}

JVALUE -> JOBJECT {% (d) => d[0] %}
        | "'" _ JOBJECT _ "'" {% (d) => d[2] %}
        | JARRAY  {% (d) => d[0] %}
        | STRING  {% (d) => d[0] %}
        | "null"  {% (d) => null %}

JOBJECT -> "{" _ "}" {% (d) => { return { type: 'compound', value: {} } } %}
         | "{" _ PAIR ( _ "," _ PAIR):* (_ ","):? "}" {% extractObject %}

JARRAY -> "[" _ "]" {% (d) => { return { type: 'list', value: {} } } %}
        | "[" _ [BIL] _ ";" _ JVALUE ( _ "," _ JVALUE):* (_ ","):? _ "]" {% extractTypedArray %}
        | "[" _ JVALUE ( _ "," _ JVALUE):* (_ ","):? _ "]" {% extractArray %}
        | "[" _ PAIR ( _ "," _ PAIR):* (_ ","):? _ "]" {% extractArrayPair %}

PAIR -> STRING _ ":" _ JVALUE {% (d) => [d[0].value, d[4]] %}

STRING -> "\"" ( [^\\"] | "\\" ["bfnrt\/\\] | "\\u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] ):* "\"" {% (d) => parseValue( JSON.parse(d.flat(3).join('')) ) %}
        | [^\"\'}\]:;,\s]:+ {% (d) => parseValue(d[0].join('')) %} 

@{%

// Because of unquoted strings, parsing can be ambiguous.
// It is more efficient to have the parser extract string
// and post-process it to retrieve numbers
function parseValue (str) {
  if (str === 'true') return { type: 'boolean', value: true }
  if (str === 'false') return { type: 'boolean', value: false }
  const suffixes = "bslfdi"
  const suffixToType = { 'b': 'byte', 's': 'short', 'l': 'long', 'f': 'float', 'd': 'double', 'i': 'int' }
  const lastC = str.charAt(str.length - 1).toLowerCase()
  if (suffixes.indexOf(lastC) !== -1) {
    const v = parseFloat(str.substring(0, str.length - 1))
    if (!isNaN(v)) return { value: v, type: suffixToType[lastC]}
    return { value: str, type: 'string' }
  }
  // When no letter is used and Minecraft can't tell the type from context,
  // it assumes double if there's a decimal point, int if there's no decimal
  // point and the size fits within 32 bits, or string if neither is true.
  // https://minecraft.gamepedia.com/Commands#Data_tags
  const v = parseFloat(str)
  const decimal = str.includes('.')
  const isInt32 = (v >> 0) === v
  if (!isNaN(str) && (decimal || isInt32)) return { value: v, type: decimal ? 'double' : 'int'}
  return { value: str, type: 'string' }
}

function extractPair(kv, output) {
  if (kv[0] !== undefined) {
    output[kv[0]] = kv[1]
  }
}

function extractObject(d) {
  let output = {}
  extractPair(d[2], output)
  for (let i in d[3]) {
    extractPair(d[3][i][3], output)
  }
  return { type: 'compound', value: output }
}

function extractTypedArray (d) {
  let output = [d[6]]
  for (let i in d[7]) {
    output.push(d[7][i][3])
  }
  const type = {'B': 'byteArray', 'I': 'intArray', 'L': 'longArray'}[d[2]]
  return { type, value: { type: output[0].type, value: output.map(x => x.value) } }
}

function extractArray (d) {
  let output = [d[2]]
  for (let i in d[3]) {
    output.push(d[3][i][3])
  }
  return { type: 'list', value: { type: output[0].type, value: output.map(x => x.value) } }
}

function extractArrayPair (d) {
  let output = []
  extractPair(d[2], output)
  for (let i in d[3]) {
    extractPair(d[3][i][3], output)
  }
  return { type: 'list', value: { type: output[0].type, value: output.map(x => x.value) } }
}

%}
