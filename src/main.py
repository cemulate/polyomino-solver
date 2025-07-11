from Polyomino import Polyomino, tetrominos, letters
from PolyominoProblem import PolyominoProblem
from AlgorithmX import solveProblems, trim_duplicate_solutions
import time
import numpy as np
import sys
import os
from shapeprint import print_polyomino, print_solution
from puzzles import puzzles

np.set_printoptions(suppress=True,linewidth=np.nan,threshold=sys.maxsize)
os.system('cls')


# a = letters['e'].clone()

# print(a.coords)
# print_polyomino(a)

# a = a.reflect()

# print(a.coords)
# print_polyomino(a)

#format

region = Polyomino.fromString(
  '''
  OOOO
  O*OO
  OO*O
  OOOO
  '''
)
# region = Polyomino.fromString(
#   '''
#   OOOO
#   '''

# r2.ox = 0

# print("BEGIN LOOP")
# for c in coords:
#   print(f"Coord {c} from grid 1-0 to grid 2-1:")
#   sys.stdout.flush()
#   # time.sleep(2)
#   print(problem.to_grid(c, 2, 1, 1))
#   sys.stdout.flush()
#   # time.sleep(10)
#   print(f"Coord {c} from grid 2-1 to grid 1-0:")
#   sys.stdout.flush()
#   print(problem.from_grid(c, 2, 1, 1))
#   sys.stdout.flush()
#   print(f"Identity:")
#   sys.stdout.flush()
#   print(problem.to_grid(problem.from_grid(c, 2, 1, 1), 2, 1, 1))
#   sys.stdout.flush()

is_auto = input("Auto solve? Y/N").lower() == 'y'

t0 = time.time()


# max_recipe_size = 7
# def get_all_recipes(max_area, parent_recipe = []):
#   if sum([len(p.coords) for p in parent_recipe]) > max_area:
#     return []
#   if len(parent_recipe) >= max_recipe_size:
#     return [parent_recipe]
#   recipes = []
#   letter_names = ['a', 'b', 'c', 'd']
  
#   if len(parent_recipe) > 0:
#     letter_names = [l for l in letter_names if l >= parent_recipe[-1].baseName]
  
#   for l in letter_names:
#     recipes.extend(get_all_recipes(max_area, parent_recipe + [letters[l]]))

#   if len(parent_recipe) > 0:
#     recipes.append(parent_recipe)
  
#   return recipes


# all_recipes = get_all_recipes(len(region.coords))
# print(all_recipes)
# print("Recipes:")
# for r in all_recipes:
#   print(r)
#   print([p.baseName for p in r])

# for k, recipe in enumerate(all_recipes):
  # print(f"Recipe {k + 1} / {len(all_recipes)}")
  # print([p.baseName for p in recipe])

problem = puzzles['37']
print_polyomino(problem.region)
print(problem.region.clues)
print(problem.pieces)
print(problem.region.coords)

t1 = time.time()

convertedProblem = problem.convertToDlx()


# sys.exit()

t2 = time.time()

solutions = solveProblems(convertedProblem['problems'], return_all_solutions=True, is_auto = is_auto)
print("SOLUTIONS")

# print(solutions)

t3 = time.time()
solutions = trim_duplicate_solutions(solutions, len(problem.pieces))
t4 = time.time()

print(f"Found {len(solutions)} solution{'s' if len(solutions) != 1 else ''}.")

t3 = time.time()

for k, solution in enumerate(solutions):
  print(f"---SOLUTION {k + 1}---")

  pieces = convertedProblem['interpreter'](solution)
  print_solution(problem.regions, pieces)

print(f"Init: {t1 - t0}")
print(f"Convert to DLX: {t2 - t1}")
print(f"Solve: {t3 - t2}")
print(f"Trim duplicates: {t4 - t3}")
print(f"Total: {t4 - t0}")

# print(problem.matrix)
# print(problem.overlapMatrix)