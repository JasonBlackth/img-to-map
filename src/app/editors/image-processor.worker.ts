/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  console.log('Worker received message:', data);
  const response = `worker response to ${data}`;
  postMessage(response);
});
