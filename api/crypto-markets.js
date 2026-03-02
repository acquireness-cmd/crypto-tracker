export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d"
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data" });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
