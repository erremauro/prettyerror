'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = require('cli-table');
var cardinal = require('cardinal');
var SolidObject = require('./SolidObject');
var SolidText = require('../lib/SolidText');
var wordwrap = SolidText.wordwrap;
var escapeRegExp = SolidText.escapeRegExp;
var emojis = SolidText.emojis;

/**
 * Default TTYRender properties
 * @const {TTYRenderProps}
 * @default
 */
var defaultProps = {
  tables: true,
  columns: 80,
  emojis: true,
  wordwrap: true,
  highlightOptions: {},
  tableSettings: {},
  blockquote: SolidText.color.gray.italic,
  code: SolidText.color.yellow,
  codespan: SolidText.color.yellow,
  del: SolidText.color.dim.gray.strikethrough,
  em: SolidText.color.italic,
  firstHeading: SolidText.color.blue.bold,
  gfm: true,
  heading: SolidText.color.green,
  hr: SolidText.color.reset,
  href: SolidText.color.blue.underline,
  html: SolidText.color.gray,
  link: SolidText.color.blue,
  listitem: SolidText.color.reset,
  paragraph: SolidText.color.reset,
  strong: SolidText.color.bold,
  table: SolidText.color.reset,
  text: SolidText.color.white
};

var HARD_RETURN = '\r';
var COLON_REPLACER = '*#COLON|*';
var TABLE_CELL_SPLIT = '^*||*^';
var TABLE_ROW_WRAP = '*|*|*|*';
var TABLE_ROW_WRAP_REGEXP = new RegExp(escapeRegExp(TABLE_ROW_WRAP), 'g');
var COLON_REPLACER_REGEXP = new RegExp(escapeRegExp(COLON_REPLACER), 'g');

/**
 * @class
 * @classdesc Render marked output in the terminal.
 *
 * @property {any} emojis Emojis object
 * @property {Function} transform Transform text function
 * @property {TTYRenderProps} props TTYRender properties
 *
 * @requires cardinal
 * @requires cli-table
 * @requires SolidText
 *
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since  0.3.0
 * @version 0.1.2
 */

