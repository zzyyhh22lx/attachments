## css规范

### css命名规范——BEM规范

* BEM分别是块（Block），元素（Element），修饰符（Modifier）

  > __ 双下划线：双下划线用来连接块和块的子元素 

  > -- 双中划线 ：仅作为连字符使用，表示块和元素的不同状态

  ```
  .block {}
  .block__element{}
  .block--modifier {}
  ```

  - `.block` 代表了更高级别的抽象或组件。
  - `.block__element` 代表.block的后代，用于形成一个完整的.block的整体
  - `.block--modifier` 代表.block的不同状态或不同版本

* 命名最好都使用小写

* 命名简写-有意义

* 嵌套层级最好不要超过4级

****


### 代码规范

* id选择器优先级高，但唯一，不能复用，要按需使用，不可滥用

* `选择器`和`{}`之间需要包含空格` `

* `属性名`和`:`之间`不允许`包含空格，`:`和`属性值`之间`必须`有空格

* 当一个css规则包含`多个`选择器时，每个选择器都必须`单独`占一行

* `>` `+` `~` 等选择器的两边各保留一个空格

* 属性定义必须另起一行，必须以`;`结尾

* border / margin / padding等设置多个方向值时，尽量使用缩写

* 尽量不使用添加空标签的方式清除浮动

* url()函数中的路径使用单引号`''`

* 颜色值不能使用命名色值，色值都使用小写，16进制颜色代码尽量使用缩写

* 带有私有前缀的属性由长到短排列，按冒号`:`位置对齐

  > ```
  > .box {
  > -webkit-box-sizing: border-box;
  >    -moz-box-sizing: border-box;
  >         box-sizing: border-box;
  > }
  > ```
  
  > 标准属性放在最后，按冒号对齐方便阅读，也便于在编辑器内进行多行编辑



### 样式属性顺序规范

单个样式规则下的属性在书写时，应按功能进行分组，并以 Positioning Model > Box Model > Typographic > Visual 的顺序书写，提高代码的可读性。

> 如果包含 content 属性，应放在最前面

1. Positioning Model 布局方式、位置，相关属性包括：position / top / right / bottom / left / z-index / display / float / ...

2. Box Model 盒模型，相关属性包括：width / height / padding / margin / border / overflow / ...

3. Typographic 文本排版，相关属性包括：font / line-height / text-align / word-wrap / ...

4. Visual 视觉外观，相关属性包括：color / background / list-style / transform / animation / transition / ...

   >  Positioning 处在第一位，因为他可以使一个元素脱离标准文本流，并且覆盖盒模型相关的样式。盒模型紧跟其后，因为他决定了一个组件的大小和位置。其他属性只在组件内部起作用或者不会对前面两种情况的结果产生影响，所以他们排在后面。
   
   >  **目的**：减少浏览器reflow(回流)，提升浏览器渲染dom的性能

