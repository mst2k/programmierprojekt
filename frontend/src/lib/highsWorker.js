importScripts('./highs.js');


onmessage = async function ({ data }) {
    console.log(data.prob)
  const highs = await Module();
  try {
      const start = performance.now();
      const sol = highs.solve(data.prob,  {
          "presolve": "on",
          log_to_console: "true"
      })
      const end= performance.now()
      const duration = (end-start)/1000
      sol.DurationSolving = duration
    postMessage({ solution: sol
    });
  } catch (error) {
    postMessage({ error: error.toString() });
  }
};