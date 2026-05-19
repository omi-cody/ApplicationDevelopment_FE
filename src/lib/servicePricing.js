const SERVICE_PRICING_KEY = 'bike360.service.pricing';

const defaultPricing = {
  halfService: 500,
  fullService: 1000,
};

export function getServicePricing() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SERVICE_PRICING_KEY) || '{}');
    return {
      halfService: Number(parsed.halfService) || defaultPricing.halfService,
      fullService: Number(parsed.fullService) || defaultPricing.fullService,
    };
  } catch {
    return defaultPricing;
  }
}

export function saveServicePricing(pricing) {
  const normalized = {
    halfService: Number(pricing.halfService) || defaultPricing.halfService,
    fullService: Number(pricing.fullService) || defaultPricing.fullService,
  };

  localStorage.setItem(SERVICE_PRICING_KEY, JSON.stringify(normalized));
  return normalized;
}

export function getDefaultServicePricing() {
  return defaultPricing;
}
