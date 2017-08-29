# Assign

## name
assign

## option
source 对象

<!-- | name  | describe | default |
| :---: |:---| :---: |
| Content Cell  | Content Cell  | -|
| Content Cell  | Content Cell  | -| -->

## input
target 对象

## ouput
根据 `option` 对象，将 `target` 对象的同名属性的值设为相应的 `source` 对象的值

## example

### source
```json
{
  "name": "source",
  "code": -1
}
```

### target
```json
{
  "name": "target",
  "code": 200,
  "msg": "ok"
}
```

### output
```json
{ 
  "name": "source",
  "code": 200,
  "msg": "ok"
}
```