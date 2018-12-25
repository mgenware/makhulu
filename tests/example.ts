import * as mk from '../';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

(async () => {
  const dataList = new mk.DataList([1, 2, 3].map(i => ({ n: i })));
  await dataList.map('1', async d => {
    const ms = getRandomInt(10, 3000);
    await mk.sleep(ms);
    return d;
  });

  await dataList.map('2', async d => {
    await mk.sleep(1000);
    return d;
  });

  await dataList.filter('filter', async d => {
    const ms = getRandomInt(10, 3000);
    await mk.sleep(ms);
    console.log('f ', d);
    return d.n !== 2;
  });
})();
