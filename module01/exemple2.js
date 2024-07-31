import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 20 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95)<200'],
    }
};

const data = new SharedArray('test data', function() {
    const fileData = JSON.parse(open('./data.json'));
    if (!fileData || !fileData.crocodiles) {
        console.error("Erro ao carregar os dados do arquivo data.json");
        return [];
    }
    return fileData.crocodiles;
});

export default function () {
    if (data.length === 0) {
        console.error("Nenhum dado disponível para o teste");
        return;
    }

    const crocodile = data[Math.floor(Math.random() * data.length)].id;
    console.log(`Crocodile ID: ${crocodile}`);
    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${crocodile}/`;

    const res = http.get(BASE_URL);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    // Adicione um tempo de espera entre as requisições
    sleep(1);
}