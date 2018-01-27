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
]];
