# weapp-utils

提供了一些微信小程序常用的基础方法

# Installation and Usage

## Installation

```shell
npm install --save weapp-utils
```

## Usage

### 全量导入

```javascript
import * as weappUtils from "weapp-utils"
weappUtils.merge(obj1, obj2)
```

### 部分导入

```javascript
import { merge } from 'weapp-utils'
merge(obj1, obj2)
```

# Available Functions

## getType

判断变量的数据类型

```javascript
import { getType } from 'weapp-utils'
const numType = getType(1);
const strType = getType('1');
```

## isNumber

判断变量的数据类型是否为数字（Number）

## isString

判断变量的数据类型是否为字符串（String）

## isBool

判断变量的数据类型是否为布尔（Boolean）

## isUndefined

判断变量的数据类型是否为未定义（Undefined）

## isNull

判断变量的数据类型是否为空（Null）

## isObject

判断变量的数据类型是否为对象（Object）

## isFunction

判断变量的数据类型是否为函数（Function）

## isArray

判断变量的数据类型是否为数组（Array）

## isNullOrUndef

判断变量的数据类型是否为未定义或空

## isUseless

判断变量的值是否为未定义，空，或空字符串

## isDefined

判断变量是否为已定义，即非Undefined且非Null

## isBasicType

判断变量是否为基本数据类型，即Number, String, Boolean, Undefined, Null中的一种

## isEmpty

判断是否是空字符串，空数组，空对象

## deepClone

深拷贝，不考虑Symbol, Map, Set, Function等数据类型

## isEqual

比较值是否一样，如果是引用类型，会通过枚举方式去比较值

## contains

判断对象或数组是否包含某个元素

## findIndex

作用类似于ES6 Array提供的高阶函数findIndex

## dataFilter

```javascript
const handledData = dataFilter(obj, isStrict = false, checkArr = false)
```

主要是用于处理ajax参数，此处不考虑Symbol,Map,Set,Function等数据类型
isStrict默认为false，过滤掉参数中的null,undefined；当isStrict为true时，会过滤掉空字符串
checkArr默认为false，不会处理数组中的null,undefined，例如[1,undefined,null]这种数据不会做处理；当checkArr为true时，则会进行过滤，此时如果isStrict为true，还会过滤空字符串

## merge

```javascript
const mergedObj = merge(obj1, obj2, obj3)
const mergedArr = merge(arr1, arr2, arr3)
```

合并多个对象或数组

## debounce

防抖函数

## throttle

节流函数