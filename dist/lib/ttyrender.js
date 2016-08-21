'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Expose {@link module:lib/solidrender~SolidRender|SolidRender} marked terminal
 * renderer.
 * @module lib/ttyrender
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since  0.3.0
 * @version 0.1.0
 * 
 * @requires {@link https://github.com/chalk/chalk|chalk}
 * @requires {@link https://github.com/thlorenz/cardinal|cardinal}
 * @requires {@link https://github.com/Automattic/cli-table|cli-table}
 * @requires {@link module:lib/solidtext~SolidText|SolidText}
 */

var colors = require('chalk');
var Table = require('cli-table');
var cardinal = require('cardinal');
var SolidText = require('./solidtext');
var wordwrap = SolidText.wordwrap;
var escapeRegExp = SolidText.escapeRegExp;
var emojis = SolidText.emojis;

var TABLE_CELL_SPLIT = '^*||*^';
var TABLE_ROW_WRAP = '*|*|*|*';
var TABLE_ROW_WRAP_REGEXP = new RegExp(escapeRegExp(TABLE_ROW_WRAP), 'g');

var COLON_REPLACER = '*#COLON|*';
var COLON_REPLACER_REGEXP = new RegExp(escapeRegExp(COLON_REPLACER), 'g');

var HARD_RETURN = '\r';

/**
 * @class
 * Render {@link https://github.com/chjj/marked|marked}
 */

var TTYRender = function () {
  function TTYRender(props) {
    _classCallCheck(this, TTYRender);

    this.setProps(props);
    this.emojis = emojis;
    this.transform = this.compose(this.undoColon.bind(this), this.unescapeEntities.bind(this), this.emojis.bind(this));
  }

  _createClass(TTYRender, [{
    key: 'defaultProps',
    value: function defaultProps() {
      return {
        tables: true,
        columns: 80,
        emojis: true,
        wordwrap: true,
        highlightOptions: {},
        blockquote: colors.gray.italic,
        code: colors.yellow,
        codespan: colors.yellow,
        del: colors.dim.gray.strikethrough,
        em: colors.italic,
        firstHeading: colors.blue.bold,
        gfm: true,
        heading: colors.green,
        hr: colors.reset,
        href: colors.blue.underline,
        html: colors.gray,
        link: colors.blue,
        listitem: colors.reset,
        paragraph: colors.reset,
        strong: colors.bold,
        table: colors.reset,
        text: colors.white
      };
    }
    /**
     * Set TTYRender properties
     * @param {module:lib/ttyrender~TTYRenderProps} props TTYRender properties
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'setProps',
    value: function setProps(props) {
      this.props = Object.assign(this.props || this.defaultProps(), props);
    }

    /**
     * Indent body, colorize text via props and add line spacing to begin and end
     * of the line.
     *
     * @see {@link module:lib/renderer~PrettyRendererProps}
     * @param  {string} quote Blockquote text
     * @return {string}       line spaced, indented and colorized blockquote
     *
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'blockquote',
    value: function blockquote(quote) {
      return '\n' + this.props.blockquote(this.indentify(quote.trim())) + '\n';
    }

    /**
     * Render a break with a hard-return (`/r`) when wordwrap options is active,
     * otherwise fallsback to a standard carriage return (`\n`).
     * @return {string}   Hard or standard return (`\r` OR `\n`)
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
     * @see {@link module:lib/renderer~PrettyRendererProps}
     * @param  {string} code Raw codeblock's code
     * @param  {string} lang Language syntax code
     * @return {string}      Line spaced, indented, hilighted codeblock
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
        var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
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
      }, this.tableSettings));

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
      return wordwrapped ? text.replace(HARD_RETURN, /\n/g) : text;
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
        if (!line) {
          return '\n' + acc;
        }
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
        if (!line) {
          return '\n' + acc;
        }
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
      if (!colors.enabled) {
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

        data.push(parsed.splice(0, parsed.length - 1));
      });

      return data;
    }
    /**
     * Restore a replaced colon
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
     * Unascape HTML entities
     * @param  {string} html HTML markup text
     * @return {string}      HTML markup with unescaped entities.
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'unescapeEntities',
    value: function unescapeEntities(html) {
      return html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); // eslint-disable-line
    }
    /**
     * Create a functions that when invoked, pass all its arguments to the given
     * compose's function arguments.
     * @return {Function} Composed function
     * @version 0.1.1
     * @since 0.1.0
     */

  }, {
    key: 'compose',
    value: function compose() {
      var _this = this;

      for (var _len = arguments.length, theArgs = Array(_len), _key = 0; _key < _len; _key++) {
        theArgs[_key] = arguments[_key];
      }

      var funcs = theArgs;
      return function () {
        for (var _len2 = arguments.length, theArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          theArgs[_key2] = arguments[_key2];
        }

        var args = theArgs;
        for (var i = funcs.length; i-- > 0;) {
          args = [funcs[i].apply(_this, args)];
        }
        return args[0];
      };
    }
  }]);

  return TTYRender;
}();

module.exports = TTYRender;