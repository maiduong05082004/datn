<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use GuzzleHttp\Client;

class ExchangeRateService
{
    protected $apiKey;
    protected $client;

    public function __construct()
    {
        $this->apiKey = config('services.exchangerateapi.key');
        $this->client = new Client();
    }

    /**
     * Lấy tỷ giá hối đoái từ VND sang USD
     *
     * @return float
     */
    public function getVndToUsdRate()
    {
        // Kiểm tra cache trước
        return Cache::remember('vnd_to_usd_rate', 3600, function () {
            $response = $this->client->get("https://v6.exchangerate-api.com/v6/{$this->apiKey}/latest/VND");

            if ($response->getStatusCode() !== 200) {
                throw new \Exception('Không thể lấy tỷ giá hối đoái.');
            }

            $data = json_decode($response->getBody(), true);

            if ($data['result'] !== 'success') {
                throw new \Exception('Lỗi khi lấy dữ liệu tỷ giá hối đoái.');
            }

            return $data['conversion_rates']['USD'];
        });
    }

    /**
     * Chuyển đổi VND sang USD
     *
     * @param float $amountVnd
     * @return float
     */
    public function convertVndToUsd($amountVnd)
    {
        $rate = $this->getVndToUsdRate();
        return round($amountVnd / $rate, 2);
    }
}
