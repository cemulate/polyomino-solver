from Polyomino import Polyomino
import numpy as np
import math
import time
from shapeprint import print_polyomino, print_solution

class PolyominoProblem:

  def __init__(self, pieces, region):
      self.pieces = list(map(lambda x: x.normalize(), pieces))
      self.region = region.normalize()
      self.regions = [self.region]

      # Extremal bounds
      self.width = self.region.getWidth()
      self.height = self.region.getHeight()

  def _fits(self, piece):
    #Quick check
    region = piece.region if piece.region is not None else self.region
    # print("Region for fit:", [c for c in region.coords])
    # print("Piece coords",piece.coords)
    # print(piece.getLargestX(), piece.getLargestY())
    if piece.getWidth() > region.getWidth() or piece.getHeight() > region.getHeight():
      return False
    
    return all(region.containsCoordinate(c) for c in piece.coords)

  def to_grid(self, c, dx, dy, ox):
    # basis = np.array([[dx, dy], [-dy, dx]])
    # print("to",basis)
    # return np.linalg.solve(basis, [c[0] - ox, c[1]])
    # print("TO GRID")
    # print(c, dx, dy, ox)
    basis = self.invert_basis(dx, dy)
    # print(basis)
    result = np.matmul(basis, np.array([[[c[0] - ox], [c[1]]]])).tolist()
    result = [result[0][0][0], result[0][1][0]]
    return result

  def invert_basis(self, dx, dy):
    denom = dx**2 + dy**2
    return np.array([[dx, dy], [-dy, dx]]) / denom
  
  def from_grid(self, c, dx, dy, ox):
    # print("from")
    # print(c, dx, dy, ox)
    basis = np.array([[dx, -dy], [dy, dx]])
    result = np.matmul(basis, np.array([[[c[0]], [c[1]]]])).tolist()[0]
    # print(result)
    return [result[0][0] + ox, result[1][0]]
    # basis = self.invert_basis(dx, dy)
    # result = np.linalg.solve(basis, [c[0], c[1]])
    # print("from",basis)
    # return [result[0] + ox, result[1]] #c[0] * np.array([dx, dy]) + c[1] * np.array([dy, dx])

  def _getOverlappingCoords(self, c, r1, r2, split_partially_covered=False):
    x, y = c[0], c[1]
    # print(c)
    # print(x, y)
    o_vertices = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]]
    # print("o vertices")
    # print(o_vertices)
    # print(vertices)

    dx1, dy1, ox1 = r1.dx, r1.dy, r1.ox
    dx2, dy2, ox2 = r2.dx, r2.dy, r2.ox
    vertices = [self.to_grid(self.from_grid(v, dx1, dy1, ox1), dx2, dy2, ox2) for v in o_vertices] #Convert from grid 1 to world, then to grid 2
    # print(vertices)
    # print("Converted vertices")
    # print(vertices)
    x1, x2 = math.floor(min(v[0] for v in vertices)), math.ceil(max(v[0] for v in vertices))
    y1, y2 = math.floor(min(v[1] for v in vertices)), math.ceil(max(v[1] for v in vertices))
    # print(x1, x2, y1, y2)

    # print(f"Overlap of r1 {dx1, dy1, ox1} and r2 {dx2, dy2, ox2}")
    # print(f"r1 coords {r1.coords}")
    # print(f"r2 coords {r2.coords}")
    # print(f"range {x1, x2}, {y1, y2}")
    tot_overlapping, part_overlapping = [], []
    for xx in range(x1, x2):
      for yy in range(y1, y2):
        o_vertices2 = [[xx, yy], [xx + 1, yy], [xx + 1, yy + 1], [xx, yy + 1]]
        # print("c2's vertices in r2")
        # print(o_vertices2)
        vertices2 = [self.to_grid(self.from_grid(v, dx2, dy2, ox2), dx1, dy1, ox1) for v in o_vertices2] #Convert back from grid 2 to grid 1
        # print(f"{xx, yy} tile's vertices in r1 are {vertices2}")
        some_overlap, all_overlap = False, True
        # for vv in vertices2:
        #   if (x <= vv[0] <= x + 1 and y <= vv[1] <= y + 1):
        #     some_overlap = True
        #     if not split_partially_covered:
        #       all_overlap = True
        #       break
        #   else:
        #     all_overlap = False
        # print("c2's vertices in r1")
        # print(vertices2)

        #Point is strictly within the other tile (there is definite overlap)
        e0 = .001 #epsilon for float imprecision
        expr1 = [x + e0 < vv[0] < x + 1 - e0 and y + e0 < vv[1] < y + 1 - e0 for vv in vertices2]
        expr2 = [xx + e0 < p[0] < xx + 1 - e0 and yy + e0 < p[1] < yy + 1 - e0 for p in vertices]
        expr = [e1 or e2 for e1, e2 in zip(expr1, expr2)]

        # print(expr1, expr2)
        # print(expr)

        some_overlap = any(expr)

        if not some_overlap:
          all_overlap = False
        elif split_partially_covered:
          #Point is out of the shape
          expr1b = [not (x - e0 < vv[0] < x + 1 + e0 and y - e0 < vv[1] < y + 1 + e0) for vv in vertices2]
          # expr2b = [not (xx - e0 < p[0] < xx + 1 + e0 and yy - e0 < p[1] < yy + 1 + e0) for p in vertices]
          # expr2b = [not (vertices2[0][0] - e0 < p[0] < vertices2[2][0] + e0 and vertices2[0][1] - e0 < p[1] < vertices2[2][1] + e0) for p in o_vertices]
          # exprb = [e1 and e2 for e1, e2 in zip(expr1b, expr2b)]

          # print(expr1b, expr2b)
          # print(expr1b, expr2b)
          # expr = expr1

          all_overlap = not any(expr1b) # or not any (expr2b)
        else:
          all_overlap = True

        # assert(some_overlap == some_overlap2)
        # assert(all_overlap == all_overlap2)
        
        if all_overlap:
          tot_overlapping.append([xx, yy])
        elif some_overlap:
          part_overlapping.append([xx, yy])
    
    # print(f"Coordinates {c} from {dx1,dy1,ox1} to {dx2,dy2,ox2}")
    # print("Overlapping totally:")
    # print(tot_overlapping)
    # print("Overlapping partially:")
    # print(part_overlapping)
    # print("\n")
    # time.sleep(4)

    return tot_overlapping, part_overlapping

  def _generateVirtualRegions(self):
    N = 3
    regionArea = len(self.region.coords)

    for dx in range(1, N + 1):
      for dy in range(1, N + 1):
        if np.gcd(dx, dy) > 1: #This grid already exists at a smaller scale. Ignore
          continue
        
        for ox in range(dx**2 + dy**2):
        
          r2 = Polyomino([])
          r2.dx = dx
          r2.dy = dy
          r2.ox = ox
          for c in self.region.coords:
            # print("Original:",c)
            overlapping, _ = self._getOverlappingCoords(c, self.region, r2)
            for o in overlapping:
              if o not in r2.coords:
                r2.coords.append(o)
          
          new_coords = []
          for c in r2.coords:
            # print("Candidate:",c)
            overlapping, _ = self._getOverlappingCoords(c, r2, self.region)
            if all(cc in self.region.coords for cc in overlapping):
              new_coords.append(c)

          r2.coords = new_coords

          if len(r2.coords) == 0:
            print("Region is empty. Discard")
            continue
          
          r2.col = self.regions[-1].col + len(self.regions[-1].coords)

          r2.coords.sort(key = lambda c: c[::-1])
          
          self.regions.append(r2)
          # print(f"Region with slope {dx, dy} and offset {ox} has coords:")
          # print(r2.coords)
          # print(f"And col {r2.col}")
    
    #All regions have been generated. Now to create an overlap matrix.
    nbCoords = sum([len(r.coords) for r in self.regions])
    self.overlapMatrix = np.identity(nbCoords)

    for k1, r1 in enumerate(self.regions):
      oc1 = sum([len(r.coords) for r in self.regions[:k1]])
      # print(r1, len(r1.coords))

      for k2, r2 in enumerate(self.regions):
        if k1 == k2:
          continue
        oc2 = sum([len(r.coords) for r in self.regions[:k2]])
        # print(r2, len(r2.coords))

        for kc1, c1 in enumerate(r1.coords):
          for kc2, c2 in enumerate(r2.coords):
            ic1 = oc1 + kc1
            ic2 = oc2 + kc2

            # print("All regions:")
            # for r in self.regions:
            #   print(r.coords)
            # print("All region sizes:")
            # print([len(r.coords) for r in self.regions])

            # print("Indices1:",k1, oc1, kc1, ic1)
            # print("Indices2:",k2, oc2, kc2, ic2)

            assert(ic1 != ic2)

            # print(f"Overlap: {k1 + 1} ({c1}) -> {k2 + 1}")

            tot_overlap, part_overlap = self._getOverlappingCoords(c1, r1, r2, split_partially_covered=False) #TODO MAYBE TRUE

            # print(r1.coords)
            # print(r2.coords)
            # print(tot_overlap, part_overlap)
            # time.sleep(5)

            #TODO MAYBE overlap = 1 if ...
            overlap = .25 if c2 in tot_overlap else (.25 if c2 in part_overlap else 0)

            self.overlapMatrix[ic1, ic2] = overlap
            # self.overlapMatrix[ic2, ic1] = overlap
    
    # print("Overlap Matrix")
    # print(self.overlapMatrix)
    # time.sleep(10)


  def _generateAllPossibleRecipes(self, pieces, recipePieces=[]):
    recipes = []
    regionArea = len(self.region.coords)

    for mult in range(1, 4): #TODO 4
      othersArea = sum(len(p.coords) for p in pieces[1:]) + sum(len(p.coords) for p in recipePieces)
      myArea = len(pieces[0].coords)
      if othersArea + myArea * mult * mult > regionArea:
        continue
      
      newPiece = pieces[0].scale(mult)
      
      if len(pieces) > 1:
        recipes.extend(self._generateAllPossibleRecipes(pieces[1:], recipePieces + [newPiece]))
      else:
        recipes.extend([recipePieces + [newPiece]])
    
    return recipes

  # Oh boy, that's where the Abdec magic happens.
  # This will include scaling and crafting, making multiple matrices if need be...
  # If formatting is added, there may even be gimmicks with interacting virtual grids...
  def _generateAllPossibleConfigurations(self, piece):
    places = []
    uniqueConfigs = []

    for rotation in [0, 1, 2, 3]:
      for reflected in [False, True]:
        config = piece.rotate(rotation)
        if reflected:
          config = config.reflect()
        config = config.normalize()

        # Account for symmetries
        # Two configs are the same iff their normalizations are equal
        if any(c.equals(config) for c in uniqueConfigs):
          continue

        uniqueConfigs.append(config)

        for r in self.regions:
          # print("Region")
          # print(r)
          # print(len(r.coords))
          # print(r.getWidth(), r.getHeight())

          for dx in range(r.getSmallestX(), r.getLargestX() + 1):
            for dy in range(r.getSmallestY(), r.getLargestY() + 1):
              # print(dx, dy)
              place = config.translate(dx, dy)
              place.setRegion(r)
              if (self._fits(place)):
                # print("Fits!")
                places.append(place)

    print("Possible configurations:",len(places))
    return places

  def convertToDlx(self):

    totalPieceCoords = sum(len(p.coords) for p in self.pieces)
    regionArea = len(self.region.coords)

    self._generateVirtualRegions()
    
    subproblems = []

    recipes = self._generateAllPossibleRecipes(self.pieces)

    print("All recipes:")
    for recipe in recipes:
      print([p.name for p in recipe])

    # print("a")

    for recipe in recipes:

      # Columns are indexed by pieces followed by region coordinates:
      # p_1 p_2 p_3 ... p_n | (x0, y0) (x1, y1) (x2, y2) ... (xk, yk)

      # Each row will assert that piece p_i may exist at certain coordinates in the region, which
      # is indicated by placing a 1 at column p_i and 1's at the columns of the coordinates it occupies.
      # A solution is then a subset of rows so that 1 appears exactly once in each column.

      recipe.sort(key = lambda p: -len(p.coords))

      # The first row is a sort of metadata that indicates if this column is essential or not.
      # All piece-columns are essential (because all pieces must be placed).
      # Tile-columns are only essential if they must be covered (critters, letter-clues).
      # The solving algorithm doesn't halt when the submatrix is empty, but rather, when none of the remaining columns are essential.

      #The second row is an index for the type of column. 0 = Column piece, 1 = Main region, 2+ = Virtual regions.
      headerRow1 = [1] * len(recipe)
      headerRow2 = [0] * len(recipe)
      for k, r in enumerate(self.regions):
        headerRow1 += [0] * len(r.coords)
        headerRow2 += [k + 1] * len(r.coords)
      
      # print(headerRow1, headerRow2)
      rowSize = len(headerRow1)

      # TODO add critters and letter-clues
      for c in self.region.critters:
        tileIndex = self.region.coords.index(c)
        headerRow1[tileIndex + len(recipe)] = 1

        for k, r in enumerate(self.regions[1:]): #Increment essentiality of overlapping tiles in virtual regions (Jessie what the fuck are you talking about?)
          # print(f"Virtual region {k + 1}")
          # print(self.overlapMatrix[r.col:r.col + len(r.coords), :])
          # print("Specifically")
          # print(self.overlapMatrix[r.col:r.col + len(r.coords),tileIndex])
          # print(np.where(self.overlapMatrix[r.col:r.col + len(r.coords),tileIndex] == 0.25)[0])
          # time.sleep(10)
          virtual_overlaps = np.where(self.overlapMatrix[r.col:r.col + len(r.coords),tileIndex] == 0.25)[0]
          # print(virtual_overlaps)
          if len(virtual_overlaps) > 0:
            overlapping, _ = self._getOverlappingCoords(c, self.region, r) #Including cells not in the virtual grid, so different from virtual_overlaps.
            for v in virtual_overlaps:
              headerRow1[r.col + v + len(recipe)] += 1 / len(overlapping)
              r.critters.append(r.coords[v])
      for c in self.region.clues:
        tileIndex = self.region.coords.index(c[0])
        headerRow1[tileIndex + len(recipe)] = 1

        for k, r in enumerate(self.regions[1:]): #Increment essentiality of overlapping tiles in virtual regions (Jessie what the fuck are you talking about?)
          virtual_overlaps = np.where(self.overlapMatrix[r.col:r.col + len(r.coords),tileIndex] == 0.25)[0]
          # print(virtual_overlaps)
          if len(virtual_overlaps) > 0:
            overlapping, _ = self._getOverlappingCoords(c[0], self.region, r)
            for v in virtual_overlaps:
              headerRow1[r.col + v + len(recipe)] += 1 / len(overlapping)
              r.clues.append([r.coords[v], c[1]])

      self.matrix = [headerRow1, headerRow2]

      validRecipe = True
      for clue in self.region.clues:
        if not any(p.baseName == clue[1] for p in recipe):
          # print("Impossible to match the letter clues with this recipe. Ignoring.")
          validRecipe = False
          break
      
      if not validRecipe:
        continue

      for k, piece in enumerate(recipe):
        configs = self._generateAllPossibleConfigurations(piece)

        # print(f"Found {len(configs)} possible placements of piece number {k + 1} ({piece.name}).")

        if len(configs) == 0:
          # print("Invalid recipe. Ignoring.")
          validRecipe = False
          break

        # print("AAAAA")
        for config in configs:

          clued = False
          #A config will be discarded if it's adjacent to a letter-clue, or if it overlaps a clue of the wrong letter.
          #If the config overlaps a correct clue, its adjacent tiles will be set to 0.5 in its matrix row.
          if len(config.region.clues) > 0:
            adjacent = config.getAdjacentCoords()

            valid = True
            for clue in config.region.clues:
              if clue[0] in adjacent and config.region == self.region:
                valid = False
                break
              
              if clue[0] in config.coords:
                if clue[1] == config.baseName:
                  clued = True
                else:
                  valid = False
                  break
            
            if not valid:
              continue #Discard this piece placement

          row = [0] * rowSize

          regionIdx = self.regions.index(config.region)
          offset = len(self.pieces) + sum([len(r.coords) for r in self.regions[:regionIdx]])

          for c in config.coords:
            ind = config.region.coords.index(c)
            row[offset + ind] = 1
          
          # print("Before mult")
          # print(row)
          # row = row[:len(self.pieces)] + (np.matmul(self.overlapMatrix, row[len(self.pieces):])).tolist()
          # # print("Temp")
          # # print(row)

          # def remap(x):
          #   if x == 0:
          #     return 0.
          #   elif x == 1:
          #     return 1.
          #   else:
          #     return .5
          
          # vfunc = np.vectorize(remap)
          # row = vfunc(row)
          # # print("Mult")

          # if len(config.coords) > 3:
          #   print("before")
          #   print(row)

          row_mult = np.matmul(self.overlapMatrix, row[len(self.pieces):]).tolist()
          for kk,v in enumerate(row_mult):
            # if len(config.coords) > 3:
            #   print(v, v not in [0, 1], row[kk + len(self.pieces)], row[kk + len(self.pieces)] != 1)
            if v != 0 and row[kk + len(self.pieces)] != 1:
              # if len(config.coords) > 3:
              #     print("cock")
              row_mult[kk] = .5

          row = row[:len(self.pieces)] + row_mult
          row[k] = regionIdx + 1 #Piece index
          # print("After mult")
          # print(row)

          # if len(config.coords) > 3:
          #   print("after")
          #   print(row)
            # time.sleep(1)
          
          if clued:
            for a in adjacent:
              if a in config.region.coords:
                tileIndex = config.region.coords.index(a)
                regionIdx = self.regions.index(config.region)
                offset = len(self.pieces) + sum([len(r.coords) for r in self.regions[:regionIdx]])
                row[tileIndex + offset] = 0.25
          
          self.matrix.append(row)
      
      if not validRecipe:
        continue

      self.matrix = np.vstack(self.matrix)

      #Serves as an offset for all the virtual essentiality we added in the virtual regions' columns.
      base_essentiality = np.sum(self.matrix[0,len(self.pieces) + len(self.region.coords):])

      # print("Region definitions:")
      # for k, r in enumerate(self.regions):
      #   print(f"Region {k + 1}: {r.dx, r.dy, r.ox} ({len((r.coords))} coordinates)")

      print("Regions")
      for r in self.regions:
        print_polyomino(r)

      # print("Recipe:")
      # print([p.name for p in recipe])

      print("Matrix")
      print(self.matrix)

      print("Overlap Matrix")
      print(np.where(self.overlapMatrix[:38, 40:] >= 1))
      # time.sleep(10)

      subproblems.append({'matrix': self.matrix, 'recipe': recipe, 'base_essentiality': base_essentiality})

    def findOneIndices(arr):
      return [k for k,v in enumerate(arr) if v == 1]

    # In our case, some indices are 0<x<1, to account for Abdec's adjacency rules.
    def findPositiveIndices(arr):
      return [k for k,v in enumerate(arr) if v > 0]

    #This takes the solution rows and turns them back into (placed) shapes.
    def interpreter(solution):
      if solution == []:
        print("No solution was found for this puzzle.")
        return
      
      pieces = []
      
      for row in solution:
        print("row",row)
        regionIndex = next(p for p in row if p >= 1)
        print("region index",regionIndex)
        region = self.regions[int(regionIndex) - 1]
        pieceCoordsIndices = [k for k, v in enumerate(row[len(solution) + region.col : len(solution) + region.col + len(region.coords)]) if v == 1]
        print("piececoords indices", pieceCoordsIndices)
        pieceCoords = [region.coords[k] for k in pieceCoordsIndices]
        print("region coords", region.coords)
        print("piececoords",pieceCoords)

        # coordIndicesOne = findOneIndices(row[len(self.pieces):]) #Ignore piece-columns
        # coordIndicesPos = findPositiveIndices(row[len(self.pieces):])
        # coordIndicesInvalid = [c for c in coordIndicesPos if c not in coordIndicesOne]
        # regionIndices = []

        offset = 0
        # foundRegion = False
        # for k, r in enumerate(self.regions):
        #   # print("Offset ",offset)
        #   nbCoords = len(r.coords)
        #   if any([offset <= c < offset + nbCoords for c in coordIndicesOne]) and not any([offset <= c < offset + nbCoords for c in coordIndicesInvalid]):
        #     foundRegion = True
        #     break
        #   offset += nbCoords
        
        # assert(foundRegion)
        # print("offset",offset)

        # print("Header and Solution row:")
        # print(np.vstack([range(len(row)), self.matrix[0: 2, :], row]))
        # print("CoordIndicesOne:")
        # print(coordIndicesOne)
        # print("Region sizes:")
        # for w in self.regions:
        #   print(len(w.coords))
        
        # print([c - offset for c in coordIndicesOne])
        
        
        #The correct region is the one that only contains OneIndices (no PosIndices which indicate partial covering)
        piece = Polyomino(pieceCoords)
        piece.setRegion(region)
        pieces.append(piece)
      
      return pieces

    return {'problems': subproblems, 'interpreter': interpreter}

