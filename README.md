# Polyomino Solver

Try it [here](https://cemulate.github.io/polyomino-solver).

Construct a collection of standard and/or completely custom polyominos, and an arbitrary region to fit them in, and this web app will find and display a valid tiling that places all of the polyominos in the region (if it exists).

It's a rewrite of a project I did a long time ago, focusing on using the latest and greatest web technologies (un-transpiled ES6, web components / custom elements, Webpack, Foundation 6's flexbox grid, etc.).

# How it works

It's known that for arbitrary grids and arbitrary sets of [polyominos](https://en.wikipedia.org/wiki/Polyomino), the problem of deciding whether or not the polyominos can fit together on the grid is an [NP-Complete](https://en.wikipedia.org/wiki/NP-completeness) problem. Being NP-Complete, we can convert a tiling problem into an instance of a [Boolean Satisfiability Problem](https://en.wikipedia.org/wiki/Boolean_satisfiability_problem), for which far more efficient solvers exist.

Tiling problems can be converted to SAT problems in the following manner:

- For every possible orientation and translation of each polyomino, a boolean variable is created signifying that "this piece can go on the board in this way"
- Add clauses that express "one piece can't exist in two different ways"
- Add clauses that express "each piece must go on the board in some way"
- Add clauses that express "two pieces cannot exist in a way that overlaps"

After this, we apply [boolean-sat](https://www.npmjs.com/package/boolean-sat) to solve the problem.
This is Javascript SAT solver based on my [forked repo](https://github.com/cemulate/SAT.js) of the original code written by Gregory Duck of at University of Singapore.

Note that solving this problem is extremely inefficient. The size of the SAT problem created grows with the square of the number of pieces, and linearly with board area. Not only that, but solving the SAT problem itself runs in exponential time. (And we're doing all of this in JS, because why not).

### My browser literally runs for days and/or crashes trying to find the solution

Yes, I'm not surprised. This woefully inefficient javascript algorithm will start to choke (that is, take too long or run out of memory) on a puzzle as small as an 8x7 grid with 14 pieces. What should you do if you want to solve these for real? You should head over to my [forked puzzle-tools repo](https://github.com/cemulate/puzzle-tools), the original script on which this web app is based. The README there has details, but its a script you can download and run with puzzle files, using a real SAT solver called [glucose](http://www.labri.fr/perso/lsimon/glucose/).
