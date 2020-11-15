#ifndef SCANNER_H
#define SCANNER_H

#include <string>

using std::string;

enum TokenType {
  NEWLINE,
};

struct Scanner {
  void deserialize(const char *buffer, unsigned length) { }

  unsigned serialize(char *buffer) {
    return 0;
  }

  bool scan(TSLexer *lexer, const bool *valid_symbols) {
    bool has_new_line = false;

    while (!check(lexer, 0)) {
      if (check(lexer, '\n')) {
        skip(lexer);
        has_new_line = true;
      }
      else if (check(lexer, '\r')) {
        skip(lexer);
      }
      else if (check(lexer, ' ')) {
        skip(lexer);
      }
      else if (check(lexer, '\t')) {
        skip(lexer);
      }
      else {
        break;
      }
    }

    if (has_new_line) {
      string operators = "+=-*&^%$@!<>,.?/|\\";
      
      if (operators.find(lexer->lookahead) == string::npos) {
        if (valid_symbols[NEWLINE]) {
            lexer->result_symbol = NEWLINE;
            return true;
        }
      }
    }

    if (check(lexer, 0)) {
      if (valid_symbols[NEWLINE]) {
          lexer->result_symbol = NEWLINE;
          return true;
      }
    }

    return false;
  }

private:
  void skip(TSLexer *lexer) {
    lexer->advance(lexer, true);
  }

  bool check(TSLexer* lexer, char c) {
    return lexer->lookahead == c;
  }
};

#endif
