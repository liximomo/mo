# Specification

| 属性 |  type | describe | default |
| --- | :---: |:--- |:---|
| @method | string | http method: post, get, put, option, delete | 处理所有请求方法|
| @rule  | string &#124; [rule][rule] &#124; (string &#124; [rule][rule])[] | 一个有效的 pipeline name 或 pipeline 数组。 pipeline 会按照从右止左的顺序依次生效，上一个 pipeline 的输出回作为下一个 pipeline 的输入，@resp 的值会作为首个输入| 当没有指定 @rule 时，默认返回 @resp 的内容 | 
| @resp  | any | 用户自定义的数据 | - |


## rule
| 属性 |  type | describe | default |
| --- | :---: |:--- |:---|
| name | string | pipeline name | - |
| option | any | 作为 pipeline 的选项参数，在实例化 pipeline 时传入| - |


[rule]: #rule