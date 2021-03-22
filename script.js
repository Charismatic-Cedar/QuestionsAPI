import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  // vus: 10,
  // duration: '30s',
  stages: [
    { duration: '5s', target: 1000 },
    { duration: '5s', target: 500 },
    { duration: '5s', target: 200 },
  ],
};

export default function () {
  // let res = http.get('http://localhost:3200/qa/questions');
  // let res = http.get('http://localhost:3200/qa/questions/:question_id/answers');
  let res = http.post('http://localhost:3200/qa/questions/:question_id/answers');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
};


// Documentation:
// https://k6.io/docs/test-types/stress-testing