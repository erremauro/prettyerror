<a name="module_solid-error"></a>

## solid-error
SolidError is a module that help you print meaningful, in-depth errors to
the terminal to help your users resolve the issue.

**Version**: 0.3.1  
**Author:** Roberto Mauro <erremauro@icloud.com>  
**License**: MIT  

#### Tables of Contents

* [solid-error](#module_solid-error)
    * _static_
        * [.SolidError](#module_solid-error.SolidError)
            * [new SolidError([message], [props])](#new_module_solid-error.SolidError_new)
        * [.options](#module_solid-error.options) : <code>[SolidErrorOptions](#module_solid-error..SolidErrorOptions)</code>
        * [.SolidText](#module_solid-error.SolidText)
            * [.color](#module_solid-error.SolidText.color) : <code>[chalk](https://github.com/chalk/chalk)</code>
            * [.wordwrap(text, width, gfm)](#module_solid-error.SolidText.wordwrap) ⇒ <code>string</code>
            * [.textLength(text)](#module_solid-error.SolidText.textLength) ⇒ <code>number</code>
            * [.truncate(text, maxlen)](#module_solid-error.SolidText.truncate) ⇒ <code>string</code>
            * [.capitalizeFirstLetter(text)](#module_solid-error.SolidText.capitalizeFirstLetter) ⇒ <code>string</code>
            * [.stripErrorCodes(errorMessage)](#module_solid-error.SolidText.stripErrorCodes) ⇒ <code>string</code>
            * [.escapeRegExp(text)](#module_solid-error.SolidText.escapeRegExp) ⇒ <code>string</code>
            * [.emojis(text)](#module_solid-error.SolidText.emojis) ⇒ <code>string</code>
            * [.findEmojiFrom(emojiString)](#module_solid-error.SolidText.findEmojiFrom) ⇒ <code>string</code>
            * [.markdown2tty(text)](#module_solid-error.SolidText.markdown2tty) ⇒ <code>string</code>
            * [.setMarkedOptions(props)](#module_solid-error.SolidText.setMarkedOptions) ⇒ <code>Object</code>
        * [.logError(error)](#module_solid-error.logError) ⇒ <code>undefined</code>
        * [.render(solidError)](#module_solid-error.render) ⇒ <code>string</code>
        * [.setOptions(props)](#module_solid-error.setOptions) ⇒ <code>SolidErrorOptions</code>
    * _inner_
        * [~SolidRenderer](#module_solid-error..SolidRenderer) : <code>Object</code>
            * [.header(readableName)](#module_solid-error..SolidRenderer.header) ⇒ <code>string</code>
            * [.message(text)](#module_solid-error..SolidRenderer.message) ⇒ <code>string</code>
            * [.explain(text)](#module_solid-error..SolidRenderer.explain) ⇒ <code>string</code>
            * [.hints(text)](#module_solid-error..SolidRenderer.hints) ⇒ <code>string</code>
            * [.trace(stack, callSite)](#module_solid-error..SolidRenderer.trace) ⇒ <code>string</code>
            * [.footer(errorCode, errorPath)](#module_solid-error..SolidRenderer.footer) ⇒ <code>string</code>
        * [~SolidErrorProps](#module_solid-error..SolidErrorProps)
        * [~SolidErrorOptions](#module_solid-error..SolidErrorOptions)

<a name="module_solid-error.SolidError"></a>

### solid-error.SolidError
SolidError is an Error object with properties to write a more verbose
error explanation and hints to help the user understand and resolve
the facing issue.

**Kind**: static class of <code>[solid-error](#module_solid-error)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The error name |
| code | <code>string</code> | The error code |
| errno | <code>number</code> | The error number |
| readableName | <code>string</code> | A readable version of the error name. |
| message | <code>string</code> | The error message |
| explain | <code>string</code> | An error explanation |
| hint | <code>string</code> | A series of hint to help user resolve the issue |
| path | <code>string</code> | Referenced path |
| stack | <code>string</code> | The error stack trace. |

<a name="new_module_solid-error.SolidError_new"></a>

#### new SolidError([message], [props])
Extends Error with provided `message` and `props`


| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>string</code> &#124; <code>Error</code> | An error message or an Error object |
| [props] | <code>[SolidErrorProps](#module_solid-error..SolidErrorProps)</code> | SolidError properties |

<a name="module_solid-error.options"></a>

### solid-error.options : <code>[SolidErrorOptions](#module_solid-error..SolidErrorOptions)</code>
solid-error options

**Kind**: static constant of <code>[solid-error](#module_solid-error)</code>  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| renderer | <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code> | <code>SolidRender</code> | 
| lang | <code>string</code> | <code>&quot;en&quot;</code> | 
| includes | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 

<a name="module_solid-error.SolidText"></a>

### solid-error.SolidText
Utility library to format an manipulate text.

**Kind**: static constant of <code>[solid-error](#module_solid-error)</code>  
**Since**: 0.3.0  
**Version**: 0.1.1  

* [.SolidText](#module_solid-error.SolidText)
    * [.color](#module_solid-error.SolidText.color) : <code>[chalk](https://github.com/chalk/chalk)</code>
    * [.wordwrap(text, width, gfm)](#module_solid-error.SolidText.wordwrap) ⇒ <code>string</code>
    * [.textLength(text)](#module_solid-error.SolidText.textLength) ⇒ <code>number</code>
    * [.truncate(text, maxlen)](#module_solid-error.SolidText.truncate) ⇒ <code>string</code>
    * [.capitalizeFirstLetter(text)](#module_solid-error.SolidText.capitalizeFirstLetter) ⇒ <code>string</code>
    * [.stripErrorCodes(errorMessage)](#module_solid-error.SolidText.stripErrorCodes) ⇒ <code>string</code>
    * [.escapeRegExp(text)](#module_solid-error.SolidText.escapeRegExp) ⇒ <code>string</code>
    * [.emojis(text)](#module_solid-error.SolidText.emojis) ⇒ <code>string</code>
    * [.findEmojiFrom(emojiString)](#module_solid-error.SolidText.findEmojiFrom) ⇒ <code>string</code>
    * [.markdown2tty(text)](#module_solid-error.SolidText.markdown2tty) ⇒ <code>string</code>
    * [.setMarkedOptions(props)](#module_solid-error.SolidText.setMarkedOptions) ⇒ <code>Object</code>

<a name="module_solid-error.SolidText.color"></a>

#### SolidText.color : <code>[chalk](https://github.com/chalk/chalk)</code>
Colorize text for terminal output using
[chalk](https://github.com/chalk/chalk)

**Kind**: static property of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Since**: 0.1.1  
**Version**: 0.1.0  
<a name="module_solid-error.SolidText.wordwrap"></a>

#### SolidText.wordwrap(text, width, gfm) ⇒ <code>string</code>
Wordwrap `text` at max `width` with support for GitHub flavored markdown

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - Wordwrapped text  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text to wordwrap |
| width | <code>string</code> | Columns width |
| gfm | <code>boolean</code> | Support GitHub flavored markdown |

<a name="module_solid-error.SolidText.textLength"></a>

#### SolidText.textLength(text) ⇒ <code>number</code>
Calculate the `text`'s length, escaping terminal entities.

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>number</code> - Text only length  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text to calculate for length |

<a name="module_solid-error.SolidText.truncate"></a>

#### SolidText.truncate(text, maxlen) ⇒ <code>string</code>
Truncate the give `string` to `maxlen` and add ellipsis at th end.

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - Truncated text  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | String to be truncated |
| maxlen | <code>number</code> | Truncate at length |

<a name="module_solid-error.SolidText.capitalizeFirstLetter"></a>

#### SolidText.capitalizeFirstLetter(text) ⇒ <code>string</code>
Capitalize the first letter of the given `text`

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - Text with first letter capitalized  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text where the first letter should be capitalized |

<a name="module_solid-error.SolidText.stripErrorCodes"></a>

#### SolidText.stripErrorCodes(errorMessage) ⇒ <code>string</code>
Strip syserrors Error prefix text

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - Syserror message without prefix text.  
**Since**: 0.1.1  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| errorMessage | <code>string</code> | An syserror message |

<a name="module_solid-error.SolidText.escapeRegExp"></a>

#### SolidText.escapeRegExp(text) ⇒ <code>string</code>
Escape RegExp from the give `text`

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - Escaped RegExp  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Regular expression text |

<a name="module_solid-error.SolidText.emojis"></a>

#### SolidText.emojis(text) ⇒ <code>string</code>
Render emoji from emoji tag (i.e. :heart: ) found in given `text`.

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - Text with rendered emoji tags  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text with emojis. |

<a name="module_solid-error.SolidText.findEmojiFrom"></a>

#### SolidText.findEmojiFrom(emojiString) ⇒ <code>string</code>
Return the corresponding unicode emoji from a give ejomi code.

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - Unicode emoji string  

| Param | Type | Description |
| --- | --- | --- |
| emojiString | <code>string</code> | Emoji code (example: ":heart:") |

<a name="module_solid-error.SolidText.markdown2tty"></a>

#### SolidText.markdown2tty(text) ⇒ <code>string</code>
Render markdown syntax to terminal syntax

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>string</code> - terminal rendered text  
**Since**: 0.1.2  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | markdown formatted text. |

<a name="module_solid-error.SolidText.setMarkedOptions"></a>

#### SolidText.setMarkedOptions(props) ⇒ <code>Object</code>
Set marked options.

**Kind**: static method of <code>[SolidText](#module_solid-error.SolidText)</code>  
**Returns**: <code>Object</code> - marked option object  
**Since**: 0.1.2  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> | Marked options object. |

<a name="module_solid-error.logError"></a>

### solid-error.logError(error) ⇒ <code>undefined</code>
Log an error to the console. If the provided error is a
[SolidError](#module_solid-error.SolidError)
it will be renderer using the current solid-error's
[renderer](module:solid-error.options.renderer)

**Kind**: static method of <code>[solid-error](#module_solid-error)</code>  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>[Error](https://nodejs.org/api/errors.html#errors_class_error)</code> &#124; <code>module:solid-error~SolidError</code> | Any Error type object |

<a name="module_solid-error.render"></a>

### solid-error.render(solidError) ⇒ <code>string</code>
Render a [SolidError](#module_solid-error.SolidError)

**Kind**: static method of <code>[solid-error](#module_solid-error)</code>  
**Returns**: <code>string</code> - Renderer SolidError  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| solidError | <code>[SolidError](#module_solid-error.SolidError)</code> | A SolidError object |

<a name="module_solid-error.setOptions"></a>

### solid-error.setOptions(props) ⇒ <code>SolidErrorOptions</code>
Update solid-error's options.

**Kind**: static method of <code>[solid-error](#module_solid-error)</code>  
**Returns**: <code>SolidErrorOptions</code> - Updated options  
**Since**: 0.1.0  
**Version**: 0.1.0  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>SolidErrorOptions</code> | solid-error's options |

<a name="module_solid-error..SolidRenderer"></a>

### solid-error~SolidRenderer : <code>Object</code>
A renderer for handling [SolidError](module:solid-error~SolidError)
rendering process.

**Kind**: inner typedef of <code>[solid-error](#module_solid-error)</code>  

* [~SolidRenderer](#module_solid-error..SolidRenderer) : <code>Object</code>
    * [.header(readableName)](#module_solid-error..SolidRenderer.header) ⇒ <code>string</code>
    * [.message(text)](#module_solid-error..SolidRenderer.message) ⇒ <code>string</code>
    * [.explain(text)](#module_solid-error..SolidRenderer.explain) ⇒ <code>string</code>
    * [.hints(text)](#module_solid-error..SolidRenderer.hints) ⇒ <code>string</code>
    * [.trace(stack, callSite)](#module_solid-error..SolidRenderer.trace) ⇒ <code>string</code>
    * [.footer(errorCode, errorPath)](#module_solid-error..SolidRenderer.footer) ⇒ <code>string</code>

<a name="module_solid-error..SolidRenderer.header"></a>

#### SolidRenderer.header(readableName) ⇒ <code>string</code>
Render the error header

**Kind**: static method of <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code>  
**Returns**: <code>string</code> - Rendered header string  

| Param | Type | Description |
| --- | --- | --- |
| readableName | <code>string</code> | Error readable name |

<a name="module_solid-error..SolidRenderer.message"></a>

#### SolidRenderer.message(text) ⇒ <code>string</code>
Render the error message

**Kind**: static method of <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code>  
**Returns**: <code>string</code> - Rendered error string  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Error message |

<a name="module_solid-error..SolidRenderer.explain"></a>

#### SolidRenderer.explain(text) ⇒ <code>string</code>
Render the error explanation

**Kind**: static method of <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code>  
**Returns**: <code>string</code> - Rendered explain string  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The error explain message |

<a name="module_solid-error..SolidRenderer.hints"></a>

#### SolidRenderer.hints(text) ⇒ <code>string</code>
Render some error hints

**Kind**: static method of <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code>  
**Returns**: <code>string</code> - Rendered hints string  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The error hints |

<a name="module_solid-error..SolidRenderer.trace"></a>

#### SolidRenderer.trace(stack, callSite) ⇒ <code>string</code>
Render the stack trace

**Kind**: static method of <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code>  
**Returns**: <code>string</code> - Rendered stack trace string  

| Param | Type | Description |
| --- | --- | --- |
| stack | <code>string</code> | The stack trace |
| callSite | <code>Array.&lt;CallSite&gt;</code> | Stack frame collection |

<a name="module_solid-error..SolidRenderer.footer"></a>

#### SolidRenderer.footer(errorCode, errorPath) ⇒ <code>string</code>
Render the error footer

**Kind**: static method of <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code>  
**Returns**: <code>string</code> - Rendered footer string  

| Param | Type | Description |
| --- | --- | --- |
| errorCode | <code>string</code> | The error code |
| errorPath | <code>string</code> | The error path |

<a name="module_solid-error..SolidErrorProps"></a>

### solid-error~SolidErrorProps
SolidError object property.

**Kind**: inner typedef of <code>[solid-error](#module_solid-error)</code>  
**Since**: 0.3.0  
**Version**: 0.1.0  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| code | <code>string</code> | <code>&quot;EERR&quot;</code> | An error code |
| errno | <code>number</code> |  | The error number |
| name | <code>string</code> | <code>&quot;Error&quot;</code> | The error name |
| message | <code>string</code> |  | The error message |
| readableName | <code>string</code> | <code>&quot;Error&quot;</code> | A readable version of the name |
| path | <code>string</code> |  | An optional reference path |
| explain | <code>string</code> |  | Optional error explanation |
| hints | <code>string</code> |  | Optional hints that help solve the issue |
| inner | <code>Error</code> |  | A parent error |

<a name="module_solid-error..SolidErrorOptions"></a>

### solid-error~SolidErrorOptions
**Kind**: inner typedef of <code>[solid-error](#module_solid-error)</code>  
**Since**: 0.1.0  
**Version**: 0.1.0  
**Properties**

| Name | Type |
| --- | --- |
| renderer | <code>[SolidRenderer](#module_solid-error..SolidRenderer)</code> | 
| lang | <code>string</code> | 
| includes | <code>Array.&lt;string&gt;</code> | 

