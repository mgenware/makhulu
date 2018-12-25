import * as mk from '../';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

(async () => {
  const dataList = new mk.DataList([1, 2, 3].map(i => ({ n: i })), true);
  await dataList.map('Add random values', async d => {
    const ms = getRandomInt(10, 3000);
    await mk.sleep(ms);
    (d.n as number) += ms;
    return d;
  });

  await dataList.map('Do nothing', async d => {
    await mk.sleep(1000);
    return d;
  });

  await dataList.filter('Filter out even numbers', async d => {
    const ms = getRandomInt(10, 3000);
    await mk.sleep(ms);
    return (d.n as number) % 2 === 1;
  });
})();
