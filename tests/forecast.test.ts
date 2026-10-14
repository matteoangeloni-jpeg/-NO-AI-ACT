import { describe, it, expect } from 'vitest';
// Browser-native module also runs unchanged in the test runtime.
// @ts-expect-error JavaScript module intentionally has no TypeScript declarations.
import { predict, experiment } from '../analytics/dashboard/forecast.js';
describe('aggregate experimental forecasting',()=>{
  it('predicts constant series with every baseline',()=>{for(let i=0;i<5;i++)expect(predict(Array(14).fill(20),i)).toBe(20);});
  it('fits linear trends and floors negative projections',()=>{expect(predict([1,2,3],3)).toBe(4);expect(predict([3,2,1],3,5)).toBe(0);});
  it('repeats weekly seasonality',()=>{expect(predict([1,2,3,4,5,6,7],4,8)).toBe(1);});
  it('blocks missing or suppressed days rather than zero filling',()=>expect(experiment([], 'game_started','2026-10-01','2026-10-14').blocked).toBe(true));
  it('evaluates forecasts on preceding data only',()=>{
    const rows=Array.from({length:14},(_,i)=>({day:`2026-10-${String(i+1).padStart(2,'0')}`,event:'game_started',count:i+10}));
    const result=experiment(rows,'game_started','2026-10-01','2026-10-14',7);
    expect(result.scores[0].name).toBe('Trend lineare');expect(result.scores[0].mae).toBe(0);expect(result.forecasts[0].points[0]).toBe(24);
  });
});
