# Assign

## name
resp-simple

## option
| name  | describe | default |
| :---: |:---:| :---: |
| code | 响应代码  | 200 |
| msg | 响应消息  | "ok" |

## input
对象

## ouput
如果输入对象有 `code`, `msg`, `data` 字段，则用 `option` 提供的 `code`, `msg` 覆盖输入对象的相应属性值，否则将输入对象作为输出对象 `data` 的属性值，并设置 `option` 提供的 `code` 和 `data` 字段。

## example

### example1

#### option
```json
{
  "msg": "未知错误",
  "code": 402
}
```

#### input
```json
{
  "name": "input"
}
```

#### output
```json
{ 
  "code": 402,
  "msg": "未知错误",
  "data": {
    "name": "input"
  }
}
```


### example2

#### option
```json
{
  "msg": "未知错误",
  "code": 402
}
```

#### input
```json
{ 
  "code": 200,
  "msg": "ok",
  "data": "data"
}
```

#### output
```json
{ 
  "code": 402,
  "msg": "未知错误",
  "data": "data"
}
```