var TTYRender = function (_SolidObject) {
  _inherits(TTYRender, _SolidObject);

  /**
   * Initialized render
   * @param  {?TTYRenderProps}  props TTYRender properties
   */
  function TTYRender(props) {
    _classCallCheck(this, TTYRender);

    var _this = _possibleConstructorReturn(this, (TTYRender.__proto__ || Object.getPrototypeOf(TTYRender)).call(this, props, defaultProps));

    _this.emojis = emojis;
    _this.transform = _this.compose(_this.undoColon.bind(_this), _this.unescapeEntities.bind(_this), _this.emojis.bind(_this));
    return _this;
  }

  /**
   * Indent body, colorize text via props and add line spacing to begin and end
   * of the line.
   *
   * @see {@link module:lib/renderer~PrettyRendererProps}
   * @param  {string} quote Blockquote text
   * @return {string}       Line spaced, indented and colorized blockquote
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  _createClass(TTYRender, [{
    key: 'blockquote',
    value: function blockquote(quote) {
      return '\n' + this.props.blockquote(this.indentify(quote.trim())) + '\n';
    }

    /**
     * Render a break with a hard-return (`/r`) when wordwrap options is active,
     * otherwise fallsback to a standard carriage return (`\n`).
     *
     * @return {string}   Hard or standard return (`\r` OR `\n`)
     *
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'br',
    value: function br() {
      return this.props.wordwrap ? HARD_RETURN : '\n';
    }

    /**
     * Indent and colorize codeblock via props style. If javascript syntax is
     * detected via GitHub Flavored Markdown (gfm) backtick syntax, the code
     * will be highlighted accordingly. Codeblock is line spaced at the beginning
     * and the end of the block.
     * @param  {string} code Raw codeblock's code
     * @param  {string} lang Language syntax code
     * @return {string}      Line spaced, indented, hilighted codeblock
     *
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'code',
    value: function code(_code, lang) {
      return '\n' + this.indentify(this.highlight(_code, lang, this.props, this.props.highlightOptions)) + '\n';
    }

    /**
     * Colorize inline code span via props style.
     * @param  {string} text Inline raw code
     * @return {string}      Colorized inline code
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'codespan',
    value: function codespan(text) {
      text = this.fixHardReturn(text, this.props.wordwrap);
      return this.props.codespan(text.replace(/:/g, COLON_REPLACER));
    }

    /**
     * Colorize striketrough text via props style
     * @see {@link module:lib/renderer~PrettyRendererProps}
     * @param  {string} text Striketrough raw text
     * @return {string}      Striketrough styled text
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'del',
    value: function del(text) {
      return this.props.del(text);
    }

    /**
     * Render text to italic via props style
     * @see {@link module:lib/renderer~PrettyRendererProps}
     * @param  {string} text Text to convert to italic
     * @return {string}      Italic text via props style
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'em',
    value: function em(text) {
      text = this.fixHardReturn(text, this.props.wordwrap);
      return this.props.em(text);
    }

    /**
     * Stylez markdown headings. The title heading can be styled differently
     * from the subsequent heading via props styles.
     * @param  {string} text  Heading text
     * @param  {string} level Heading level
     * @param  {string} raw   Heading raw text
     * @return {string}       Styled heading
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'heading',
    value: function heading(text, level) {
      text = this.transform(text);
      var prefix = new Array(level + 1).join('#') + ' ';
      text = prefix + text;

      if (this.props.wordwrap) {
        text = wordwrap(text, this.props.columns, this.props.gfm);
      }

      if (level === 1) {
        return '\n' + this.props.firstHeading(text) + '\n';
      }
      return '\n' + this.props.heading(text) + '\n';
    }
    /**
     * Stylize a markdown horizontal line
     * @return {string}      Styled markdown break
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'hr',
    value: function hr() {
      var length = this.props.columns;
      return '\n' + this.props.hr(new Array(length).join('-')) + '\n';
    }
    /**
     * Stylize html text via props style
     * @param  {string} text HTML text
     * @return {string}      HTML styled text
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'html',
    value: function html(text) {
      return this.props.html(text);
    }
    /**
     * Stylize a markdown image similarly to a link.
     * @see {@link modue:lib/render~SolidError#link}
     * @param  {string} href  Image URL
     * @param  {string} [title] Image title
     * @param  {string} [text]  Image alternate text
     * @return {string}         Styled markdown image syntax
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'image',
    value: function image(href, title, text) {
      var out = '![' + text;
      out += title ? ' – ' + title : '';
      return '\n' + this.props.link(out + '](' + href + ')') + '\n';
    }
    /**
     * Render a Markdown link.
     * @param  {string} href  Link URL
     * @param  {string} title Link title
     * @param  {string} text  Link text.
     * @return {string}       Styled link.
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'link',
    value: function link(href, title, text) {
      try {
        var prot = decodeURI(href).replace(/[^\w:]/g, '').toLowerCase();
        if (prot.indexOf('javascript:') === 0) {
          return '';
        }
      } catch (err) {
        return '';
      }

      var hasText = text && text !== href;
      var out = '';
      out += hasText ? this.emojis(text) + ' (' : '';
      out += this.props.href(href);
      out += hasText ? ')' : '';
      return this.props.link(out);
    }
    /**
     * Render a markdown list.
     * @param  {string} body    List body
     * @param  {boolean} ordered Defines if it's a ordered list.
     * @return {string}         Styled markdown list.
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'list',
    value: function list(body, ordered) {
      body = this.indentLines(this.props.listitem(body));
      if (!ordered) {
        return this.formatUnordered(body);
      }
      return this.changeToOrdered(body);
    }
    /**
     * Rendere a single list item.
     * @see module:lib/renderer~PrettyRenderer#list
     * @param  {string} text Single item list text.
     * @return {string}      Rendered item list.
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'listitem',
    value: function listitem(text) {
      var isNested = ~text.indexOf('\n');
      if (isNested) {
        text = text.trim();
      }
      return '\n * ' + this.transform(text);
    }
    /**
     * Stylize a markdown paragraph.
     * @param  {string} text Paragraph text
     * @return {string}      Styled paragraph
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'paragraph',
    value: function paragraph(text) {
      text = this.transform(text);
      text = wordwrap(text, this.props.columns, this.props.gfm);
      return '\n' + text + '\n';
    }
    /**
     * Render markdown strong text format via props styles.
     * @see {@link module:lib/renderer~SolidErrorProps}
     * @param  {string} text Markdown strong text
     * @return {string}      Styled strong text via props styles.
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'strong',
    value: function strong(text) {
      return this.props.strong(text);
    }
    /**
     * Render a markdown table
     * @param  {string} header Table header
     * @param  {string} body   Table body
     * @return {string}        Style table for the terminal
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'table',
    value: function table(header, body) {
      var table = new Table(Object.assign({}, {
        head: this.createTableRow(header)[0]
      }, this.props.tableSettings));

      this.createTableRow(body, this.transform).forEach(function (row) {
        table.push(row);
      });
      return '\n' + this.props.table(table.toString()) + '\n';
    }
    /**
     * Render a table row
     * @param  {string} content Row content
     * @return {string}         Rendered Table row
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'tablerow',
    value: function tablerow(content) {
      return TABLE_ROW_WRAP + content + TABLE_ROW_WRAP + '\n';
    }
    /**
     * Render a single markdown table cell
     * @see {@link module:lib/renderer~SolidError#table}
     * @param  {string} content Cell content
     * @param  {string} flags   Cell flags
     * @return {string}         Rendered cell
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'tablecell',
    value: function tablecell(content) {
      return content + TABLE_CELL_SPLIT;
    }
    /**
     * Render standard markdown text
     * @param  {string} text Markdown text to be rendered
     * @return {string}      Resulting styled text
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'text',
    value: function text(_text) {
      return _text;
    }
    /**
     * Fix terminal hardreturn
     * @param  {string} text        Text containing an hard return
     * @param  {boolena} wordwrapped Defines if the text is wordwrapped
     * @return {string}             A sanitized string
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'fixHardReturn',
    value: function fixHardReturn(text, wordwrapped) {
      if (wordwrapped) {
        return text.replace(HARD_RETURN, '/\n/g');
      }
      return text;
    }
    /**
     * Convert a markdown pre-rendered unordered list to an ordered one.
     * @see {@link module:lib/renderer~PretyError#list}
     * @see {@link module:lib/renderer~PretyError#listitem}
     * @param  {string} text Ordered list text
     * @return {string}      Converted markdown ordered list
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'changeToOrdered',
    value: function changeToOrdered(text) {
      var i = 1;
      return '\n' + text.split('\n').reduce(function (acc, line) {
        if (!line) return '\n' + acc;
        return acc + line.replace(/(\s*)\*/, '$1' + i++ + '.') + '\n';
      }).trim() + '\n'; // remove last carriage return
    }
    /**
     * Format a markdown unordered list.
     * @see {@link module:lib/renderer~PretyError#list}
     * @see {@link module:lib/renderer~PretyError#listitem}
     * @param  {string} text Markdown unordered list.
     * @return {string}      Rendered markdown unordered list
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'formatUnordered',
    value: function formatUnordered(text) {
      return '\n' + text.split('\n').reduce(function (acc, line) {
        if (!line) return '\n' + acc;
        return acc + line + '\n';
      }).trim() + '\n'; // remove last carriage return
    }
    /**
     * Format code highlighting for markdown codeblocks.
     * @see {@link module:lib/renderer~SolidError#code}
     * @see {@link module:lib/renderer~SolidError#codespan}
     * @param  {string} code           Code block
     * @param  {string} lang           Language code
     * @param  {string} opts           SolidError props
     * @param  {string} hightlightOpts Highlight specific options
     * @return {string}                Highlighted codeblock
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'highlight',
    value: function highlight(code, lang, opts) {
      if (!SolidText.color.enabled) {
        return code;
      }

      var style = opts.code;

      code = this.fixHardReturn(code, opts.wordwrap);
      if (lang !== 'javascript' && lang !== 'js') {
        return style(code);
      }

      try {
        return cardinal.highlight(code, this.props.hightlightOpts);
      } catch (err) {
        return style(code);
      }
    }
    /**
     * Return rendered tab spaced by give `size`
     * @param  {number} [size=4] Tab size in spaces
     * @return {string}          Tab spaces
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'tab',
    value: function tab(size) {
      size = size || 4;
      return new Array(size).join(' ');
    }
    /**
     * Indend a block of text.
     * @see {@link module:lib/renderer~SolidError#blockquote}
     * @see {@link module:lib/renderer~SolidError#code}
     * @param  {string} text Text to be indented
     * @return {string}      Indented text block
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'indentify',
    value: function indentify(text) {
      if (!text) {
        return text;
      }
      return this.tab() + text.split('\n').join('\n' + this.tab());
    }
    /**
     * Indent the given `text`.
     * @see {@link module:lib/renderer~SolidError#list}
     * @param  {string} text Text to be indented
     * @return {string}      Indented text
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'indentLines',
    value: function indentLines(text) {
      return text.replace(/\n/g, '\n' + this.tab()) + '\n\n';
    }

    /**
     * Split text into lines and convert it to a formatted table row text.
     * @memberOf TTYRender
     * @param  {string} text   Text to convert into a table row.
     * @param  {Function} escape Escape function
     * @return {string}          A table row from text.
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'createTableRow',
    value: function createTableRow(text, escape) {
      if (!text) {
        return [];
      }
      escape = escape || this.identity;
      var lines = escape(text).split('\n');

      var data = [];
      lines.forEach(function (line) {
        if (!line) return;
        var parsed = line.replace(TABLE_ROW_WRAP_REGEXP, '').split(TABLE_CELL_SPLIT);
        var parsedText = parsed.slice(0, parsed.length - 1);

        data.push(parsedText);
      });

      return data;
    }

    /**
     * Restore a replaced colon
     * @memberOf TTYRender
     * @param  {string} str String with replaced colon
     * @return {string}     String with restored colon
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'undoColon',
    value: function undoColon(str) {
      return str.replace(COLON_REPLACER_REGEXP, ':');
    }

    /**
     * A helper function for standard text. It return what it gets.
     * @memberOf TTYRender
     * @param  {string} str Text
     * @return {string}     Text
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'identity',
    value: function identity(str) {
      return str;
    }

    /**
     * Create and return a function that pass its arguments
     * to every function argument provided to `compose`
     * @param {arguments} functions An array of function arguments
     * @return {Function} composed function
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'compose',
    value: function compose() {
      for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
        functions[_key] = arguments[_key];
      }

      return this.composeFunctions.bind(this, functions);
    }

    /**
     * Chain the results of every `funcs` called with `theArgs`. Provided `funcs`
     * are called in reverse order.
     * @param {Functions[]} funcs A collection of functions
     * @param {arguments} theArgs Arguments that will be passed to every `func`
     * @returns {Function} composed function
     * @since 0.3.1
     * @version 0.1.0
     */

  }, {
    key: 'composeFunctions',
    value: function composeFunctions(funcs) {
      for (var _len2 = arguments.length, theArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        theArgs[_key2 - 1] = arguments[_key2];
      }

      var args = theArgs;
      for (var i = funcs.length; i-- > 0;) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    }

    /**
     * Unascape HTML entities
     * @memberOf TTYRender
     * @param  {string} html HTML markup text
     * @return {string}      HTML markup with unescaped entities.
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'unescapeEntities',
    value: function unescapeEntities(html) {
      var sanitized = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return sanitized;
    }
  }]);

  return TTYRender;
}(SolidObject);

module.exports = TTYRender;