const {stripIndent} = require('common-tags');

module.exports = [[
  'works with primitive markdown',
  stripIndent`
    # Foo
    ## Bar
    ###### Baz

    _italic_ *italic*
    __bold__ **bold**
    \`code\`

    * item
    * item
      + nested

    ![image](/image.png)
    [Link](http://example.com)

    > quote
    > quote

    Reference test [foo]

    [foo]: http://example.com
  `,
  stripIndent`
    <h1>Foo</h1>
    <h2>Bar</h2>
    <h6>Baz</h6>
    <p>
      <em>italic</em> <em>italic</em>
      <strong>bold</strong> <strong>bold</strong>
      <code>code</code>
    </p>
    <ul>
      <li>item</li>
      <li>
        <p>item</p>
        <ul>
          <li>nested</li>
        </ul>
      </li>
    </ul>
    <p>
      <img src="/image.png" alt="image">
      <a href="http://example.com">Link</a>
    </p>
    <blockquote>
      <p>
        quote
        quote
      </p>
    </blockquote>
    <p>Reference test <a href=\"http://example.com\">foo</a></p>
  `,
], [
  'works with table',
  stripIndent`
    1 | 2 | 3
    :--|:-:|--:
    left | center | right
  `,
  stripIndent`
    <table>
      <thead>
        <tr>
          <th align="left">1</th>
          <th align="center">2</th>
          <th align="right">3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td align="left">left</td>
          <td align="center">center</td>
          <td align="right">right</td>
        </tr>
      </tbody>
    </table>
  `,
], [
  'works with syntax highlight',
  stripIndent`
    \`\`\`javascript
    function testFunc(arg) {
      console.log('Hello world');
    }
    \`\`\`
  `,
  stripIndent`
    <pre><code class="language-javascript">function testFunc(arg) {
      console.log('Hello world');
    }
    </code></pre>
  `,
], [
  'works with footnote and definition',
  'texttext[^foo]\n\n[^foo]: see also [document](http://example.com)',
  stripIndent`
    <p>texttext
      <div class="footnote">see also <a href="http://example.com">document</a></div>
    </p>
  `,
], [
  'works with ruby',
  stripIndent`
    ---
    ruby: true
    ---
    foo bar |baz<<ruby text>>

    漢字<<kanji>>と
    |カタカナ<<katakana>>
  `,
  stripIndent`
    <p>foo bar <ruby>baz<rt>ruby text</rt></ruby></p>
    <p>
      <ruby>漢字<rt>kanji</rt></ruby>と
      <ruby>カタカナ<rt>katakana</rt></ruby>
    </p>
  `,
], [
  'works with header attribute',
  stripIndent`
    ---
    headerAttribute: true
    ---
    ### ATX header with class {.hello}

    Setext header with class {.hola}
    --------------------------------

    # Header with closing hash {#test} #
  `,
  stripIndent`
    <h3 id="atx-header-with-class" class="hello">ATX header with class</h3>
    <h2 id="setext-header-with-class" class="hola">Setext header with class</h2>
    <h1 id="test">Header with closing hash</h1>
  `,
]];
