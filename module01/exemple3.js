import http from "k6/http";
import { check, sleep } from "k6";

//load 10 vu for 10 segunds
//request with sucess rate > 95%
//request with fail rate < 1%
//request with 95 percentile < 500ms
export const options = {
    stages : [{duration: '10s', target: 10}],
    thresholds : {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'] 
    }
}

export default function(){
    const BASE_URL = 'https://test-api.k6.io/';
    const USER= `${Math.random().toString(36).substring(2)}@mail.com`;
    const PASS= '123';

    console.log(USER + PASS);	
    const res = http.post(`${BASE_URL}/user/register`, {
    first_name: 'New_crododile',
    last_name: 'dile',
    email: USER,
    password: PASS
    });

    check(res, {
        'status is 201': (r) => r.status === 201,
    });
    sleep(1);
}
