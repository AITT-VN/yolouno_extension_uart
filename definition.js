const UartColorBlock = "#0b5394";

var digitalPins = [
  [
    "D3",
    "D3"
  ],
  [
    "D4",
    "D4"
  ],
  [
    "D5",
    "D5"
  ],
  [
    "D6",
    "D6"
  ],
  [
    "D7",
    "D7"
  ],
  [
    "D8",
    "D8"
  ],
  [
    "D9",
    "D9"
  ],
  [
    "D10",
    "D10"
  ],
  [
    "D11",
    "D11"
  ],
  [
    "D12",
    "D12"
  ],
  [
    "D13",
    "D13"
  ],
  [
    "D0",
    "D0"
  ],
  [
    "D1",
    "D1"
  ],
  [
    "D2",
    "D2"
  ]
];

Blockly.Blocks['uno_uart_init'] = {
  init: function () {
    this.jsonInit(
      {
        type: "uno_uart_init",
        message0: "khởi tạo UART chân RX %1 chân TX %2 baudrate %3",
        previousStatement: null,
        nextStatement: null,
        args0: [
          {
            type: "field_dropdown",
            name: "RX",
            "options": digitalPins
          },
          {
            "type": "field_dropdown",
            "name": "TX",
            "options": digitalPins
          },
          {
            "type": "field_number",
            "name": "BAUDRATE",
            "value": 115200
          }
        ],
        colour: UartColorBlock,
        tooltip: "khởi tạo kết nối UART",
        helpUrl: ""
      }
    );
  }
};

Blockly.Python['uno_uart_init'] = function (block) {
  // TODO: Assemble Python into code variable.
  var tx = block.getFieldValue('TX');
  var rx = block.getFieldValue('RX');
  var baudrate = block.getFieldValue('BAUDRATE');
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  Blockly.Python.definitions_['create_UART']= 'uart = machine.UART(2, baudrate=' + baudrate + ', rx=' + rx + '_PIN, tx=' + tx + '_PIN)\nuart.init(parity=None, stop=1, bits=8)\n';
  var code = '';
  return code;
};

Blockly.Blocks["uno_uart_read_until"] = {
  init: function () {
    this.jsonInit({
      colour: UartColorBlock,
      tooltip: "đọc dữ liệu từ UART",
      message0: "đọc UART cho đến ký tự %1",
      output: null,
      args0: [
        {
          type: "field_dropdown",
          name: "END_CHAR",
          options: [
            ["xuống dòng", "\\n"],
            [",", ","],
            ["$", "$"],
            [":", ":"],
            [".", "."],
            ["#", "#"],
            ["CR", "\\r"],
            ["khoảng trắng", " "],
            ["tab", "\\t"],
            ["|", "|"],
            [";", ";"],
          ],
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['uno_uart_read_until'] = function (block) {
  // TODO: Assemble Python into code variable.
  var eol = block.getFieldValue('END_CHAR');

  var cbFunctionName = Blockly.Python.provideFunction_(
    'uart_read_until',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(eol):',
      "  result = ''",
      "  while uart.any():",
      "    new_char = uart.read(1).decode()",
      "    if new_char == eol:",
      "      return result",
      "    else:",
      "      result += str(new_char)",
      "  return result",
    ]);

  var code = "await " + cbFunctionName + '("' + eol + '")';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["uno_uart_write_string"] = {
  init: function () {
    this.jsonInit({
      colour: UartColorBlock,
      nextStatement: null,
      tooltip: "gửi dữ liệu qua UART",
      message0: "gửi chuỗi %1 %2 qua UART",
      previousStatement: null,
      args0: [
        {
          type: "input_dummy",
        },
        {
          type: "input_value",
          name: "MESSAGE",
        },
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['uno_uart_write_string'] = function (block) {
  // TODO: Assemble Python into code variable.
  var msg = Blockly.Python.valueToCode(block, 'MESSAGE', Blockly.Python.ORDER_ATOMIC);
  var code = 'uart.write(str(' + msg + '))\n';
  return code;
};

Blockly.Blocks["uno_uart_read_bytes"] = {
  init: function () {
    this.jsonInit({
      colour: UartColorBlock,
      tooltip: "đọc n bytes từ UART",
      message0: "đọc UART %1 %2 bytes ",
      output: null,
      args0: [
        {
          type: "input_dummy",
        },
        {
          type: "input_value",
          name: "BYTES",
        },
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['uno_uart_read_bytes'] = function (block) {
  // TODO: Assemble Python into code variable.
  var bytes = Blockly.Python.valueToCode(block, 'BYTES', Blockly.Python.ORDER_ATOMIC);
  var code = 'uart.read(' + bytes + ')';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["uno_uart_write_bytes"] = {
  init: function () {
    this.jsonInit({
      colour: UartColorBlock,
      nextStatement: null,
      tooltip: "gửi dữ liệu dạng byte vào UART",
      message0: "gửi bytes %1 %2 qua UART",
      previousStatement: null,
      args0: [
        {
          type: "input_dummy",
        },
        {
          type: "input_value",
          name: "BYTES",
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['uno_uart_write_bytes'] = function (block) {
  var raw_input = Blockly.Python.valueToCode(block, 'BYTES', Blockly.Python.ORDER_ATOMIC) || '""';

  // Bỏ dấu nháy đầu và cuối nếu có (có thể là ' hoặc ")
  if ((raw_input.startsWith('"') && raw_input.endsWith('"')) ||
      (raw_input.startsWith("'") && raw_input.endsWith("'"))) {
    raw_input = raw_input.slice(1, -1);
  }

  // Làm sạch chuỗi: loại bỏ khoảng trắng dư và giữ nguyên định dạng hex
  var cleaned = raw_input.replace(/\s+/g, '');

  // Tạo mã Python
  var code = 'uart.write(bytearray([' + cleaned + ']))\n';
  return code;

};

Blockly.Blocks["uno_uart_check_data"] = {
  init: function () {
    this.jsonInit({
      colour: UartColorBlock,
      tooltip: "kiểm tra xem có dữ liệu gửi đến UART hay không",
      message0: "có dữ liệu gửi đến UART?",
      output: null,
      args0: [
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['uno_uart_check_data'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'uart.any()';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["uno_uart_deinit"] = {
  init: function () {
    this.jsonInit({
      colour: UartColorBlock,
      nextStatement: null,
      tooltip: "tắt và hủy kết nối UART",
      message0: "tắt kết nối UART",
      previousStatement: null,
      args0: [
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['uno_uart_deinit'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'uart.deinit()\n';
  return code;
};``