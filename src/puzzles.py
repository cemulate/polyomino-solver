from Polyomino import Polyomino, tetrominos, letters
from PolyominoProblem import PolyominoProblem

def abdec(s):
  return [letters[c] for c in s]

puzzles = {
  '1': PolyominoProblem(
    abdec('a'),
    Polyomino.fromString(
      '''
      .O
      OO
      '''
    ),
  ),
  '2': PolyominoProblem(
    abdec('b'),
    Polyomino.fromString(
      '''
      .O
      OO
      .OO
      '''
    ),
  ),

  '3': PolyominoProblem(
    abdec('ab'),
    Polyomino.fromString(
      '''
      ....O
      OO.OO
      .OOO
      ..O
      '''
    ),
  ),

  '4': PolyominoProblem(
    abdec('aabb'),
    Polyomino.fromString(
      '''
      .OOO
      OOO.
      O.OO
      .OOO
      '''
    ),
  ),

  '5': PolyominoProblem(
    abdec('bbbbb'),
    Polyomino.fromString(
      '''
      OOOOO
      .OOOO
      OO.OO
      .OOOO
      '''
    ),
  ),

  '6': PolyominoProblem(
    abdec('a'),
    Polyomino.fromString(
      '''
      OOO
      O*O
      **O
      '''
    ),
  ),

  '7': PolyominoProblem(
    abdec('bb'),
    Polyomino.fromString(
      '''
      OOO
      O*O
      O.O
      '''
    ),
  ),

  '8': PolyominoProblem(
    abdec('aaab'),
    Polyomino.fromString(
      '''
      .OOO
      OOOO*
      OOOO
      ...*
      '''
    ),
  ),

  '9': PolyominoProblem(
    abdec('aabbb'),
    Polyomino.fromString(
      '''
      ..OO
      .OOOO
      .O.OOO
      *O*O
      ..OO
      ..*
      '''
    ),
  ),

  '10': PolyominoProblem(
    abdec('a'),
    Polyomino.fromString(
      '''
      .aOO
      .O.O
      OO
      '''
    ),
  ),

  '11': PolyominoProblem(
    abdec('bb'),
    Polyomino.fromString(
      '''
      OObObOO
      '''
    ),
  ),

  '12': PolyominoProblem(
    abdec('bb'),
    Polyomino.fromString(
      '''
      OOOOObO
      OOObOOO
      '''
    ),
  ),

  '13': PolyominoProblem(
    abdec('ab'),
    Polyomino.fromString(
      '''
      OaO
      O.O
      OOO
      ..O
      '''
    ),
  ),

  '14': PolyominoProblem(
    abdec('aaaa'),
    Polyomino.fromString(
      '''
      OO.O*
      OOaOO
      OOOOO
      OO*OO
      '''
    ),
  ),

  '15': PolyominoProblem(
    abdec('aaabbb'),
    Polyomino.fromString(
      '''
      OObOO
      OOOOO
      OOOOOa
      .OOOOO
      ..O*OO
      ..OOa
      '''
    ),
  ),

  '16': PolyominoProblem(
    abdec('bbbbbbb'),
    Polyomino.fromString(
      '''
      O
      OOOO*O
      O.OO.O
      OOOOOO
      .O.OO
      .OOOO
      .ObbO
      '''
    ),
  ),

  '17': PolyominoProblem(
    abdec('ac'),
    Polyomino.fromString(
      '''
      .OO
      OaO
      .O
      '''
    ),
  ),

  '18': PolyominoProblem(
    abdec('aabcc'),
    Polyomino.fromString(
      '''
      OOOO
      cOOO
      OOOO
      OOOc
      '''
    ),
  ),

  '19': PolyominoProblem(
    abdec('aabbcc'),
    Polyomino.fromString(
      '''
      .O
      O*
      *O*O*O
      .*.O.O
      .*.*.O
      '''
    ),
  ),

  '20': PolyominoProblem(
    abdec('abccccc'),
    Polyomino.fromString(
      '''
      OO*OO
      OOOOc
      OObOO
      O.OOO
      '''
    ),
  ),

  '37': PolyominoProblem(
    abdec('ace'),
    Polyomino.fromString(
      '''
      OO..Oc
      OOO*OO
      O*OOO*
      OOO*OO
      OO..OO
      '''
    ),
  ),

  '39': PolyominoProblem(
    abdec('b'),
    Polyomino.fromString(
      '''
      OOOO
      O*OO
      OO*O
      OOOO
      '''
    ),
  ),

  '40': PolyominoProblem(
    abdec('aaac'),
    Polyomino.fromString(
      '''
      aO
      OOOOa
      .OOO.
      .OO..
      .a...
      '''
    ),
  ),

  '41': PolyominoProblem(
    abdec('aaa'),
    Polyomino.fromString(
      '''
      .*OOOO*
      .OOOOOO
      .OOOOOO
      OOOOOOOO
      OaOOOOaO
      .OO..OO.
      '''
    ),
  ),

  '42': PolyominoProblem(
    abdec('aabc'),
    Polyomino.fromString(
      '''
      OOOb
      O*OO
      O*OO
      O**O
      O**O
      OOOc
      '''
    ),
  ),
  
}