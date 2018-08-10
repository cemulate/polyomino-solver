# Polyomino Solver

Try it [here](https://cemulate.github.io/polyomino-solver).

Construct a collection of standard and/or completely custom polyominos, and an arbitrary region to fit them in, and this web app will find and display a valid tiling that places all of the polyominos in the region (if it exists).

It's a rewrite of a project I did a long time ago, focusing on using the latest and greatest web technologies (un-transpiled ES6, web components / custom elements, Webpack, Foundation 6's flexbox grid, etc.).

# How it works

### Algorithm X

Knuth's "Algorithm X" (implemented with "Dancing Links") is the best algorithm to handle this problem, by reducing it to an [Exact Cover Problem](https://en.wikipedia.org/wiki/Exact_cover).
The details are explained by Knuth himself in [his paper](https://arxiv.org/abs/cs/0011047).
I use [dlxlib](https://github.com/taylorjg/dlxlibjs/blob/master/src/dlx.js) as an implementation of Dancing Links, courtesy of [taylorgj](https://github.com/taylorjg).


### Converstion to SAT

The other two solving methods are much less efficient, and were the solutions I first discovered.

It's known that for arbitrary grids and arbitrary sets of [polyominos](https://en.wikipedia.org/wiki/Polyomino), the problem of deciding whether or not the polyominos can fit together on the grid is an [NP-Complete](https://en.wikipedia.org/wiki/NP-completeness) problem. Being NP-Complete, we can convert a tiling problem into an instance of a [Boolean Satisfiability Problem](https://en.wikipedia.org/wiki/Boolean_satisfiability_problem), for which efficient solvers exist.

Tiling problems can be converted to SAT by introducing a boolean variable for each configuration that each piece could possibly exist in, and then adding clauses that state that a piece must exist in exactly one configuration, and no configurations can overlap.

#### Javascript SAT Solver

The problem is converted to a [CNF](https://en.wikipedia.org/wiki/Conjunctive_normal_form) file (a common input format for SAT solvers).
After that, [boolean-sat](https://www.npmjs.com/package/boolean-sat) is applied to solve the problem.
This is Javascript SAT solver based on my [forked repo](https://github.com/cemulate/SAT.js) of the original code written by Gregory Duck of at University of Singapore.
This is probably the least efficient method.
Since the SAT problem must be specified in CNF, even the input file can get very large very quickly.

#### Z3 Webassembly

This was born out of an attempt to make the preceding method faster.
Here, we convert the problem to [SMT](http://smtlib.cs.uiowa.edu/)
 format, and use the [Webassembly build](https://github.com/cpitclaudel/z3.wasm) of Microsoft Research's [Z3 Theorem Prover](https://github.com/Z3Prover/z3).
 Generally speaking, this is a tool that can check the satisfiability of first-order logic statements over arbitrary theories, but we only utilize it for the predicate logic subset.
