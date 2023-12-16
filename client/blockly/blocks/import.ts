export const import_0 ={
    "type": "import_",
    "message0": "import %1",
    "args0": [
      {
        "type": "field_input",
        "name": "NAME",
        "text": "依赖"
      }
    ],
}

export function import_0BlockGenerators(block) {
    var text_name = block.getFieldValue('NAME');
    var code = `import ${text_name};\n`;
    return code;
};

export const importBlocks = [import_0]
  
export const importBlockGenerators = {
    'import_':import_0BlockGenerators,
}