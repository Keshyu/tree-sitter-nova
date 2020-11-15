module.exports = grammar({
  name: 'nova',

  extras: $ => [
    $.comment,
    /\s/,
  ],

  externals: $ => [
    $._newline,
  ],

  word: $ => $.name,

  rules: {
    source_file: $ => sep($._break, $._statement),

    _statement: $ => choice(
      $['import'],
      $.declaration,
      $.definition,
    ),

    'import': $ => seq(
      $.import_keyword,
      $.name,
    ),

    declaration: $ => seq(
      field('name', $.name),
      ':',
      field('type', $._expression),
    ),

    definition: $ => seq(
      field('name', $.name),
      optional(repeat($.pattern)),
      '=',
      field('value', $._expression),
    ),

    _expression: $ => choice(
      $._record,
      $._function_call,
      $.operator_expression,
      $.function,
      $._grouped_expression,
      $.name,
      $.string,
      $.number,
      $.no_value,
    ),

    _record: $ => choice(
      $.record_declaration,
      $.record_definition,
    ),

    record_declaration: $ => seq(
      '{',
      sep1($._break, $.declaration),
      '}',
    ),

    record_definition: $ => seq(
      '{',
      sep1($._break, $.definition),
      '}',
    ),

    _function_call: $ => choice(
      $.prefix_call,
      $.infix_call,
    ),

    prefix_call: $ => prec.left(10, seq(
      $._expression,
      $._expression,
    )),

    infix_call: $ => prec.left(5, seq(
      $._expression,
      $.operator,
      $._expression,
    )),

    operator_expression: $ => seq(
      '(',
      alias($.operator, ''),
      ')',
    ),

    operator: $ => /[\+=\-\*\&\^%\$@\!\\\|\/\?><,\.~]+/,

    function: $ => prec.right(1, seq(
      '\\',
      repeat($.pattern),
      '->',
      $._expression,
    )),

    pattern: $ => choice(
      $.name,
      alias('_', 'any'),
    ),

    _grouped_expression: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    name: $ => /[A-Za-z_]+[A-Za-z_0-9\-]*/,

    string: $ => seq(
        '"',
        repeat(choice(
          alias($.string_escaped, $.escaped),
          alias($.string_interpolation, $.interpolation),
          /./,
        )),
        '"',
    ),

    string_interpolation: $ => seq(
      '\\(',
      $._expression,
      ')',
    ),

    string_escaped: $ => /\\[a-zA-z0-9\\"]/,

    number: $ => token(choice(
      /[0-9]+/,
      /[0-9]+\.[0-9]+/,
      /[0-9]+\./,
      /\.[0-9]+/,
    )),

    no_value: $ => '()',

    comment: $ => /#.*/,

    import_keyword: $ => 'import',

    _break: $ => choice($._newline, ';'),
  },
});

function sep(separator, rule) {
  return optional(seq(
    rule,
    repeat(seq(separator, rule)),
    optional(separator),
  ));
}

function sep1(separator, rule) {
  return seq(
    rule,
    repeat(seq(separator, rule)),
    optional(separator),
  );
}
