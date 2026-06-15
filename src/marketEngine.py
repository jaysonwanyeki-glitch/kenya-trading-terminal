import json
import random
from datetime import datetime

# Nairobi Trading Hours (EAT)
NSE_OPEN_HOUR = 9
NSE_CLOSE_HOUR = 15 # Market closes *at* 15:00, so trading hours are 9:00-14:59

def get_market_status(current_hour: int) -> str:
    """
    Checks the current hour and returns the market activity state.
    Assumes current_hour is in East Africa Time (EAT).
    """
    if NSE_OPEN_HOUR <= current_hour < NSE_CLOSE_HOUR:
        if NSE_OPEN_HOUR <= current_hour < 11: # 09:00 - 10:59
            return "PEAK HOURS (09:00 - 11:00 EAT)"
        elif 13 <= current_hour < 14: # 13:00 - 13:59
            return "LUNCH LIQUIDITY DIP (13:00 - 14:00 EAT)"
        else: # 11:00 - 12:59 or 14:00 - 14:59
            return "NORMAL TRADING"
    else:
        return "MARKET CLOSED"

# --- Simulate Live Pricing Streams ---
# Initial prices (can be adjusted)
_current_prices = {
    "SCOM": {"price": 18.50, "volatility": 0.015},
    "KCB": {"price": 31.00, "volatility": 0.01},
    "USD/KES": {"price": 130.50, "volatility": 0.005},
    "Tea Index": {"price": 250.75, "volatility": 0.008},
}

def _generate_price_change(current_price: float, volatility: float) -> float:
    """Generates a small random price change based on volatility."""
    change_percent = (random.random() * 2 - 1) * volatility
    new_price = current_price * (1 + change_percent)
    return round(max(0.01, new_price), 4) # Ensure price is not negative and round to 4 decimal places

def get_safaricom_price() -> str:
    """Simulates the live price stream for Safaricom (SCOM)."""
    current_scom = _current_prices["SCOM"]
    new_price = _generate_price_change(current_scom["price"], current_scom["volatility"])
    _current_prices["SCOM"]["price"] = new_price
    return json.dumps({"symbol": "SCOM", "price": new_price, "timestamp": datetime.now().isoformat()})

def get_kcb_price() -> str:
    """Simulates the live price stream for KCB Group."""
    current_kcb = _current_prices["KCB"]
    new_price = _generate_price_change(current_kcb["price"], current_kcb["volatility"])
    _current_prices["KCB"]["price"] = new_price
    return json.dumps({"symbol": "KCB", "price": new_price, "timestamp": datetime.now().isoformat()})

def get_usd_kes_forex_price() -> str:
    """Simulates the live price stream for USD/KES Forex."""
    current_usd_kes = _current_prices["USD/KES"]
    new_price = _generate_price_change(current_usd_kes["price"], current_usd_kes["volatility"])
    _current_prices["USD/KES"]["price"] = new_price
    return json.dumps({"symbol": "USD/KES", "price": new_price, "timestamp": datetime.now().isoformat()})

def get_tea_index_price() -> str:
    """Simulates the live price stream for Tea grading commodity indexes."""
    current_tea_index = _current_prices["Tea Index"]
    new_price = _generate_price_change(current_tea_index["price"], current_tea_index["volatility"])
    _current_prices["Tea Index"]["price"] = new_price
    return json.dumps({"symbol": "Tea Index", "price": new_price, "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    # Example Usage:
    print("Market Status at different hours (EAT):")
    for hour in range(0, 24):
        print(f"Hour {hour:02d}:00 EAT - {get_market_status(hour)}")

    print("\nSimulated Live Pricing Streams:")
    for _ in range(3): # Get 3 price updates for each
        print(get_safaricom_price())
        print(get_kcb_price())
        print(get_usd_kes_forex_price())
        print(get_tea_index_price())
        print("-" * 20)
