importScripts('./highs.js');


onmessage = async function ({ data }) {
    console.log(data.prob)
  const highs = await Module();
  try {
    postMessage({ solution: highs.solve(data.prob) });
  } catch (error) {
    postMessage({ error: error.toString() });
  }
};