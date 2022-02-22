# API

## ProtoDef(validation=true)

### ProtoDef.addType(name,functions,validate=true)

Add the type `name` with the data `functions` which can be either:
* "native" : that type is already implemented by ProtoDef
* a js object defining a type based on other already defined types
* `[read,write,sizeOf[,schema]]` functions
* a validate boolean : to check the validity of the type against its schema or not

See [newDataTypes.md](newDataTypes.md) for more details.

### ProtoDef.addTypes(types)

Add `types` which is an object with keys the name of the types and values the type definitions.

### ProtoDef.addProtocol(protocol,path)

Add types in `protocol` recursively. The protocol object is an object with keys `types` and namespace keys.
* The value of the `types` key is an object of type name to type definition.
* The value of the namespace key is a protocol object.

The `path` is an array of namespace keys which select a path of namespaces to be added to the protodef object.

See full_protocol.js for an example of usage.

### ProtoDef.setVariable(name, value)

Sets a primitive variable type for the specified `name`, which can be dynamically updated. Can be refrenced in switch statements with the "/" prefix.

### ProtoDef.read(buffer, cursor, _fieldInfo, rootNodes)

Read the packet defined by `_fieldInfo` in `buffer` starting from `cursor` using the context `rootNodes`.

### ProtoDef.write(value, buffer, offset, _fieldInfo, rootNode)

Write the packet defined by `_fieldInfo` in `buffer` starting from `offset` with the value `value` and context `rootNode`

### ProtoDef.sizeOf(value, _fieldInfo, rootNode)

Size of the packet `value` defined by `_fieldInfo` with context `rootNode`

### ProtoDef.createPacketBuffer(type,packet)

Returns a buffer of the `packet` for `type`.

### ProtoDef.parsePacketBuffer(type,buffer,offset = 0)

Returns a parsed packet of `buffer` for `type` starting at `offset`.

## Serializer(proto,mainType)

Create a serializer of `mainType` defined in `proto`. This is a Transform stream.

### Serializer.createPacketBuffer(packet)

Returns a buffer of the `packet`.

## Parser(proto,mainType)

Create a parser of `mainType` defined in `proto`. This is a Transform stream.

### Parser.parsePacketBuffer(buffer)

Returns a parsed packet of `buffer`.

## types

An object mapping the default type names to the corresponding `[read,write,sizeOf]` functions.

## ProtoDefCompiler

### ProtoDefCompiler.addTypes(types)

Add `types` which is an object with keys the name of the types and values the type definitions.

### ProtoDefCompiler.addProtocol(protocol,path)

Add types in `protocol` recursively. The protocol object is an object with keys `types` and namespace keys.
* The value of the `types` key is an object of type name to type definition.
* The value of the namespace key is a protocol object.

The `path` is an array of namespace keys which select a path of namespaces to be added to the protodef object.

### ProtoDefCompiler.addVariable(name, value)

Adds a primitive variable type for the specified `name`, which can be dynamically updated. Can be refrenced in switch statements with the "/" prefix.

### ProtoDefCompiler.compileProtoDefSync(options = { printCode: false })

Compile and return a `ProtoDef` object, optionaly print the generated javascript code.

## CompiledProtodef

The class of which an instance is returned by compileProtoDefSync

It follows the same interface as ProtoDef : read, write, sizeOf, createPacketBuffer, parsePacketBuffer
Its constructor is CompiledProtodef(sizeOfCtx, writeCtx, readCtx). 
sizeOfCtx, writeCtx and readCtx are the compiled version of sizeOf, write and read. They are produced by Compiler.compile

It can be used directly for easier debugging/using already compiled js.

### CompiledProtodef.setVariable(name, value)

Sets a primitive variable type for the specified `name`, which can be dynamically updated. Can be refrenced in switch statements with the "/" prefix.


## utils

Some functions that can be useful to build new datatypes reader and writer.

### utils.getField(countField, context)

Get `countField` given `context`. Example: "../field" will get "field" one level above.

### utils.getFieldInfo(fieldInfo)

Takes `fieldInfo` as :
* `"type"`
* `["type",typeArgs]`
* `{ type: "type", typeArgs: typeArgs }`

Returns `{ type: "type", typeArgs: typeArgs }`

### utils.addErrorField(e, field)

Add `field` to error `e` and throw e.

### utils.tryCatch(tryfn, catchfn)

A simple tryCatch function, useful for optimization.
returns what tryfn returns

### utils.tryDoc(tryfn, field)

Try `tryfn`, it it fails, use addErrorField with `field`
