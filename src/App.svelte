<script>
    import loadingGif from './assets/loading.gif';

    import { Polyomino, tetrominos } from './js/Polyomino.js';
    import PolyominoProblem from './js/PolyominoProblem.js';
    import SatSolverWorker from 'worker-loader!./js/SatSolverWorker.js';

    let localState = JSON.parse(localStorage.getItem('polyomino-solver-state')) || {
        savedPolyomino: [],
        size: 10,
        regionCoords: null,
    };

    // UI Data
	let polyominos = localState.savedPolyomino || [];
    let regionCoords = localState.regionCoords || [];
    let settings = {
        method: 'method-dlx',
        allowRotation: true,
        allowReflection: false,
    }
    let polyCreateSize = 7;
    let regionCreateSize = localState.size || 10;
    let selectedTab = 'polyomino';
    $: largestPolySize = Math.max(2, ...polyominos.map(coords => new Polyomino(coords).getSize()));

    // Technical state
    let currentProblem = { polyProblem: null, convertedProblem: null, interpreter: null, time: null, solutionCoords: null };

    function resetIfWorkComplete() {
        if (workComplete) currentProblem = {};
        console.log('reset', currentProblem);
    }

    // When viewing the solution, any change to the settings should reset the UI.
    $: settings && resetIfWorkComplete();
    $: polyominos && resetIfWorkComplete();

    // Inferences based on currentProblem
    $: working = currentProblem.polyProblem != null && currentProblem.time == null;
    $: workComplete = currentProblem.time != null;
    $: foundSolution = currentProblem.solutionCoords != null;

    // Worker and worker status
    let worker = new SatSolverWorker();
    let workerBusy = false;
    worker.onmessage = handleWorkerMessage;

    $: if (settings.method == 'method-z3') {
        worker.postMessage('loadZ3');
        workerBusy = true;
    }

    let polyCreateEl;
    function addCustomPolyomino() {
        // Normalize the coordinates first
        let p = new Polyomino(polyCreateEl.value).normalize();
        polyominos = [ ...polyominos, p.coords ];
    }

    function handleWorkerMessage(event) {
        if (event.data == 'z3Loaded') {
            return workerBusy = false;
        } else {
            // Update currentProblem based on worker results
            currentProblem.time = event.data.time;

            if (event.data.solution != null) {
                let solutionPolys = currentProblem.interpreter(event.data.solution);
                // Data for polyomino-control in 'display-multiple' mode; display 
                // problem region first in white in case of an inexact solution.
                currentProblem.solutionCoords = [
                    currentProblem.polyProblem.region.coords,
                    ...solutionPolys.map(x => x.coords)
                ];
            }
            return workerBusy = false;
        }
    }

    // Makeshift two-way binding on create-region control
    let regionCreateEl = null;
    $: if (regionCreateEl != null && regionCreateEl.value != regionCoords) {
        regionCreateEl.value = regionCoords;
    }

    function solve() {
        let polyProblem = new PolyominoProblem(
            polyominos.map(coords => new Polyomino(coords)),
            new Polyomino(regionCoords),
            settings.allowRotation,
            settings.allowReflection,
        );

        let solveMethod = settings.method.split('-')[1];

        let { convertedProblem, interpreter } =
            solveMethod == 'sat' ? polyProblem.convertToSAT() :
            solveMethod == 'z3' ? polyProblem.convertToZ3() :
            solveMethod == 'dlx' ? polyProblem.convertToDlx() :
            polyProblem.convertToDlx();

        currentProblem = { polyProblem, convertedProblem, interpreter };

        worker.postMessage({ type: solveMethod, problem: convertedProblem });
        workerBusy = true;
    }
</script>

<div class="top-bar">
	<div class="top-bar-left">
		<ul class="dropdown menu" data-dropdown-menu>
			<li class="menu-text">Polyomino Solver</li>
		</ul>
	</div>
	<div class="top-bar-right">
		<ul class="menu">
			<li><a target="_blank" href="https://github.com/cemulate/polyomino-solver">View on Github</a></li>
		</ul>
	</div>
</div>

