import numpy as np
import time
import copy

def solveProblems(problems, return_all_solutions=False, is_auto = False):
  solutions = []
  for p in problems:
    print("Trying with recipe:")
    # time.sleep(10)
    [print(piece.name, piece.coords) for piece in p['recipe']]
    if not is_auto:
      keyword = input("Press Enter to resume solving, or type 'cancel' to cancel the solving process for this recipe.")
      if keyword == "cancel":
        continue
    newSolutions, _ = solve(p['matrix'], len(p['recipe']), evaluated_solution=[], essentials = [], base_essentiality=p['base_essentiality'], return_all_solutions=return_all_solutions, is_auto = is_auto)
    solutions.extend(newSolutions)
    if len(solutions) > 0 and not return_all_solutions:
      return solutions

  
  return solutions

def solve(matrix, nbPieces, evaluated_solution=[], essentials = [], base_essentiality=0, return_all_solutions=False, is_auto = False):

  # time.sleep(1)
  # More quickwin/quickloss checks here

  solutions = []

  # print(matrix.shape)

  # print("Comparisons")
  # print(sum(matrix[0, :]))
  # print(essentiality)
  # print("Matrix size")
  # print(matrix.shape)

  print("Depth:", len(evaluated_solution))
  print("Matrix")
  print(matrix)
  essentiality = sum(matrix[0, essentials]) + base_essentiality
  print(f"Essentiality: {essentiality} / {sum(matrix[0,:])}")
  if not is_auto:
    keyword = input("Press Enter to resume solving, or type 'cancel' to cancel the solving process for this recipe.")
    if keyword == "cancel":
      return [], True

  #Check that none of the remaining columns are essential
  # print("Essentials covered:",len(essentials))
  # print("Sum of essentials:",sum(matrix[0,:]))
  if np.isclose(sum(matrix[0,:]), essentiality):
    print("Found a solution!")
    # print([e.tolist()[0] for e in evaluated_solution])
    # print("Returning")
    # print(evaluated_solution)
    return [[e for e in evaluated_solution]], False #For some reason I'll lose refs to those elements in the solutions array if I don't recreate it here.
  elif matrix.shape[0] == 2:
    print("Found no solution here.")
    return [], False

  #Remove header
  matrixNh = matrix[2:, :]
  matrixH = matrix[0:2, :].copy() #Header only
  matrixH[0, essentials] = 0 #Disregard essential columns that were already validated

  #set essential to 0 where the column has no 1 entry (the essential element is no longer attainable and shouldn't be picked for the search)
  # print(np.max(matrixNh, axis = 0) < 1)
  # print(np.where(np.max(matrixNh, axis = 0) < 1))
  matrixH[0, np.where(np.max(matrixNh, axis = 0) < 1)] = 0
  # print(matrixH)
  # time.sleep(2)
  # print(matrixH)
  matrixH = 10e5 * (matrixH == 0) #Adds 10000 to non-essential columns so they aren't returned by the min column search
  # print(matrixH)

  # print("H1",matrixH)
  # print("Essentials:",essentials)

  # for e in essentials:
  #   matrixH[e] = 10e5
  
  # print("H2",matrixH)

  # essentialMatrix = np.append(np.reshape(matrixH, (2, matrixH.shape[0])), matrixNh, axis = 0)
  essentialMatrix = np.append(np.atleast_2d(matrixH[0, :]), np.minimum(matrixNh, 1), axis = 0)

  #Index of the ESSENTIAL column with the fewest options.
  # print(f"Depth: {len(evaluated_solution) + 1}")
  # print(f"Matrix dimensions: {matrix.shape}")
  # print(np.sum(essentialMatrix, axis=0))
  # print("ESMAT")
  # print(essentialMatrix)
  # time.sleep(10)
  # print(np.sum(essentialMatrix, axis=0))
  c = np.argmin(np.sum(essentialMatrix, axis=0))
  # print(len(evaluated_solution[0] if len(evaluated_solution) else 0))
  # if len(evaluated_solution) == 1:
  #   time.sleep(10)
  # if len(evaluated_solution) == 0:
  #   time.sleep(10)

  choices = int(np.sum(matrix[:, c]) - 1)
  # print(f"Smallest column: {c} ({choices} possible choices)")
  # print(matrix[:, c])

  if choices == 0:
    # print("An essential piece/tile has no covering options. Returning")
    return [], False
  
  exploredMatrix = matrix

  # print("EXPMAT??")
  # print(exploredMatrix)

  for kc in reversed(np.transpose(np.where(matrix[2:, c] > 0))):
    # print(f"{kc + 1} / {choices}")
    candidateRow = exploredMatrix[kc + 2, :]
    print("Candidate row:")
    print(np.vstack([np.arange(0, candidateRow.shape[1]), matrix[[0,1],:], candidateRow]))
    # time.sleep(2)
    # print()
    # print(candidateRow)
    # print(candidateRow.tolist()[0])
    evaluated_solution.append(candidateRow.tolist()[0])

    # print("EP:")
    # for ep in exploredPlacements:
    #   print(ep)
    # print("Current row:", candidateRow[:, nbPieces:])
    # if any(np.array_equal(ep, candidateRow[:, nbPieces:]) for ep in exploredPlacements): #You've already explored a similar solution, placing an identical piece in the same spot. Ignore
    #   print("Indentical match found. Discard")
    #   continue
    # exploredPlacements.append(candidateRow[:, nbPieces + 1:])
    subMatrix, newEssentials = reduceMatrix(exploredMatrix, kc)
    # print("Essentials")
    # print(essentials)
    print("New essentials")
    print(newEssentials)
    print("In regions")
    print(matrix[1,newEssentials])
    newSolutions, cancel = solve(subMatrix, nbPieces, evaluated_solution, essentials + newEssentials, base_essentiality, return_all_solutions = return_all_solutions, is_auto = is_auto)
    solutions.extend(newSolutions)
    if cancel == True:
      return solutions, True
    # print(f"Returned. Solutions: {len(solutions)}")
    if len(solutions) > 0 and not return_all_solutions:
      return solutions, False
    evaluated_solution.pop()

    # print("a",exploredMatrix.shape)
    exploredMatrix = np.delete(exploredMatrix, kc + 2, axis=0) #TODO UNCOMMENT??
    # print("b",exploredMatrix.shape)

  # if len(evaluated_solution) == 0:
  #   print("About to exit program. Matrix:")
  #   print(matrix)
  #   time.sleep(10)
  depth = len(evaluated_solution)
  print(f"Depth {depth} -> {depth - 1}")
  return solutions, False

