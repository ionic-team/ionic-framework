onmessage = function (e) {
  console.log(e.data.value);
  postMessage(e.data.value + 1);
};