<div class="grid-x grid-padding-x grid-padding-y">

	<div class="cell xlarge-3 medium-6 small-12">

		<ul class="tabs flex-container" data-tabs id="create-tabs">
			<li class="tabs-title flex-child-auto" class:is-active={ selectedTab == 'polyomino' }>
                <a href="#tab-polyomino" role="tab" aria-selected={ selectedTab == 'polyomino' } on:click|preventDefault={ e => selectedTab = 'polyomino' }>Polyomino</a>
            </li>
			<li class="tabs-title flex-child-auto" class:is-active={ selectedTab == 'tetromino' }>
                <a href="#tab-tetromino" role="tab" aria-selected={ selectedTab == 'tetromino' } on:click|preventDefault={ e => selectedTab = 'tetromino' }>Tetrominos</a>
            </li>
		</ul>

		<div class="tabs-content">
			<div class="tabs-panel" class:is-active={ selectedTab == 'polyomino' }>
				<polyomino-control id="poly-create" bind:this={ polyCreateEl } size={ polyCreateSize }></polyomino-control>
				<div class="grid-x grid-padding-x align-middle">
					<div class="cell shrink">
                        <button class="button hollow size-button" on:click={e => polyCreateSize = Math.max(2, polyCreateSize - 1) }>⇲</button>
						<button class="button hollow size-button" on:click={e => polyCreateSize += 1}>⇱</button>
					</div>
					<div class="cell auto">
						<button class="button expanded" on:click={ addCustomPolyomino }>Add</button>
					</div>
				</div>
			</div>
			<div class="tabs-panel" class:is-active={ selectedTab == 'tetromino' }>
				{#each Object.entries(tetrominos) as [ name, tetromino ]}
                    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                    <polyomino-control 
                        size="4"
                        mode="display"
                        class="tetromino"
                        value={ tetromino.coords }
                        on:click={ e => {
                            polyominos = [ ...polyominos, [ ...e.target.value ] ];
                        } }
                    ></polyomino-control>
                {/each}
			</div>
		</div>

	</div>

	<div class="cell xlarge-3 medium-6 small-12">
		<p><strong>Polyominos to be fit</strong> <small>(click to remove)</small></p>
		<div class="callout">
			{#each polyominos as coords, index (coords) }
                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                <polyomino-control 
                    size={ largestPolySize }
                    mode="display"
                    class="tetromino"
                    value={ coords }
                    on:click={ e => {
                        polyominos = polyominos.toSpliced(index, 1);
                    } }
                ></polyomino-control>
            {/each}
		</div>
	</div>

	<div class="cell xlarge-3 medium-6 small-12">
        {#if (workComplete && foundSolution)}
            <p><strong>Solution</strong></p>
            <polyomino-control
                id="region-create"
                size={ regionCreateSize } 
                mode="display-multiple"
                value={ currentProblem.solutionCoords || [] }
            ></polyomino-control>
        {:else}
            <p><strong>Destination region</strong></p>
            <polyomino-control 
                id="region-create"
                bind:this={ regionCreateEl }
                size={ regionCreateSize }
                on:change={ e => regionCoords = e.target.value }
                mode="create-region"
            ></polyomino-control>
        {/if}

        <button class="button hollow size-button" on:click={e => regionCreateSize = Math.max(2, regionCreateSize - 1) }>⇲</button>
        <button class="button hollow size-button" on:click={e => regionCreateSize += 1}>⇱</button>
	</div>
	
	<div class="cell xlarge-3 medium-6 small-12">
		<p><strong>Settings</strong></p>
		<div>
			<input type="checkbox" bind:checked={ settings.allowRotation }> Allow rotations
		</div>
		<div>
			<input type="checkbox" bind:checked={ settings.allowReflection }> Allow reflections
		</div>
		<hr>
		<div>
			<input type="radio" value="method-dlx" bind:group={ settings.method }> 
            Algorithm X (Dancing Links)
			<p><small>
				Reduces to an <a target="_blank" href="https://en.wikipedia.org/wiki/Exact_cover">exact cover problem</a>.
				Only finds <strong>exact</strong> solutions, but usually gives the best performance when an exact solution exists.
			</small></p>
		</div>
		<div>
            <input type="radio" value="method-sat" bind:group={ settings.method }> 
            SAT (JavaScript)
			<p><small>
				Reduces to <a target="_blank" href="https://en.wikipedia.org/wiki/Boolean_satisfiability_problem">SAT</a>.
				Will find <strong>partial (inexact)</strong> solutions, and is <strong>nondeterministic</strong>.
				Uses a <a target="_blank" href="https://www.npmjs.com/package/boolean-sat">JavaScript SAT solver</a>, and usually gives the best performance for small or easy problems.
			</small></p>
		</div>
		<div>
            <input type="radio" value="method-z3" bind:group={ settings.method }> 
			SAT (Z3)
			<p><small>
				Reduces to <a target="_blank" href="https://en.wikipedia.org/wiki/Boolean_satisfiability_problem">SAT</a>.
				Will find <strong>partial (inexact)</strong> solutions, and is <strong>deterministic</strong>.
				Solves SAT via a Webassembly build of the <a href="https://github.com/Z3Prover/z3">Z3 Theorem Prover</a>, and gives <em>better</em> performance for larger problems.
			</small></p>
		</div>
		<hr>
		<button
            class="button expanded"
            class:success={ !workComplete }
            class:hollow={ workComplete }
            disabled={ workerBusy }
            class:disabled={ workerBusy }
            on:click={ e => workComplete ? resetIfWorkComplete() : solve() }
        >{@html workComplete ? 'Reset' : 'Solve' }</button>
		{#if workerBusy}
            <div id="loading" style="margin-top: 15px; margin-bottom: 15px" class="grid-x">
                <div class="cell auto">
                    <img src={ loadingGif } alt="loading" style="display: block; margin: auto">
                </div>
            </div>
        {/if}
		<a id="clear-button" style="display: none" class="button expanded">Clear</a>
		{#if workComplete}
            <div id="solution-info" class="callout" class:alert={ !foundSolution } class:primary={ foundSolution }>
                {#if foundSolution } Found solution {:else} <strong>No solution</strong> {/if} in { (currentProblem.time / 1000).toFixed(3) } seconds.
            </div>
        {/if}
	</div>

</div>

<style>
#poly-create {
    display: block;
    margin-bottom: 15px;
    --cell-color: lightblue;
}

#region-create {
    background: lightgray;
}

#poly-create, #region-create {
    margin-bottom: 10px;
    width: 100%;
    aspect-ratio: 1;
    @media screen and (min-width: 1200px) {
        max-width: 32vw;
        margin-right: auto;
    }
}

.size-button {
    font-size: 2em !important;
    padding: 0.4em 0.2em 0.1em 0.2em;
    transform: scaleX(-1);
    color: black !important;
}

.tetromino {
    width: 60px;
    height: 60px;
    display: inline-block;
    margin: 0 10px 15px 10px;
    --cell-color: lightgreen;
}

.tetromino:hover {
    --cell-color: lightblue;
}
</style>