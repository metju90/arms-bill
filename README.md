# arms-bill

A tiny script to extract key data from an Arms bill.

It works by placing an Arms bill(s) in PDF format in `./arms-bills` folder. The script goes through each PDF and console logs an object with the extracted data like so:

```
{
  apartment: "Your apartment name",
  date: '24-APR-2023',
  invoice: '123456789',
  elecConsumptionDate: '24.01.2023-22.03.2023',
  waterConsumptionDate: '24.01.2023 - 22.03.2023',
  elecReading: '9956->10793A',
  waterReading: '187->205A',
  elecCost: '110.99',
  waterCost: '43.01'
}
```