def reduceMatrix(matrix, kc):

  #Remove header
  matrixNh = matrix[2:, :]
  matrixH = matrix[0:2, :] #Header only

  # print("Reducing matrix with vector:")
  # print(matrix[kc + 1, :])

  # print("From:")
  # print(matrixNh)

  mulMatrix = np.tile(matrix[kc + 2, :], (matrixNh.shape[0], 1))
  
  # Indices will be 1 if both rows have a 1 on the same index;
  # 0 if one of them had a 0,
  # 0.5 if one of them was 1 and the other was 0.5,
  # and a lower value otherwise.
  prodMatrix = np.multiply(matrixNh, mulMatrix)

  # print("To:")
  # print(prodMatrix)

  # Find the highest value in each row
  highestProdPerRow = np.max(prodMatrix, axis=1)

  #We'll remove any row that has a value geq 0.5 (adding back the header row)
  # reducedMatrix = np.append(np.reshape(matrixH, (1, matrixH.shape[0])), matrixNh[np.where(highestProdPerRow < 0.5)], axis = 0)
  reducedMatrix = np.append(matrixH, matrixNh[np.where(highestProdPerRow < 0.25)], axis = 0)

  # print("Reduced matrix:")
  # print(reducedMatrix)

  # print("Essentials check")
  # print(matrix[kc + 1, :])
  # print(matrixH)
  # print(np.multiply(matrix[kc + 1, :], matrixH))
  # print(np.where(np.multiply(matrix[kc + 1, :], matrixH) == 1)[0].tolist())

  # print("Essential coords")
  # print(np.where(np.multiply(matrix[kc + 2, :], matrixH[0, :]) == 1)[1])
  # print("Essential coords 2")
  # print(np.where(matrix[kc + 2, :] == 1)[1])
  # print(np.where(matrixH[0, :] > 0)[0])
  # print(np.intersect1d(np.where(matrix[kc + 2, :] == 1)[1], np.where(matrixH[0, :] > 0)[0]))

  essentials = np.intersect1d(np.where(matrix[kc + 2, :] >= 1)[1], np.where(matrixH[0, :] > 0)[0]).tolist()

  # print("Essentials")
  # print(essentials)

  return reducedMatrix, essentials

def select(X, Y, r):
    cols = []
    for j in Y[r]:
        for i in X[j]:
            for k in Y[i]:
                if k != j:
                    X[k].remove(i)
        cols.append(X.pop(j))
    return cols

def deselect(X, Y, r, cols):
    for j in reversed(Y[r]):
        X[j] = cols.pop()
        for i in X[j]:
            for k in Y[i]:
                if k != j:
                    X[k].add(i)

def trim_duplicate_solutions(solutions, nbPieces):
  unique_solutions = []
  for solution in solutions:
    valid = True
    for other_solution in unique_solutions:
      any_difference = False
      for s in solution:
        if s[nbPieces:] not in [o[nbPieces:] for o in other_solution]:
          any_difference = True
          break
      
      if not any_difference:
        valid = False
    
    if valid:
      # print("This solution is unique!")
      unique_solutions.append(solution)
  
  return unique_solutions

