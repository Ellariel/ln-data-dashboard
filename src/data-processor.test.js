// data-processor.test.js
let aggregateData;

beforeAll(async () => {
  const mod = await import('./data-processor.js');
  aggregateData = mod.aggregateData;
});

describe('aggregateData', () => {
  const raw = [
    { datetime: '2023-01-01', metricA: 10, metricB: 20 },
    { datetime: '2023-01-02', metricA: 30, metricB: 40 },
    { datetime: '2023-01-08', metricA: 50, metricB: 60 }, // next week
  ];

  test('daily aggregation returns same rows', () => {
    const result = aggregateData(raw, 'daily');
    expect(result).toHaveLength(3);
    expect(result[0].metricA).toBe(10);
    expect(result[2].metricB).toBe(60);
  });

  test('weekly aggregation averages correctly', () => {
    const result = aggregateData(raw, 'weekly');
    // Two weeks: first week includes first two rows, second week includes third row
    const week1 = result.find((r) => r.datetime.includes('W01'));
    const week2 = result.find((r) => r.datetime.includes('W02'));
    expect(week1.metricA).toBeCloseTo((10 + 30) / 2);
    expect(week2.metricA).toBe(50);
  });
});
