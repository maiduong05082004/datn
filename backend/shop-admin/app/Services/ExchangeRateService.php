<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use GuzzleHttp\Client;
use Log;

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
        return Cache::remember('vnd_to_usd_rate', 3600, function () {
            $response = $this->client->get("https://v6.exchangerate-api.com/v6/{$this->apiKey}/latest/VND");
            $data = json_decode($response->getBody(), true);
            Log::info("Exchange rate API response: " . json_encode($data)); // Log toàn bộ dữ liệu
    
            if ($data['result'] !== 'success' || !isset($data['conversion_rates']['USD'])) {
                throw new \Exception('Invalid exchange rate data.');
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
        if ($rate <= 0 || !is_numeric($rate)) {
            Log::error("Invalid exchange rate fetched: $rate");
            throw new \Exception('Tỷ giá không hợp lệ.');
        }
        Log::info('Current VND to USD rate: ' . $rate);
        return round($amountVnd * $rate, 2); // Chỉnh lại công thức tính 
    }
}
