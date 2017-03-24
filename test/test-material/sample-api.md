## Functions

<dl>
<dt><a href="#fix">fix(filePath, options)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Executes <code>eslint --fix</code> for given filePath based on options.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd><p>Options to determine fix function&#39;s behaviour.</p>
</dd>
</dl>

<a name="fix"></a>

## fix(filePath, options) ⇒ <code>Promise.&lt;void&gt;</code>
Executes `eslint --fix` for given filePath based on options.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - - Result promise  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | File path is passed to `eslint --fix`. |
| options | <code>[Options](#Options)</code> | Options |

<a name="Options"></a>

## Options : <code>Object</code>
Options to determine fix function's behaviour.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| checkAvailable | <code>boolean</code> | <code>false</code> | When true, `eslint` command availability is checked. If `eslint` is not available, `eslint` command will not be executed. |
| useEslint | <code>boolean</code> | <code>true</code> | When false, `eslint` command will not be executed. |
